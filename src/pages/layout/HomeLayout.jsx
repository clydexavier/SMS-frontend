// src/components/layout/HomeLayout.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ROLE_ROUTES } from "../../auth/RoleRoutes";
import { useLocation } from "react-router-dom";

export default function HomeLayout() {
  const { token, role, loading } = useAuth();
  const location = useLocation()
  // Show loader while authentication status is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6BBF59]"></div>
      </div>
    );
  }
  if(!token) {
    return <Navigate to="/login" replace />;
  }
  else if (location.pathname === "/") {
    const targetRoute = ROLE_ROUTES[role] || "/";
    return <Navigate to={targetRoute} replace />;
  }
  
  return <Outlet/>
}