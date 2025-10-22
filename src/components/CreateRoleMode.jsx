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
        <h2 className="text-lg font-semibold mb-4">Create a New Role</h2>
        <form onSubmit={handleRoleSubmit}>
          <input
            ref={inputRef}
            value={newRole}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            placeholder="Enter role name"
            onChange={(e) => {
              setNewRole(DOMPurify.sanitize(e.target.value), {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
              });
              setRoleError('');
            }}
          />
          {roleError && <span className="text-red-600 text-xs">{roleError}</span>}
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-600"
              type="submit"
            >
              Create Role
            </button>
            <button
              className="bg-gray-300 text-black px-4 py-2 cursor-pointer rounded hover:bg-gray-400"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoleMode;
