import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

function RenameModal({ renameType, renameValue, setRenameValue, onClose, onRenameSubmit }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const dotIndex = renameValue?.lastIndexOf('.');
      if (dotIndex > 0) {
        inputRef.current.setSelectionRange(0, dotIndex);
      } else {
        inputRef.current.select();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if input is empty or only whitespace
  const isInputEmpty = !renameValue || renameValue.trim() === '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isInputEmpty) {
      onRenameSubmit(e);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Rename {renameType === 'file' ? 'File' : 'Folder'}
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="rename-input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter new name
          </label>
          <input
            id="rename-input"
            ref={inputRef}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter new ${renameType === 'file' ? 'file' : 'folder'} name`}
            value={renameValue}
            onChange={(e) =>
              setRenameValue(
                DOMPurify.sanitize(e.target.value, {
                  ALLOWED_TAGS: [], // No HTML tags
                  ALLOWED_ATTR: [], // No attributes
                })
              )
            }
          />
          <p className="text-xs text-gray-500 mt-2">
            {renameType === 'file' ? 'File extension will be preserved' : 'Folder name will be updated'}
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 cursor-pointer rounded hover:bg-gray-300 transition-colors font-medium"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 cursor-pointer rounded transition-colors font-medium ${
                isInputEmpty
                  ? 'bg-blue-300 text-blue-50 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              type="submit"
              disabled={isInputEmpty}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameModal;