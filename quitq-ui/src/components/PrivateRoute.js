import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const isLoggedIn = authService.isLoggedIn();
    const userRole = authService.getUserRole();

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/products" />;
    }

    return children;
};

export default PrivateRoute;