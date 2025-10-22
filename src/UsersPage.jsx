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
    active: (user) => !user.isDeleted,
    deleted: (user) => user.isDeleted,
  };

  const filteredUsers = users.filter(filterMap[query] || filterMap.all);

  console.log(filteredUsers);

  const logoutUser = async (user) => {
    const confirmed = confirm(`You are about to logout ${user.email}`);
    if (!confirmed) return;
    try {
      await logoutUserById(user.id);
      fetchUsers();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const deleteUser = async (user) => {
    const confirmed = confirm(`You are about to delete ${user.email}`);
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
      {(routeAccessError || invalidRoleError) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center justify-between">
            <span className="text-sm font-medium">{routeAccessError || invalidRoleError}</span>
            <button
              className="text-red-700 font-bold cursor-pointer"
              onClick={() => {
                if (resStatus === 403) navigate('/');
                else if (resStatus === 401) navigate('/login');
                setRouteAccessError('');
                setInvalidRoleError('');
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        {/* Navbar / Admin Info with Filter */}
        <div className="p-4 bg-white text-blue-800 shadow-sm border-b border-gray-200 flex justify-between items-center">
          {/* Left: Admin Info */}
          <div>
            <h1 className="text-xl font-bold text-gray-800">User Dashboard</h1>
            <p className="mt-1 text-gray-700">
              <span className="font-semibold text-white bg-green-700 px-2 py-0.5 rounded">
                {userName}
              </span>{' '}
              <span className="text-gray-600">({userRole})</span>
            </p>
          </div>

          {/* Right: Filter */}
          {userRole === 'Owner' && (
            <div className="flex items-center space-x-4">
              {accountStatus.map((value, i) => (
                <label key={crypto.randomUUID() || i} className="flex items-center space-x-1">
                  <input
                    type="radio"
                    value={value}
                    checked={query === value}
                    onChange={(e) => setQuery(e.target.value)}
                    className="accent-green-600"
                  />
                  <span className="capitalize">{value}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="p-4 flex justify-center">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-yellow-800 text-xl mt-16 p-4">
              No users are currently logged in
            </div>
          ) : (
            <table className="w-full max-w-3xl border-collapse bg-white shadow-md rounded-md overflow-hidden">
              <thead>
                <tr>
                  <th className="border p-3 bg-gray-300 text-left text-gray-800 font-semibold">
                    Name
                  </th>
                  <th className="border p-3 bg-gray-300 text-left text-gray-800 font-semibold">
                    Email
                  </th>
                  <th className="border p-3 bg-gray-300 text-left text-gray-800 font-semibold">
                    Status
                  </th>
                  <th className="border p-3 bg-gray-300 text-left text-gray-800 font-semibold">
                    Logout
                  </th>
                  {(userRole === 'Admin' || userRole === 'Owner') && (
                    <th className="border p-3 bg-gray-300 text-left text-gray-800 font-semibold">
                      Account
                    </th>
                  )}
                  {userRole === 'Owner' && (
                    <th className="border p-3 bg-gray-300 text-left text-gray-800 font-semibold">
                      Role
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-sky-50 transition-colors duration-200">
                    <td className="border p-3">{user.name}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">{user.isLoggedIn ? 'Logged In' : 'Logged Out'}</td>
                    <td className="border p-3">
                      <button
                        onClick={() => logoutUser(user)}
                        disabled={!user.isLoggedIn}
                        className={`px-4 py-2 text-sm font-semibold text-white rounded ${
                          user.isLoggedIn
                            ? 'cursor-pointer bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Logout
                      </button>
                    </td>
                    {(userRole === 'Admin' || userRole === 'Owner') && (
                      <td className="border p-3">
                        <button
                          onClick={() => deleteUser(user)}
                          disabled={user.email === userEmail}
                          className={`px-4 py-2 text-sm font-semibold text-white rounded ${
                            user.isDeleted
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'cursor-pointer bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                    {userRole === 'Owner' && (
                      <td className="border p-3">
                        <button
                          onClick={() => {
                            setShowRoleModel(true);
                            setRoleId(user.id);
                          }}
                          className={
                            "px-4 py-2 text-sm font-semibold text-white rounded 'cursor-pointer bg-green-600 hover:bg-green-700"
                          }
                        >
                          Add
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
