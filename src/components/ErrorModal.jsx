import { AlertCircle, X, RotateCcw, Home } from 'lucide-react';

export default function ErrorModal({ 
  errorMessage, 
  onDismiss, 
  onRetry = null,
  isVisible 
}) {
  if (!isVisible || !errorMessage) return null;

  // Map error messages to titles
  const getErrorTitle = (message) => {
    if (message.includes('250MB')) return 'Upload Failed';
    if (message.includes('storage')) return 'Storage Full';
    if (message.includes('permission')) return 'Access Denied';
    if (message.includes('not found')) return 'Not Found';
    return 'Error Occurred';
  };

  const title = getErrorTitle(errorMessage);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onDismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              {/* Icon Badge */}
              <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900">
                {title}
              </h1>
            </div>

            {/* Close Button */}
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Close error modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Message */}
          <p className="text-gray-600 text-sm mb-6 ml-16">
            {errorMessage}
          </p>

          {/* Suggestions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              What you can do
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700 flex gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Check your file size and try uploading again.</span>
              </li>
              <li className="text-sm text-gray-700 flex gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Refresh the page and try again.</span>
              </li>
              <li className="text-sm text-gray-700 flex gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Check your internet connection and retry.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={onDismiss}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Dismiss
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"></div>
        </div>
      </div>
    </>
  );
}