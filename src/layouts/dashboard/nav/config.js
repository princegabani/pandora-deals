// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_blog'),
  },
  // {
  //   title: 'products',
  //   path: '/dashboard/products',
  //   icon: icon('ic_products'),
  // },
  // {
  //   title: 'profile',
  //   path: '/dashboard/profile',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'finance',
    path: '/dashboard/finance',
    icon: icon('ic_analytics'),
  },
  {
    title: 'transaction',
    path: '/dashboard/transaction',
    icon: icon('ic_analytics'),
  },
  {
    title: 'employee',
    path: '/dashboard/employee',
    icon: icon('ic_user'),
  },
  {
    title: 'rough',
    path: '/dashboard/rough',
    icon: icon('ic_cart'),
  },
  {
    title: 'imagePosterApp',
    path: '/dashboard/imagePosterApp',
    icon: icon('ic_cart'),
  },

  // {
  //   title: 'excel',
  //   path: '/dashboard/excel'
  // },
  // {
  //   title: 'task',
  //   path: '/dashboard/task',
  //   icon: icon('ic_analytics'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
