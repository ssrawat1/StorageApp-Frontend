export default function ActionModal({ isOpen, actionType, user, onConfirm, onCancel }) {
  if (!isOpen || !user) return null;

  const isDelete = actionType === 'delete';
  const isLogout = actionType === 'logout';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full animate-scaleIn">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDelete ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-center gap-3">
            {isDelete ? (
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M9 3v2M5.172 3a2 2 0 00-1.414.586L1.586 5.172A2 2 0 001 6.586V19a2 2 0 002 2h18a2 2 0 002-2V6.586a2 2 0 00-.586-1.414L19.242 3.586A2 2 0 0017.828 3H6.172z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
            <h2 className={`text-lg font-bold ${isDelete ? 'text-red-900' : 'text-blue-900'}`}>
              {isDelete ? 'Delete User' : 'Logout User'}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <p className="text-gray-700 text-sm mb-4">
            {isDelete
              ? `Are you sure you want to delete this user account? This action cannot be undone.`
              : `Are you sure you want to logout this user? They will need to log back in to continue.`}
          </p>
          <div className={`p-3 rounded-lg ${isDelete ? 'bg-red-50' : 'bg-blue-50'}`}>
            <p className={`text-sm font-semibold ${isDelete ? 'text-red-900' : 'text-blue-900'}`}>
              {user.name}
            </p>
            <p className={`text-xs ${isDelete ? 'text-red-700' : 'text-blue-700'}`}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${isDelete
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isDelete ? 'Delete' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
}
