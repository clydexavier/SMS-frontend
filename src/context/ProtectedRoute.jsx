import React from 'react';
import { useStateContext } from './ContextProvider';  
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
    const {token, role } = useStateContext(); 

    if (!token) {
        return <Navigate to='/login' />;
    }
    
     if (!role) return null; 
    
    if (!roles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }
    return children;
};

export default ProtectedRoute;
