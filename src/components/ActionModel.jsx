import { useEffect } from 'react';

// Logout Modal Component
export const LogoutModal = ({ isOpen, user, onConfirm, onCancel }) => {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen || !user) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
        onClick={handleContentClick}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Logout User</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to logout <span className="font-semibold text-gray-900">{user.name}</span>?
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-sm text-gray-700">{user.email}</p>
        </div>
        <p className="text-xs text-gray-500 mb-6">They will need to log back in to continue.</p>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 cursor-pointer rounded hover:bg-gray-300 transition-colors font-medium"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-700 transition-colors font-medium"
            type="button"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Modal Component
export const DeleteModal = ({ isOpen, user, onConfirm, onCancel }) => {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen || !user) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
        onClick={handleContentClick}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Delete User</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{user.name}</span>?
        </p>
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-sm text-gray-700">{user.email}</p>
        </div>
        <p className="text-xs text-red-600 mb-6 font-medium">⚠️ This action cannot be undone.</p>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 cursor-pointer rounded hover:bg-gray-300 transition-colors font-medium"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-red-700 transition-colors font-medium"
            type="button"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};