import DOMPurify from 'dompurify';
import { useEffect, useRef } from 'react';

const CreateRoleMode = ({
  setNewRole,
  newRole,
  onClose,
  handleRoleSubmit,
  roleError,
  setRoleError,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    onClose();
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
        <h2 className="text-lg font-semibold mb-4">Assign User Role</h2>
        <form onSubmit={handleRoleSubmit}>
          <label htmlFor="role-input" className="block text-sm font-medium text-gray-700 mb-2">
            Select Role
          </label>
          <input
            id="role-input"
            ref={inputRef}
            value={newRole}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            placeholder="e.g., Admin, Manager, User"
            onChange={(e) => {
              setNewRole(
                DOMPurify.sanitize(e.target.value, {
                  ALLOWED_TAGS: [],
                  ALLOWED_ATTR: [],
                })
              );
              setRoleError('');
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Allowed roles: Admin, Manager, User, Owner</p>
          {roleError && <div className="mt-2 text-red-600 text-sm font-medium">{roleError}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 cursor-pointer rounded hover:bg-gray-300 transition-colors font-medium"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
              type="submit"
              disabled={!newRole.trim()}
            >
              Assign Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoleMode;
