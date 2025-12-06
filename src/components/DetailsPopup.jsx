import { useEffect } from 'react';

export const formatSize = (bytes = 0) => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  const TB = GB * 1024;

  if (bytes < KB) return `${bytes} Bytes`;
  if (bytes < MB) return `${(bytes / KB).toFixed(2)} KB`;
  if (bytes < GB) return `${(bytes / MB).toFixed(2)} MB`;
  if (bytes < TB) return `${(bytes / GB).toFixed(2)} GB`;
  return `${(bytes / TB).toFixed(2)} TB`;
};

function DetailsPopup({ item, onClose }) {
  if (!item) return null;

  const {
    id,
    name,
    isDirectory,
    createdAt,
    updatedAt,
    size,
    path,
    totalFiles,
    totalFolders,
    totalItems,
  } = item;

  // Clean the path
  const pathArray = path.split('/');
  if (pathArray[1]?.startsWith('root-')) {
    pathArray[1] = 'My Drive';
  }
  const fullCleanPath = pathArray.join('/');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Details</h2>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Name:</span> {name}
          </div>
          <div>
            <span className="font-semibold">Path:</span>
            <span
              className="mt-1 max-w-full truncate text-gray-700"
              title={fullCleanPath}
            >
              {fullCleanPath}
            </span>
          </div>
          <div>
            <span className="font-semibold">Size:</span> {formatSize(size)}
          </div>
          <div>
            <span className="font-semibold">Created At:</span>{' '}
            {new Date(createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Updated At:</span>{' '}
            {new Date(updatedAt).toLocaleString()}
          </div>
          {isDirectory && (
            <>
              <div>
                <span className="font-semibold">Files:</span> {totalFiles}
              </div>
              <div>
                <span className="font-semibold">Folders:</span> {totalFolders}
              </div>
              <div>
                <span className="font-semibold">Total Items:</span> {totalItems}
              </div>
            </>
          )}
          <div className="text-xs text-gray-500 break-all">ID: {id}</div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded cursor-pointer hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsPopup;