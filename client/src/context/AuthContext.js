import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state from LocalStorage
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(false);

    // Load User Data (Sync with Server)
    const loadUser = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
        } catch (error) {
            console.error("Failed to load user", error);
        }
    };

    useEffect(() => {
        if (token) loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            setToken(res.data.token);
            setUser(res.data.user);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    // 👇 FIXED UPDATE FUNCTION
    const updateUser = async (name, avatarId) => {
        try {
            console.log("🔸 SENDING TO SERVER:", { name, avatar: avatarId });

            const res = await axios.put('http://localhost:5000/api/auth/updatedetails',
                { name, avatar: avatarId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Check what the server sent back
            console.log("✅ SERVER RESPONDED:", res.data);

            // Update State Immediately
            const updatedUser = res.data.data;
            setUser(updatedUser);

            // Update Local Storage Immediately
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return { success: true };
        } catch (error) {
            console.error("❌ CLIENT UPDATE ERROR:", error);
            return { success: false, error: error.response?.data?.error || 'Update failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};