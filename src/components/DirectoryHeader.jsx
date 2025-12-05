import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUser, logoutUser, logoutAllSessions } from '../api/userApi';
import {
  FaFolderPlus,
  FaUpload,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { formatSize } from './DetailsPopup';

function DirectoryHeader({
  directoryName,
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
  disabled = false,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Guest User');
  const [userEmail, setUserEmail] = useState('guest@example.com');
  const [userPicture, setUserPicture] = useState(null);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(5368709120);

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchUser();
        setUserName(data.name);
        setUserEmail(data.email);
        setStorageUsed(data.storageUsed);
        setStorageLimit(data.storageLimit);
        setLoggedIn(true);
        setUserPicture(data.pictureUrl);
      } catch (err) {
        setLoggedIn(false);
        setUserName('Guest User');
        setUserEmail('guest@example.com');
        setUserPicture(null);
      }
    }
    loadUser();
  }, []);

  const handleUserIconClick = async () => {
    try {
      const data = await fetchUser();
      setStorageUsed(data.storageUsed);
      setStorageLimit(data.storageLimit);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
    setShowUserMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUserName('Guest User');
      setUserEmail('guest@example.com');
      setUserPicture(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setShowUserMenu(false);
      setShowMobileMenu(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions();
      setLoggedIn(false);
      setUserName('Guest User');
      setUserEmail('guest@example.com');
      setUserPicture(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout all error:', err);
    } finally {
      setShowUserMenu(false);
      setShowMobileMenu(false);
    }
  };

  useEffect(() => {
    function handleDocumentClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-300 mb-5">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div
            className="flex items-center gap-2 flex-shrink-0"
            onClick={(e) => {
              navigate('/');
            }}
          >
            <img
              src="/drive.jpg"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full p-1 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md"
              alt="app-logo"
            />
            <span className="text-base sm:text-lg font-bold text-gray-800 whitespace-nowrap">
              Safemystuff
            </span>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              className="cursor-pointer bg-blue-100 flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Create Folder"
              onClick={onCreateFolderClick}
              disabled={disabled}
              aria-label="Create Folder"
            >
              <FaFolderPlus className="text-xl" />
            </button>

            <button
              className=" bg-blue-100 cursor-pointer flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Upload Files"
              onClick={onUploadFilesClick}
              disabled={disabled}
              aria-label="Upload Files"
            >
              <FaUpload className="text-xl" />
            </button>

            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="cursor-pointer bg-blue-100 flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="User Menu"
                onClick={handleUserIconClick}
                aria-label="User Menu"
                aria-expanded={showUserMenu}
              >
                {userPicture ? (
                  <img
                    className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                    src={userPicture}
                    alt={userName}
                  />
                ) : (
                  <FaUser className="text-xl" />
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                  {loggedIn ? (
                    <>
                      <div className="px-4 py-3 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                          {userPicture ? (
                            <img
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                              src={userPicture}
                              alt={userName}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUser className="text-blue-600 text-xl" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{userName}</div>
                            <div className="text-xs text-gray-600 truncate">{userEmail}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min((storageUsed / storageLimit) * 100 || 0, 100).toFixed(2)}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-700">
                            <span className="font-semibold">{formatSize(storageUsed)}</span> of{' '}
                            <span className="font-semibold">
                              {formatSize(storageLimit).replace('.00', '')}
                            </span>{' '}
                            used ({((storageUsed / storageLimit) * 100 || 0).toFixed(1)}%)
                          </div>
                        </div>
                      </div>

                      <div className="py-2 px-2 space-y-2">
                        {/* Logout */}
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 
               text-sm font-medium text-red-600 
               bg-red-50 hover:bg-red-100 
               rounded-lg transition-all"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="text-red-600" />
                          <span>Logout</span>
                        </button>

                        {/* Logout All */}
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 
               text-sm font-medium text-red-700 
               bg-red-50 hover:bg-red-100 
               rounded-lg transition-all"
                          onClick={handleLogoutAll}
                        >
                          <FaSignOutAlt className="text-red-700" />
                          <span>Logout All Sessions</span>
                        </button>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/plans"
                          className="block text-center px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Get more storage
                        </Link>
                      </div>
                    </>
                  ) : (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => {
                        navigate('/login');
                        setShowUserMenu(false);
                      }}
                    >
                      <FaSignInAlt className="text-blue-600" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              className="flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileMenu(!showMobileMenu);
              }}
              aria-label="Toggle menu"
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          className="md:hidden border-t border-gray-200 bg-white shadow-lg animate-slideDown"
          ref={mobileMenuRef}
        >
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Actions */}
            <div className="flex gap-3">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFolderClick();
                  setShowMobileMenu(false);
                }}
                disabled={disabled}
              >
                <FaFolderPlus />
                <span>New Folder</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadFilesClick();
                  setShowMobileMenu(false);
                }}
                disabled={disabled}
              >
                <FaUpload />
                <span>Upload</span>
              </button>
            </div>

            {/* User Info */}
            {loggedIn ? (
              <>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    {userPicture ? (
                      <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        src={userPicture}
                        alt={userName}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="text-blue-600 text-xl" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{userName}</div>
                      <div className="text-xs text-gray-600 truncate">{userEmail}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((storageUsed / storageLimit) * 100 || 0, 100).toFixed(2)}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-700">
                      <span className="font-semibold">{formatSize(storageUsed)}</span> of{' '}
                      <span className="font-semibold">
                        {formatSize(storageLimit).replace('.00', '')}
                      </span>{' '}
                      used ({((storageUsed / storageLimit) * 100 || 0).toFixed(1)}%)
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/plans"
                      className="block text-center px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Get more storage
                    </Link>
                  </div>

                  <div className="py-2 px-2 space-y-2">
                    {/* Logout */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 
               text-sm font-medium text-red-600 
               bg-red-50 hover:bg-red-100 
               rounded-lg transition-all"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="text-red-600" />
                      <span>Logout</span>
                    </button>

                    {/* Logout All */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 
               text-sm font-medium text-red-700 
               bg-red-50 hover:bg-red-100 
               rounded-lg transition-all"
                      onClick={handleLogoutAll}
                    >
                      <FaSignOutAlt className="text-red-700" />
                      <span>Logout All Sessions</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/login');
                  setShowMobileMenu(false);
                }}
              >
                <FaSignInAlt />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default DirectoryHeader;
