// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ roles, children}) => {
  const { token, user, role, loading, checkPermission } = useAuth();
  const location = useLocation();
  console.log(role);

  // Show loading indicator while auth status is determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6BBF59]"></div>
      </div>
    );
  }
  
  // Not authenticated - redirect to login with intended destination
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Not authorized for this role - redirect to unauthorized page
  if (roles && !checkPermission(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized and authenticated - render child routes
  return children;
};

export default ProtectedRoute;