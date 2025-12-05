import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser } from './api/userApi';
import DOMPurify from 'dompurify';
import { FaGithub, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { loginWithGoogle } from './api/loginWithGoogleApi';
import { GITHUB_CLIENT_ID } from './config';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError('');
    setFormData((prev) => ({
      ...prev,
      [name]: DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      if (data.error) setServerError(data.error);
      else navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  const handleGithubLogin = () => {
    const clientId = GITHUB_CLIENT_ID;
    const redirectUri = 'https://www.safemystuff.store/auth/github';
    const scope = 'read:user user:email';

    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
          </div>

          {/* Form */}
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    serverError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    serverError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {serverError && (
                <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fadeIn">
                  <p className="text-red-700 text-sm flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">⚠</span>
                    <span className="leading-relaxed">{serverError}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform"
            >
              Sign In
            </button>
          </form>

          {/* Redirect to Register */}
          <p className="text-center mt-5 text-sm text-gray-700">
            Don't have an account?{' '}
            <Link
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
              to="/register"
            >
              Create Account
            </Link>
          </p>

          {/* Divider */}
          <div className="relative text-center my-6">
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gray-300"></div>
            <span className="relative bg-white px-4 text-xs sm:text-sm text-gray-600 font-medium">
              Or continue with
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Google Login - Full Width */}
            <div className="w-full">
              <GoogleLogin
                onSuccess={async (cred) => {
                  const data = await loginWithGoogle(cred.credential);
                  if (!data.error) navigate('/');
                }}
                onError={() => console.log('Google Login Failed')}
                theme="outline"
                text="continue_with"
                size="large"
                logo_alignment="center"
                auto_select={false}
                width="100%"
                useOneTap
              />
            </div>

            {/* GitHub Login - Full Width */}
            <button
              onClick={handleGithubLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-lg hover:bg-blue-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700 text-sm "
            >
              <FaGithub className="text-xl" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
