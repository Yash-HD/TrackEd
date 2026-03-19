import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi } from '../api/authService';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On app start, check if we have a saved token + user in localStorage
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Corrupted data — clear everything
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    console.error('Failed to parse saved user', error);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (credentials, role) => {
        // Call the real backend API
        const { token, user: loggedInUser } = await loginApi(credentials, role);

        // Persist token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        setUser(loggedInUser);
        setIsAuthenticated(true);

        return loggedInUser;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    };

    // Don't render children until the initial loading check is complete
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access to the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};