import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import About from './pages/About';
import BookDetail from './pages/BookDetail';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import MyCollection from './pages/MyCollection';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'book/:id', element: <BookDetail /> }, // Dynamic Route
      { path: 'collection', element: <MyCollection /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
