// src/auth/RoleRoutes.jsx
// Role-based route configuration
export const ROLE_ROUTES = {
    admin: "/admin/intramurals",
    GAM: "/GAM/intramurals",
    secretariat: "/secretariat/intramurals",
    tsecretary: "/tsecretary/intramurals",
  };
  
  // Default path after authentication if no specific role route exists
  export const DEFAULT_AUTHENTICATED_PATH = "/";
  
  export default ROLE_ROUTES;