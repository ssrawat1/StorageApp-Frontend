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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div 
          className="max-w-md w-full bg-red-50 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300 border border-red-100"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="flex items-start justify-between mb-4 gap-3">
            <div className="flex items-start gap-3 sm:gap-4 flex-1">
              {/* Icon Badge */}
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2.5 sm:p-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 pt-0.5">
                {title}
              </h1>
            </div>

            {/* Close Button */}
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1"
              aria-label="Close error modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Message */}
          <p className="text-gray-700 text-sm sm:text-base mb-5 sm:mb-6 ml-0 sm:ml-16 leading-relaxed">
            {errorMessage}
          </p>

          {/* Suggestions */}
          <div className="bg-white rounded-lg p-4 sm:p-5 mb-5 sm:mb-6 border border-red-100">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></span>
              What you can do
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li className="text-xs sm:text-sm text-gray-700 flex gap-2">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span>Check your file size and try uploading again.</span>
              </li>
              <li className="text-xs sm:text-sm text-gray-700 flex gap-2">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span>Refresh the page and try again.</span>
              </li>
              <li className="text-xs sm:text-sm text-gray-700 flex gap-2">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span>Check your internet connection and retry.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Try Again</span>
                <span className="inline xs:hidden">Retry</span>
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-gray-700 text-xs sm:text-sm font-semibold transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Refresh</span>
            </button>

            <button
              onClick={onDismiss}
              className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-gray-700 text-xs sm:text-sm font-semibold transition-all duration-200"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Dismiss</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full"></div>
        </div>
      </div>
    </>
  );
}