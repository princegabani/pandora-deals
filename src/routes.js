import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
// import BlogPage from './pages/BlogPage';
import RoughPage from "./pages/RoughPage";
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
// import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
// import TaskPage from './pages/TaksPage';
import EmployeePage from './pages/EmployeePage';
// import store from './store/store';
import FinancePage from './pages/FinancePage';
import TransactionPage from './pages/TransactionPage';
import ImagePosterApp from './pages/ImagePosterApp';
// import { InitAuth } from './database/component/auth/auth';
// import ProfilePage from './pages/ProfilePage';

// ----------------------------------------------------------------------

export default function Router() {
  // const user = true = InitAuth.current_user();
  // console.log("user data in Routing page", typeof (user), user)
  // useEffect(() => {
  //   console.log('Initview')
  //   InitAuthView()
  // }, [user])


  const routes = useRoutes([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      // element: user ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'employee', element: <EmployeePage /> },
        { path: 'finance', element: <FinancePage /> },
        { path: 'transaction', element: <TransactionPage /> },
        { path: 'imagePosterApp', element: <ImagePosterApp /> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
        // { path: 'profile', element: <ProfilePage /> },
        { path: 'Rough', element: <RoughPage /> },
        // { path: 'task', element: <TaskPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}