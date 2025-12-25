import { useLocation, useNavigate } from 'react-router-dom';
import { loginWithGithub } from '../api/loginWithGithubApi';
import { useEffect, useState } from 'react';

export default function GithubAuth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const run = async () => {
      console.log('running...');
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      console.log({ code });

      if (location.pathname === '/auth/github' && code) {
        try {
          setStatus('loading');
          const data = await loginWithGithub(code);
          console.log({ data });
          setStatus('success');
          
          // Small delay to show success state
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } catch (err) {
          console.error('Github Login Failed:', err.message);
          setStatus('error');
          setErrorMessage(err.message || 'Authentication failed');
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/register');
          }, 3000);
        }
      } else {
        console.log('Github Login Failed: No code found');
        setStatus('error');
        setErrorMessage('No authorization code found');
        
        setTimeout(() => {
          navigate('/register');
        }, 3000);
      }
    };

    run();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
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
            <h2 className="text-2xl font-bold text-white mb-2">Logging you in...</h2>
            <p className="text-gray-400 text-sm">Authenticating with GitHub</p>
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