// src/api/client.js
// Centralised Axios instance with auth interceptors.

import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request Interceptor ─────────────────────────────────────────────────────
// Automatically attach the JWT token stored in localStorage to every request.
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────────────────────
// Automatically unwrap the `data` field from the backend's ApiResponse wrapper
// so callers receive the payload directly.
// Also handles 401 responses globally by clearing the token and redirecting.
apiClient.interceptors.response.use(
    (response) => {
        // Backend wraps everything in { statusCode, data, message, success }
        // We unwrap so callers get the inner `data` directly.
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if we're not already on a login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/';
            }
        }
        // Re-throw with a friendly message from the backend if available
        const message =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
