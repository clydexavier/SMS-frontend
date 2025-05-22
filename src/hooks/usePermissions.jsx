import { useAuth } from "../auth/AuthContext";

import { PERMISSIONS } from '../config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const userPermissions = PERMISSIONS[user?.role] || {};

  const can = (action, resource) => {
    return userPermissions[resource]?.[action] || false;
  };

  const getAccessibleRoutes = () => {
    return Object.keys(userPermissions).filter(resource => 
      userPermissions[resource].read
    );
  };

  return { can, getAccessibleRoutes, role: user?.role };
};