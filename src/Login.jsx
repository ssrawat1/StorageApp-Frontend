import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser } from './api/userApi';
import DOMPurify from 'dompurify';
import { FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginWithGoogle } from './api/loginWithGoogleApi';
import { GITHUB_CLIENT_ID } from './config';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })

  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation with single regex
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number & 1 special character";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError('');

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

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

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

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

  // Loading Overlay Component (Only for Google)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center">
          {/* Spinner */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Signing you in...</h2>
          <p className="text-sm sm:text-base text-gray-600">Authenticating with Google</p>

          {/* Loading Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    );
  }

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
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.email && (
                <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fadeIn">
                  <p className="text-red-700 text-sm flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">⚠</span>
                    <span className="leading-relaxed">{errors.email}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 pr-12 py-3 border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fadeIn">
                  <p className="text-red-700 text-sm flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">⚠</span>
                    <span className="leading-relaxed">{errors.password}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Server Error - Only shown if there are no field validation errors */}
            {serverError && !errors.email && !errors.password && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fadeIn">
                <p className="text-red-700 text-sm flex items-start gap-2">
                  <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">⚠</span>
                  <span className="leading-relaxed">{serverError}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
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

          {/* Social Login Buttons with Responsive Divider */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Google Login */}
            <div className="flex-shrink-0">
              <GoogleLogin
                onSuccess={async (cred) => {
                  try {
                    setIsLoading(true);
                    console.log("google response data:", cred.credential)
                    const data = await loginWithGoogle(cred.credential);
                    console.log("Google Login Data Client-Side:", data)
                    if (!data.error) {
                      navigate('/');
                    } else {
                      setIsLoading(false);
                      setServerError(data.error || 'Google login failed');
                    }
                  } catch (error) {
                    setIsLoading(false);
                    setServerError('Failed to process Google login');
                    console.error('Google login error:', error);
                  }
                }}
                onError={() => {
                  setIsLoading(false);
                  setServerError('Google login failed');
                  console.log('Google Login Failed')
                }}
                type="standard"
                theme="outline"
                text="continue_with"
                shape="rectangular"
                logo_alignment="center"
                width={200}
                auto_select={false}
                useOneTap={true}
              />
            </div>

            {/* Vertical Divider - Hidden on wrap */}
            <div className="hidden sm:block w-px h-10 bg-gray-300 flex-shrink-0"></div>

            {/* GitHub Login */}
            <button
              onClick={handleGithubLogin}
              className="flex-shrink-0 cursor-pointer flex items-center px-2 py-2.5 justify-center gap-3 border-1 bg-white border-gray-200 rounded-sm hover:bg-blue-50 transition-all duration-200 text-sm"
              style={{ width: '200px' }}
            >
              <FaGithub className="text-xl text-black" />
              <span className="text-gray-800">Continue with GitHub</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our{' '}
            <Link to="/terms-of-service" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;