import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, fetchUser, deleteUserById, logoutUserById } from './api/userApi';
import CreateRoleMode from './components/CreateRoleMode';
import { roleChange } from './api/roleChangeApi';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('Guest User');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('User');
  const [routeAccessError, setRouteAccessError] = useState('');
  const [query, setQuery] = useState('all');
  const [showRoleModel, setShowRoleModel] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [roleError, setRoleError] = useState('');
  const [roleId, setRoleId] = useState(null);
  const [invalidRoleError, setInvalidRoleError] = useState('');
  const [resStatus, setResStatus] = useState(null);
  const navigate = useNavigate();
  const accountStatus = ['all', 'active', 'deleted'];

  const roleAllowed = ['Admin', 'User', 'Owner', 'Manager'];

  const capitalizeRole = (word) => {
    const newWord = word.toLowerCase();
    return newWord.charAt(0).toUpperCase() + newWord.slice(1).toLowerCase();
  };
  
  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!roleAllowed.includes(capitalizeRole(newRole) || !newRole)) {
      console.log({ newRole: capitalizeRole(newRole) });
      setRoleError(`Invalid role. Allowed roles are: ${roleAllowed.join(', ')}`);
      return;
    }
    try {
      const data = await roleChange({ roleId, role: capitalizeRole(newRole) });
      console.log('Role change Response:', data);
      setNewRole('');
    } catch (err) {
      console.log('Error While Assigning Role:', err);
      setInvalidRoleError(err.response.data.error);
      if (err.response?.status === 403) setResStatus(err.response.status);
      else if (err.response?.status === 401) setResStatus(err.response.status);
      else console.error('Fetching users failed:', err);
    } finally {
      setShowRoleModel(false);
    }
  };

  const filterMap = {
    all: () => true,
    active: (user) => user.isLoggedIn,
    deleted: (user) => user.isDeleted,
  };

  const filteredUsers = users.filter(filterMap[query] || filterMap.all);

  console.log(filteredUsers);

  const logoutUser = async (user) => {
    const confirmed = confirm(`Logout ${user.email}?`);
    if (!confirmed) return;
    try {
      await logoutUserById(user.id);
      fetchUsers();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const deleteUser = async (user) => {
    const confirmed = confirm(`Delete ${user.email}?`);
    if (!confirmed) return;
    try {
      await deleteUserById(user.id);
      await fetchUsers();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  async function fetchUsers() {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.log('err:', err.response.data.error);
      setRouteAccessError(err.response.data.error);
      if (err.response?.status === 403) setResStatus(err.response.status);
      else if (err.response?.status === 401) setResStatus(err.response.status);
      else console.error('Fetching users failed:', err);
    }
  }

  async function fetchCurrentUser() {
    try {
      const data = await fetchUser();
      setUserName(data.name);
      setUserEmail(data.email);
      setUserRole(data.role);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else console.error('Fetching user failed:', err);
    }
  }

  return (
    <>
      {/* Error Toast */}
      {(routeAccessError || invalidRoleError) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slideDown">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-900 px-4 py-3 rounded-lg shadow-lg flex items-start justify-between">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{routeAccessError || invalidRoleError}</span>
            </div>
            <button
              className="text-red-500 hover:text-red-700 font-bold text-xl leading-none cursor-pointer ml-4"
              onClick={() => {
                if (resStatus === 403) navigate('/');
                else if (resStatus === 401) navigate('/login');
                setRouteAccessError('');
                setInvalidRoleError('');
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModel && (
        <CreateRoleMode
          setNewRole={setNewRole}
          handleRoleSubmit={handleRoleSubmit}
          newRole={newRole}
          setRoleError={setRoleError}
          roleError={roleError}
          onClose={() => setShowRoleModel(false)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: Admin Info */}
              <div className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                  User Dashboard
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                    {userName}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    ({userRole})
                  </span>
                </div>
              </div>

              {/* Right: Filter */}
              {userRole === 'Owner' && (
                <div className="flex items-center justify-center sm:justify-end gap-4 bg-gray-50 rounded-lg p-3 border border-gray-200 w-full sm:w-auto">
                  {accountStatus.map((value, i) => (
                    <label
                      key={crypto.randomUUID() || i}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        value={value}
                        checked={query === value}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <span className="capitalize text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Users Table/Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-md">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  {userRole !== 'Owner' ? 'No Active Users' : 'No Deleted Users'}
                </p>
                <p className="text-gray-600">
                  {userRole !== 'Owner' 
                    ? 'No users are currently logged in' 
                    : 'No users have been deleted'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Logout
                        </th>
                        {(userRole === 'Admin' || userRole === 'Owner') && (
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Account
                          </th>
                        )}
                        {userRole === 'Owner' && (
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Role
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-blue-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                user.isLoggedIn
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {user.isLoggedIn ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => logoutUser(user)}
                              disabled={!user.isLoggedIn}
                              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                user.isLoggedIn
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              Logout
                            </button>
                          </td>
                          {(userRole === 'Admin' || userRole === 'Owner') && (
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => deleteUser(user)}
                                disabled={user.email === userEmail || user.isDeleted}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                  user.isDeleted || user.email === userEmail
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md'
                                }`}
                              >
                                Delete
                              </button>
                            </td>
                          )}
                          {userRole === 'Owner' && (
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => {
                                  setShowRoleModel(true);
                                  setRoleId(user.id);
                                }}
                                className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                Assign
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate mt-1">{user.email}</p>
                      </div>
                      <span
                        className={`ml-3 flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.isLoggedIn
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.isLoggedIn ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => logoutUser(user)}
                        disabled={!user.isLoggedIn}
                        className={`flex-1 min-w-[100px] px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                          user.isLoggedIn
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Logout
                      </button>

                      {(userRole === 'Admin' || userRole === 'Owner') && (
                        <button
                          onClick={() => deleteUser(user)}
                          disabled={user.email === userEmail || user.isDeleted}
                          className={`flex-1 min-w-[100px] px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                            user.isDeleted || user.email === userEmail
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                          }`}
                        >
                          Delete
                        </button>
                      )}

                      {userRole === 'Owner' && (
                        <button
                          onClick={() => {
                            setShowRoleModel(true);
                            setRoleId(user.id);
                          }}
                          className="flex-1 min-w-[100px] px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-all duration-200"
                        >
                          Assign Role
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}