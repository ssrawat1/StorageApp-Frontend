import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DirectoryView from './DirectoryView';
import GithubAuth from './components/GithubAuth';
import SubscriptionPlans from './subscriptions/SubscriptionPlans';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Register from './auth/Register';
import Login from './auth/Login';
import NotFoundPage from './pages/NotFoundPage';
import UsersPage from './rbac/UsersPage';

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
