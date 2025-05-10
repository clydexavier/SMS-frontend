// src/AppRoutes.jsx
import { useRoutes } from 'react-router-dom';
import routes from './routes';

// AppRoutes component that uses the routes configuration
const AppRoutes = () => {
  return useRoutes(routes);
};

export default AppRoutes;