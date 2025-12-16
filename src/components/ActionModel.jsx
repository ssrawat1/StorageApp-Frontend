import { useEffect } from 'react';

// Reusable Action Modal Component
const ActionModal = ({
  isOpen,
  user,
  onConfirm,
  onCancel,
  actionType = 'logout', // 'logout' or 'delete'
  config = {}, // customizable config
}) => {
  // Default configurations
  const defaultConfigs = {
    logout: {
      title: 'Logout User',
      message: 'Are you sure you want to logout',
      subMessage: 'They will need to log back in to continue.',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      warningText: '',
    },
    delete: {
      title: 'Delete User',
      message: 'Are you sure you want to delete',
      subMessage: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      warningText: '⚠️ This action cannot be undone.',
    },
  };

  const currentConfig = { ...defaultConfigs[actionType], ...config };

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
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {currentConfig.title}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {currentConfig.message}{' '}
          <span className="font-semibold text-gray-900">{user.name}</span>?
        </p>
        <div className={`${currentConfig.bgColor} border ${currentConfig.borderColor} rounded p-3 mb-4`}>
          <p className="text-sm text-gray-700">{user.email}</p>
        </div>
        {currentConfig.warningText && (
          <p className={`text-xs ${actionType === 'delete' ? 'text-red-600 font-medium' : 'text-gray-500'} mb-6`}>
            {currentConfig.warningText}
          </p>
        )}
        {!currentConfig.warningText && (
          <p className="text-xs text-gray-500 mb-6">{currentConfig.subMessage}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 cursor-pointer rounded hover:bg-gray-300 transition-colors font-medium"
            type="button"
            onClick={onCancel}
          >
            {currentConfig.cancelText}
          </button>
          <button
            className={`${currentConfig.buttonColor} text-white px-4 py-2 cursor-pointer rounded transition-colors font-medium`}
            type="button"
            onClick={onConfirm}
          >
            {currentConfig.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;