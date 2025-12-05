import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { sendOtp, verifyOtp } from './api/authApi';
import { registerUser } from './api/userApi';
import DOMPurify from 'dompurify';
import { FaGithub, FaEnvelope, FaLock, FaUser, FaCheckCircle, FaGoogle } from 'react-icons/fa';
import { loginWithGoogle } from './api/loginWithGoogleApi';
import { GITHUB_CLIENT_ID } from './config';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setServerError('');
      setOtpError('');
      setOtpSent(false);
      setOtpVerified(false);
      setCountdown(0);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: DOMPurify.sanitize(value),
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) return setOtpError('Please enter your email first.');
    try {
      setIsSending(true);
      await sendOtp(formData.email);
      setOtpSent(true);
      setCountdown(60);
      setOtpError('');
    } catch (err) {
      setOtpError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setOtpError('Please enter OTP.');
    try {
      setIsVerifying(true);
      await verifyOtp(formData.email, otp);
      setOtpVerified(true);
      setOtpError('');
    } catch (err) {
      setOtpError(err.response?.data?.error || 'Invalid or expired OTP.');
    } finally {
      setIsVerifying(false);
      setCountdown(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return setOtpError('Please verify your email with OTP.');
    try {
      await registerUser({ ...formData, otp });
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 2000);
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-sm sm:text-base text-gray-600">Enter your details to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  autoComplete="name"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email Field with OTP Button */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-28 py-3 border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    serverError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSending || countdown > 0 || otpVerified}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSending ? 'Sending...' : countdown > 0 ? `${countdown}s` : 'Send OTP'}
                </button>
              </div>
            </div>

            {/* Server Error Message - Separate Alert Box */}
            {serverError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fadeIn">
                <p className="text-red-700 text-sm flex items-start gap-2">
                  <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">⚠</span>
                  <span className="leading-relaxed">{serverError}</span>
                </p>
              </div>
            )}

            {/* OTP Input Field */}
            {otpSent && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(DOMPurify.sanitize(e.target.value))}
                    className="w-full pl-4 pr-28 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-semibold tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || otpVerified}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1 ${
                      otpVerified
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                    }`}
                  >
                    {isVerifying ? (
                      'Verifying...'
                    ) : otpVerified ? (
                      <>
                        <FaCheckCircle /> Verified
                      </>
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>

                {/* OTP Error Message - Separate Alert Box */}
                {otpError && (
                  <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fadeIn">
                    <p className="text-red-700 text-sm flex items-start gap-2">
                      <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">⚠</span>
                      <span className="leading-relaxed">{otpError}</span>
                    </p>
                  </div>
                )}

                {/* OTP Success Message */}
                {otpVerified && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-2 animate-fadeIn">
                    <FaCheckCircle /> Email verified successfully!
                  </p>
                )}
              </div>
            )}

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
                  autoComplete="password"
                  required
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!otpVerified || isSuccess}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:transform-none"
            >
              {isSuccess ? '✓ Registration Successful!' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-5 text-sm text-gray-700">
            Already have an account?{' '}
            <Link
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
              to="/login"
            >
              Sign In
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
          <div className="flex flex-wrap justify-center gap-3">
            {/* Google Login - Full Width */}
            <GoogleLogin
              onSuccess={async (cred) => {
                const data = await loginWithGoogle(cred.credential);
                if (!data.error) navigate('/');
              }}
              onError={() => console.log('Google Login Failed')}
              type="standard"
              theme="outline"
              text="continue_with"
              shape="rectangular"
              logo_alignment="center"
              size="large"
              auto_select={false}
            />
            {/* GitHub Login - Full Width */}
            <button
              onClick={handleGithubLogin}
              className="w-52 flex items-center py-2 justify-center gap-3 border border-gray-300 rounded-sm hover:bg-blue-50 hover:border-gray-300 transition-all duration-200 font-medium text-gray-700 text-sm "
            >
              <FaGithub className="text-xl" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{' '}
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

export default Register;
