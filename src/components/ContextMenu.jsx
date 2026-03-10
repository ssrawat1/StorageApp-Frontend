import { useRef, useEffect, useState } from 'react';
import { useDirectoryContext } from '../context/DirectoryContext';
import { BACKEND_URL } from '../config';
import {
  Download,
  Pencil,
  Trash2,
  Info,
  X,
  FolderOpen,
  FileText,
  Loader2,
} from 'lucide-react';

function ContextMenu({ item, isUploadingItem }) {
  const menuRef = useRef(null);
  const [flipUp, setFlipUp] = useState(false);

  const { handleCancelUpload, setDeleteItem, openRenameModal, openDetailsPopup } =
    useDirectoryContext();

  // ── Flip upward if not enough space below
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 16) setFlipUp(true);
  }, []);

  const menuClass = `absolute right-0 bg-white border border-blue-200 rounded-xl shadow-xl text-sm z-50 overflow-hidden min-w-[168px] ${
    flipUp ? 'bottom-[110%]' : 'top-[110%]'
  }`;

  const itemClass =
    'flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 text-[13px]';

  const dangerClass =
    'flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 text-[13px]';

  const divider = <div className="h-px bg-blue-100 mx-3 my-0.5" />;

  const Header = ({ icon: Icon, label, color = 'blue' }) => (
    <div className={`flex items-center gap-2 px-4 py-2 border-b text-xs font-semibold uppercase tracking-widest select-none
      ${color === 'orange'
        ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100 text-orange-600'
        : 'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-100 text-blue-700'
      }`}>
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </div>
  );

  if (item.isDirectory) {
    return (
      <div ref={menuRef} className={menuClass}>
        <Header icon={FolderOpen} label="Folder" />
        <div className="py-1">
          <div className={itemClass} onClick={() => openRenameModal('directory', item.id, item.name)}>
            <Pencil size={13} className="text-blue-400" /> Rename
          </div>
          {divider}
          <div className={itemClass} onClick={() => openDetailsPopup(item)}>
            <Info size={13} className="text-indigo-400" /> Details
          </div>
          <div className={dangerClass} onClick={() => setDeleteItem(item)}>
            <Trash2 size={13} /> Delete
          </div>
        </div>
      </div>
    );
  }

  if (isUploadingItem && item.isUploading) {
    return (
      <div ref={menuRef} className={menuClass}>
        <Header icon={Loader2} label="Uploading" color="orange" />
        <div className="py-1">
          <div className={dangerClass} onClick={() => handleCancelUpload(item.id)}>
            <X size={13} /> Cancel Upload
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={menuRef} className={menuClass}>
      <Header icon={FileText} label="File" />
      <div className="py-1">
        <div
          className={itemClass}
          onClick={() => (window.location.href = `${BACKEND_URL}/file/${item.id}?action=download`)}
        >
          <Download size={13} className="text-emerald-500" /> Download
        </div>
        <div className={itemClass} onClick={() => openRenameModal('file', item.id, item.name)}>
          <Pencil size={13} className="text-blue-400" /> Rename
        </div>
        {divider}
        <div className={itemClass} onClick={() => openDetailsPopup(item)}>
          <Info size={13} className="text-indigo-400" /> Details
        </div>
        <div className={dangerClass} onClick={() => setDeleteItem(item)}>
          <Trash2 size={13} /> Delete
        </div>
      </div>
    </div>
  );
}

export default ContextMenu;