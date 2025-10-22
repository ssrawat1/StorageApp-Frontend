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
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError('');
    setFormData((prev) => ({
      ...prev,
      [name]: DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [], // No HTML tags
        ALLOWED_ATTR: [], // No attributes
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
      console.error('Login error:', err);
      setServerError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  const hasError = Boolean(serverError);

  const handleGithubLogin = () => {
    const clientId = GITHUB_CLIENT_ID;
    const redirectUri = 'http://localhost:5173/auth/github';
    const scope = 'read:user user:email';

    // GitHub OAuth URL
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;

    // Open GitHub popup (like Google)
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h2 className="text-center text-2xl font-semibold mb-3">Login</h2>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="relative mb-3">
          <label htmlFor="email" className="block mb-1 font-bold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="block mb-1 font-bold">
            Password
          </label>
          <div className="flex items-center border rounded border-gray-300">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`flex-grow p-2 border-0 outline-none rounded-l ${hasError ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer p-2 text-gray-600 hover:text-gray-900 rounded-r"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {serverError && <span className="text-red-500 text-xs mt-1 block">{serverError}</span>}
        </div>

        <button
          type="submit"
          className="cursor-pointer bg-blue-500 text-white py-2 rounded w-full font-medium hover:opacity-90"
        >
          Login
        </button>
      </form>

      <p className="text-center mt-3">
        Don't have an account?
        <Link className="text-blue-600 hover:underline" to="/register">
          Register
        </Link>
      </p>

      <div className="relative text-center my-3">
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-gray-300"></div>
        <span className="relative bg-white px-2 text-xs text-gray-600">Or</span>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const data = await loginWithGoogle(credentialResponse.credential);
              if (!data.error) navigate('/');
            } catch (err) {
              console.error('Google login failed:', err);
            }
          }}
          onError={() => console.log('Login Failed')}
          theme="filled_blue"
          width={230}
          text="continue_with"
          useOneTap
        />
      </div>
      <div className="relative text-center my-2">
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-gray-300"></div>
        <span className="relative bg-white px-2 text-xs text-gray-600">Or</span>
      </div>
      <div className="flex justify-center mt-1">
        <button
          onClick={handleGithubLogin}
          className="cursor-pointer flex items-center bg-gray-800 text-white py-2 px-4 rounded hover:opacity-85"
        >
          <FaGithub className="mr-2" size={20} />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
