import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DirectoryView from './DirectoryView';
import Register from './Register';
import Login from './Login';
import UsersPage from './UsersPage';
import GithubAuth from './components/GithubAuth';
import SubscriptionPlans from './components/SubscriptionPlans';
import NotFoundPage from './NotFoundPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DirectoryView />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/users',
    element: <UsersPage />,
  },
  {
    path: '/directory/:dirId',
    element: <DirectoryView />,
  },
  {
    path: '/auth/github',
    element: <GithubAuth />,
  },
  {
    path: '/Plans',
    element: <SubscriptionPlans />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
