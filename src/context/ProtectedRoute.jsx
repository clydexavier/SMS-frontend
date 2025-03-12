import React, { useContext } from 'react'
import { userContext } from './ContextProvider'
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({children, roles}) => {
    const {role, authenticated} = useContext(userContext);

    if(!authenticated) {
        return <Navigate to='/login'/>
    }
    if(!roles.includes(role)) {
        return <Navigate to="/unauthorized"/>
    }

    return children;
}

export default ProtectedRoute
