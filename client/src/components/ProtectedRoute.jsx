// client/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 👈 Check this path matches your folder structure

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // 1. While checking if user is logged in, show a spinner or nothing
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    // 2. If no user found, kick them out to Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If user exists, show the protected page (Dashboard)
    return children;
};

export default ProtectedRoute;