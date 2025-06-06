// src/auth/AuthContext.jsx - Updated version without login/register logic
import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import { ROLE_ROUTES, DEFAULT_AUTHENTICATED_PATH } from "./RoleRoutes";

const AuthContext = createContext(null);

export const AuthProvider = ({ children, navigate, location }) => {
  const [user, setUser] = useState(null);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [role, _setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch user data when token exists but user doesn't
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user) {
        try {
          setLoading(true);
          const { data } = await axiosClient.get("/user");
          setUser(data);
          setRole(data.role);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setError("Session expired. Please login again.");
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  // Listen for auth events (like session expiry)
  useEffect(() => {
    const handleUnauthenticated = () => {
      setError("Your session has expired. Please login again.");
      logout();
    };
    
    window.addEventListener('auth:unauthenticated', handleUnauthenticated);
    
    return () => {
      window.removeEventListener('auth:unauthenticated', handleUnauthenticated);
    };
  }, []);

  // Still keeping the Google OAuth logic in the context
  const googleAuthSuccess = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      // Set token first to configure axios
      setToken(token);
      
      // Fetch user data
      const { data } = await axiosClient.get("/user");
      
      // If we successfully got user data, update state
      setUser(data);
      setRole(data.role);
      
      // Remember intended location if available
      const from = location?.state?.from?.pathname || null;
      redirectToRoleBasedRoute(data.role, from);
      
      return { success: true };
    } catch (error) {
      // Clean up token
      setToken(null);
      console.error("Google auth error:", error);
      
      return {
        success: false
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear auth state
    setUser(null);
    setToken(null);
    setRole(null);
    
    // Redirect to login
    navigate("/login", { replace: true });
  };

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
      // Configure axios headers
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
      delete axiosClient.defaults.headers.common['Authorization'];
    }
  };

  const setRole = (newRole) => {
    _setRole(newRole);
    if (newRole) {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
    }
  };

  const redirectToRoleBasedRoute = (userRole, intendedPath = null) => {
    if (!userRole) {
      navigate("/login", { replace: true });
      return;
    }
    
    // First try to use the intended path (if coming from a redirect)
    if (intendedPath) {
      navigate(intendedPath, { replace: true });
      return;
    }
    
    // Otherwise, use the role-based mapping
    const targetRoute = ROLE_ROUTES[userRole] || DEFAULT_AUTHENTICATED_PATH;
    navigate(targetRoute, { replace: true });
  };

  const checkPermission = (requiredRoles) => {
    if (!user || !role) return false;
    return requiredRoles.includes(role);
  };

  const value = {
    user,
    token,
    role,
    loading,
    error,
    logout,
    googleAuthSuccess,
    checkPermission,
    redirectToRoleBasedRoute,
    setUser,
    setToken,
    setRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};