import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Import Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile'; // 👈 The new Profile Page

// Security Wrapper: Checks if user is logged in
const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    // If no token, kick them back to Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, show the page
    return children;
};

function App() {
    return (
        // 1. Wrap entire App in AuthProvider so everyone can access User State
        <AuthProvider>
            <Router>
                <div className="bg-slate-900 min-h-screen text-white font-sans">
                    <Routes>

                        {/* PUBLIC ROUTES (Accessible by anyone) */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* PROTECTED ROUTES (Must be logged in) */}

                        {/* Dashboard (Home) */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Profile Page (Edit Name/Avatar) */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch-All: Redirect unknown URLs to Login */}
                        <Route path="*" element={<Navigate to="/login" replace />} />

                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;