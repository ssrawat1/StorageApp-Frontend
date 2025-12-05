import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DirectoryView from './DirectoryView';
import Register from './Register';
import Login from './Login';
import UsersPage from './UsersPage';
import GithubAuth from './components/GithubAuth';
import SubscriptionPlans from './components/SubscriptionPlans';
import NotFound from './NotFound';
  
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
    path:"/auth/github",
    element:<GithubAuth/>
  },
  {
    path:"/Plans",
    element:<SubscriptionPlans/>
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
