// src/api/authService.js
// Authentication API calls.

import apiClient from './client';

/**
 * Login a user.
 * Backend: POST /api/auth/login
 * Body: { role: 'STUDENT' | 'FACULTY' | 'ADMIN', identifier: string, password: string }
 * Returns: { data: { token, user: { id, firstName, lastName, email, role, departmentId } } }
 * (The response interceptor unwraps the outer ApiResponse, so we get `{ data: ... }` here.)
 */
export const login = async (credentials, role) => {
    const response = await apiClient.post('/auth/login', {
        role: role.toUpperCase(),
        identifier: credentials.id,
        password: credentials.password,
    });
    // response is already unwrapped: { statusCode, data, message, success }
    // Our response interceptor returns `response.data` (the full ApiResponse object).
    // So `response` here is { statusCode, data: { token, user }, message, success }
    return response.data;  // { token, user }
};
