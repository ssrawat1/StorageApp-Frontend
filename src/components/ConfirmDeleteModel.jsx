import { useEffect } from 'react';

function ConfirmDeleteModal({ item, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  if (!item) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onCancel();
  };

  const isFolder = item.isDirectory;
  const itemType = isFolder ? 'Folder' : 'File';

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
        onClick={handleContentClick}
      >
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-50 rounded-full p-3">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Delete {itemType}</h2>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete the "{item.name}" {itemType.toLowerCase()}?
        </p>

        {/* Item Details */}
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-sm text-gray-700 font-medium">
            {item.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isFolder ? 'Folder' : 'File'}
          </p>
        </div>

        {/* Warning Message */}
        <p className="text-xs text-red-600 font-medium mb-6">
          ⚠️ This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 cursor-pointer rounded hover:bg-gray-300 transition-colors font-medium"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-red-700 transition-colors font-medium shadow-sm"
            type="button"
            onClick={() => onConfirm(item)}
          >
            Delete {itemType}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;