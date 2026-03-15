import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // To handle initial auth check

    useEffect(() => {
        // This effect runs once when the app starts to check for a saved token
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // In a real app, you would verify the token with the backend
                    // const response = await axios.post('/api/auth/verify', { token });
                    // setUser(response.data.user);
                    // setIsAuthenticated(true);

                    // --- SIMULATION ---
                    // For now, if a token exists, we'll assume it's valid
                    // and set a mock user.
                    const mockUser = { name: 'Rohan Kumar', role: 'student' }; // Example user
                    setUser(mockUser);
                    setIsAuthenticated(true);

                } catch (error) {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    console.error("Token verification failed", error);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (credentials, role) => {
        // --- REAL API CALL (Commented Out) ---
        // const response = await axios.post(`/api/auth/${role}/login`, credentials);
        // const { token, user } = response.data;
        // localStorage.setItem('token', token);
        // setUser(user);
        // setIsAuthenticated(true);
        // return user;

        // --- SIMULATION ---
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (credentials.id === 'FACULTY01' && credentials.password === 'password123' && role === 'faculty') {
                    const mockUser = { name: 'Dr. Sharma', role: 'faculty' };
                    localStorage.setItem('token', 'fake-faculty-token');
                    setUser(mockUser);
                    setIsAuthenticated(true);
                    resolve(mockUser);
                } else if (credentials.id === 'STUDENT01' && credentials.password === 'password123' && role === 'student') {
                    const mockUser = { name: 'Rohan Kumar', role: 'student' };
                    localStorage.setItem('token', 'fake-student-token');
                    setUser(mockUser);
                    setIsAuthenticated(true);
                    resolve(mockUser);
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 1000);
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
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

    // We don't render children until the initial loading check is complete
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