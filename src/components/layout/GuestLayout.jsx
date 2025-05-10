// src/components/layout/GuestLayout.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ROLE_ROUTES } from "../../auth/RoleRoutes";

export default function GuestLayout() {
    const { token, role, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6BBF59]"></div>
        </div>
      );
    }
    
    if (token) {
       // Use our redirect helper from context
       const targetRoute = ROLE_ROUTES[role] || "/";
       return <Navigate to={targetRoute} replace />;
    }
    
    return <Outlet />;
}