import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DirectoryHeader from './components/DirectoryHeader';
import CreateDirectoryModal from './components/CreateDirectoryModal';
import RenameModal from './components/RenameModal';
import DirectoryList from './components/DirectoryList';
import { DirectoryContext } from './context/DirectoryContext';
import ErrorModal from './components/ErrorModal';

import {
  getDirectoryItems,
  createDirectory,
  deleteDirectory,
  renameDirectory,
} from './api/directoryApi';

import { deleteFile, renameFile, uploadComplete, uploadInitiate } from './api/fileApi';
import DetailsPopup from './components/DetailsPopup';
import ConfirmDeleteModal from './components/ConfirmDeleteModel';
import { BACKEND_URL } from './config';
import { fetchUser } from './api/userApi';
import Breadcrumbs from './components/Breadcrumbs';

function DirectoryView() {
  const { dirId } = useParams();
  const navigate = useNavigate();

  const [directoryName, setDirectoryName] = useState('My Drive');
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false); // Add this
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [newDirname, setNewDirname] = useState('New Folder');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);

  const fileInputRef = useRef(null);

  // Single-file upload state
  const [uploadItem, setUploadItem] = useState(null);
  const xhrRef = useRef(null);

  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const openDetailsPopup = (item) => {
    console.log(item);
    setDetailsItem(item);
  };
  const closeDetailsPopup = () => setDetailsItem(null);

  const loadDirectory = async () => {
    try {
      const data = await getDirectoryItems(dirId);
      setDirectoryName(dirId ? data.name : 'My Drive');
      setDirectoriesList([...data.directories].reverse());
      setFilesList([...data.files].reverse());
      setBreadcrumbPath(data.breadcrumbPath);
    } catch (err) {
      if (err.response?.status === 401) navigate('/home');
      else {
        const errorMsg = err.response?.data?.error || err.message;
        setErrorMessage(errorMsg);
        setShowErrorModal(true); // Show modal when error occurs
      }
    }
  };

  // Auto-show modal when error message changes
  useEffect(() => {
    if (errorMessage && errorMessage !== 'Directory not found or you do not have access to it!') {
      setShowErrorModal(true);
    }
  }, [errorMessage]);

  useEffect(() => {
    loadDirectory();
    setActiveContextMenu(null);
  }, [dirId]);

  function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'pdf';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'image';
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'video';
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz':
        return 'archive';
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'html':
      case 'css':
      case 'py':
      case 'java':
        return 'code';
      default:
        return 'alt';
    }
  }

  function handleRowClick(type, id) {
    if (type === 'directory') navigate(`/directory/${id}`);
    else window.location.href = `${BACKEND_URL}/file/${id}`;
  }

  async function handleFileSelect(e) {
    const isAllowToProceed = confirm(
      'Files larger than 15MB will be skipped.\nDo you want to continue?'
    );

    if (!isAllowToProceed) {
      e.target.value = '';
      return;
    }

    const uploadSizeLimit = 250 * 1024 * 1024;

    const { storageLimit, storageUsed } = await fetchUser();
    const remainingStorage = storageLimit - storageUsed;

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > uploadSizeLimit) {
      setErrorMessage('File exceeds the 250MB upload limit.');
      setShowErrorModal(true);
      return;
    }

    if (file.size > remainingStorage) {
      setErrorMessage('Not enough storage space available.');
      setShowErrorModal(true);
      return;
    }

    if (uploadItem?.isUploading) {
      e.target.value = '';
      setErrorMessage('An upload is already in progress. Please wait.');
      setShowErrorModal(true);
      return;
    }

    const tempItem = {
      file,
      name: file.name,
      size: file.size,
      ContentType: file.type,
      id: `temp-${Date.now()}`,
      isUploading: true,
      progress: 0,
    };

    try {
      const data = await uploadInitiate({
        fileName: file.name,
        fileSize: file.size,
        fileContentType: file.type,
        parentDirectoryId: dirId || '',
      });

      const { fileId, uploadSignedUrl } = data;

      setFilesList((prev) => [tempItem, ...prev]);
      setUploadItem(tempItem);
      e.target.value = '';

      startUpload({ item: tempItem, uploadUrl: uploadSignedUrl, fileId });
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setShowErrorModal(true);
    }
  }

  function startUpload({ item, uploadUrl, fileId }) {
    console.log({ uploadUrl });
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open('PUT', uploadUrl);

    xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        const progress = (evt.loaded / evt.total) * 100;
        setUploadItem((prev) => (prev ? { ...prev, progress } : prev));
      }
    });

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const response = await uploadComplete(fileId);
        console.log({ response: response });
      } else {
        setErrorMessage('File upload failed!');
        setShowErrorModal(true);
      }
      setUploadItem(null);
      loadDirectory();
    };

    xhr.onerror = () => {
      setErrorMessage('Something went wrong!');
      setShowErrorModal(true);
      setFilesList((prev) => prev.filter((f) => f.id !== item.id));
      setUploadItem(null);
    };

    xhr.send(item.file);
  }

  function handleCancelUpload(tempId) {
    if (uploadItem && uploadItem.id === tempId && xhrRef.current) {
      xhrRef.current.abort();
    }
    setFilesList((prev) => prev.filter((f) => f.id !== tempId));
    setUploadItem(null);
  }

  async function confirmDelete(item) {
    try {
      if (item.isDirectory) {
        await deleteDirectory(item.id);
      } else {
        await deleteFile(item.id);
      }
      setDeleteItem(null);
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
      setShowErrorModal(true);
    }
  }

  async function handleCreateDirectory(e) {
    e.preventDefault();
    try {
      await createDirectory(dirId, newDirname);
      setNewDirname('New Folder');
      setShowCreateDirModal(false);
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
      setShowErrorModal(true);
    }
  }

  function openRenameModal(type, id, currentName) {
    setRenameType(type);
    setRenameId(id);
    setRenameValue();
    setShowRenameModal(true);
  }

  async function handleRenameSubmit(e) {
    e.preventDefault();
    try {
      if (renameType === 'file') await renameFile(renameId, renameValue);
      else await renameDirectory(renameId, renameValue);

      setShowRenameModal(false);
      setRenameValue('');
      setRenameType(null);
      setRenameId(null);
      loadDirectory();
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message);
      setShowErrorModal(true);
    }
  }

  useEffect(() => {
    const handleDocumentClick = () => setActiveContextMenu(null);
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const combinedItems = [
    ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
    ...filesList.map((f) => ({ ...f, isDirectory: false })),
  ];

  const isUploading = !!uploadItem?.isUploading;
  const progressMap = uploadItem ? { [uploadItem.id]: uploadItem.progress || 0 } : {};

  return (
    <DirectoryContext.Provider
      value={{
        handleRowClick,
        activeContextMenu,
        handleContextMenu: (e, id) => {
          e.stopPropagation();
          e.preventDefault();
          setActiveContextMenu((prev) => (prev === id ? null : id));
        },
        getFileIcon,
        isUploading,
        progressMap,
        handleCancelUpload,
        setDeleteItem,
        openRenameModal,
        openDetailsPopup,
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        {/* Error Modal - Replace old error popup */}
        <ErrorModal
          errorMessage={errorMessage}
          isVisible={showErrorModal}
          onDismiss={(e) => {
            setShowErrorModal("");
            setErrorMessage('');
           }}
          onRetry={() => {
            setShowErrorModal(false);
            setErrorMessage('');
            loadDirectory();
          }}
        />

        <DirectoryHeader
          directoryName={directoryName}
          onCreateFolderClick={() => setShowCreateDirModal(true)}
          onUploadFilesClick={() => fileInputRef.current.click()}
          fileInputRef={fileInputRef}
          filesList={filesList}
          handleFileSelect={handleFileSelect}
          disabled={errorMessage === 'Directory not found or you do not have access to it!'}
        />

        <div className="mx-2 md:mx-4 pb-8">
          <Breadcrumbs breadcrumbPath={breadcrumbPath} />

          {showCreateDirModal && (
            <CreateDirectoryModal
              newDirname={newDirname}
              setNewDirname={setNewDirname}
              onClose={() => setShowCreateDirModal(false)}
              onCreateDirectory={handleCreateDirectory}
            />
          )}

          {showRenameModal && (
            <RenameModal
              renameType={renameType}
              renameValue={renameValue}
              setRenameValue={setRenameValue}
              onClose={() => setShowRenameModal(false)}
              onRenameSubmit={handleRenameSubmit}
            />
          )}

          {detailsItem && <DetailsPopup item={detailsItem} onClose={closeDetailsPopup} />}

          {combinedItems.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center p-8 max-w-md">
                {errorMessage === 'Directory not found or you do not have access to it!' ? (
                  <>
                    <svg
                      className="w-16 h-16 mx-auto text-red-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <em className="text-xl font-semibold text-gray-800 mb-2">Access Denied</em>
                    <em className="text-gray-600">
                      Directory not found or you don't have permission to access it.
                    </em>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    <p className="text-xl text-gray-400 mb-2">Empty Folder</p>
                    <p className="text-gray-400">Upload files or create a folder to get started.</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <DirectoryList items={combinedItems} />
          )}

          {deleteItem && (
            <ConfirmDeleteModal
              item={deleteItem}
              onConfirm={confirmDelete}
              onCancel={() => setDeleteItem(null)}
            />
          )}
        </div>
      </div>
    </DirectoryContext.Provider>
  );
}

export default DirectoryView;
