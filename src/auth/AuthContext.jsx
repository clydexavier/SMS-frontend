// src/auth/AuthContext.jsx
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

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axiosClient.post("/login", credentials);
      
      console.log(data);
      // Check if the response contains a message - this could be an error for 'user' role
      if (!data.user) {
        // This is likely the response when a user with 'user' role tries to log in
        setError(data.message);
        return {
          success: false,
          message: data.message
        };
      }
      
      // Normal success flow
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);
      
      // Remember intended location if available
      const from = location?.state?.from?.pathname || null;
      redirectToRoleBasedRoute(data.user.role, from);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          "Failed to login. Please check your credentials.";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const googleAuthSuccess = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if the token is actually an error message from 'user' role restriction
      if (!token) {
        // This doesn't look like a JWT token, it might be an error message
        setError(token);
        return {
          success: false,
          message: token
        };
      }
      
      // Set token first
      setToken(token);
      
      // Fetch user data
      const { data } = await axiosClient.get("/user");
      
      // Check if user has 'user' role which should not happen at this point
      // but adding as a safeguard
      if (data.role === 'user') {
        setToken(null); // Clear the token
        setError("Please wait for the administrator to assign your appropriate role.");
        return {
          success: false,
          message: "Please wait for the administrator to assign your appropriate role."
        };
      }
      
      setUser(data);
      setRole(data.role);
      
      // Remember intended location if available
      const from = location?.state?.from?.pathname || null;
      redirectToRoleBasedRoute(data.role, from);
      
      return { success: true };
    } catch (error) {
      const errorMessage = "Failed to complete Google authentication";
      setError(errorMessage);
      logout();
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axiosClient.post("/register", credentials);
      
      // Check if the response contains only a message (for 'user' role)
      if (data.message && !data.token) {
        // This is the response when a newly registered user has 'user' role
        setError(data.message);
        return {
          success: false,
          message: data.message
        };
      }
      
      // Normal success flow
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);
      
      // Redirect to appropriate route based on role
      redirectToRoleBasedRoute(data.user.role);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          "Registration failed. Please try again.";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
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
    login,
    logout,
    googleAuthSuccess,
    register,
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