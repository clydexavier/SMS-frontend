// src/auth/AuthProviderWrapper.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

/**
 * Wrapper component that provides routing hooks to AuthProvider
 * This resolves the Router nesting issue by injecting the hooks
 * instead of using them directly in AuthProvider
 */
const AuthProviderWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <AuthProvider navigate={navigate} location={location}>
      {children}
    </AuthProvider>
  );
};

export default AuthProviderWrapper;