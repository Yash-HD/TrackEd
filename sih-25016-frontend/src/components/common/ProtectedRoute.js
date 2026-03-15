import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // While the initial auth check is loading, don't render anything
    if (loading) {
        return null; // Or a loading spinner
    }

    // 1. Check if the user is authenticated
    if (!isAuthenticated) {
        // If not, redirect them to the main role selection page
        return <Navigate to="/" replace />;
    }

    // 2. Check if the user has the required role
    const hasRequiredRole = user && allowedRoles.includes(user.role);

    if (!hasRequiredRole) {
        // If they are logged in but have the wrong role, redirect them
        // (e.g., a student trying to access a faculty page)
        return <Navigate to="/" replace />; // Or to a dedicated "Unauthorized" page
    }

    // 3. If authenticated and has the correct role, render the page
    return <Outlet />;
};

export default ProtectedRoute;