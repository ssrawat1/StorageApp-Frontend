export default function GoogleAuthModal({ isOpen, status, errorMessage }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-sm w-full text-center">
        {status === 'loading' && (
          <>
            {/* Spinner */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>

            {/* Loading Text */}
            <h2 className="text-2xl font-bold text-white mb-2">Signing you in...</h2>
            <p className="text-gray-400 text-sm">Authenticating with Google</p>
          </>
        )}

        {status === 'success' && (
          <>
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Text */}
            <h2 className="text-2xl font-bold text-green-400 mb-2">Login Successful!</h2>
            <p className="text-gray-400 text-sm">Redirecting you to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            {/* Error Text */}
            <h2 className="text-2xl font-bold text-red-400 mb-2">Authentication Failed</h2>
            <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
            <p className="text-gray-500 text-xs">Redirecting to sign up...</p>
          </>
        )}
      </div>
    </div>
  );
}