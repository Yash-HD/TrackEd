// src/api/facultyService.js
// Faculty portal API calls.

import apiClient from './client';

/**
 * GET /api/faculty/dashboard
 * Returns: { faculty, todaysClasses, liveSession, atRiskStudents, pendingLeaves }
 */
export const getFacultyDashboard = async () => {
    const response = await apiClient.get('/faculty/dashboard');
    return response.data;
};

/**
 * GET /api/faculty/analytics
 * Returns: { attendanceTrends, riskDistribution, subjectPerformance, kpis }
 */
export const getFacultyAnalytics = async () => {
    const response = await apiClient.get('/faculty/analytics');
    return response.data;
};

/**
 * GET /api/faculty/leaves/pending
 * Returns array of pending leave requests
 */
export const getPendingLeaves = async () => {
    const response = await apiClient.get('/faculty/leaves/pending');
    return response.data;
};

/**
 * POST /api/faculty/leaves/:id/review
 * Body: { status: 'APPROVED' | 'REJECTED' }
 */
export const reviewLeave = async (leaveId, status) => {
    const response = await apiClient.post(`/faculty/leaves/${leaveId}/review`, { status });
    return response.data;
};

/**
 * POST /api/faculty/leaves/apply
 * Body: { type, startDate, endDate, reason }
 */
export const applyLeave = async (leaveData) => {
    const response = await apiClient.post('/faculty/leaves/apply', leaveData);
    return response.data;
};

/**
 * GET /api/faculty/leaves/history
 * Returns array of past leave records
 */
export const getLeaveHistory = async () => {
    const response = await apiClient.get('/faculty/leaves/history');
    return response.data;
};

/**
 * POST /api/faculty/session/:scheduleId/start
 * Returns: { sessionId, scheduleId, subjectName, subjectCode, qrToken, presentStudents, absentStudents, totalStudents }
 */
export const startSession = async (scheduleId) => {
    const response = await apiClient.post(`/faculty/session/${scheduleId}/start`);
    return response.data;
};

/**
 * POST /api/faculty/session/:sessionId/end
 * Returns: { sessionId, status, presentCount, totalStudents }
 */
export const endSession = async (sessionId) => {
    const response = await apiClient.post(`/faculty/session/${sessionId}/end`);
    return response.data;
};

/**
 * POST /api/faculty/session/:sessionId/attendance/manual
 * Body: { studentId, status: 'PRESENT' | 'ABSENT' }
 */
export const manualAttendance = async (sessionId, studentId, status) => {
    const response = await apiClient.post(`/faculty/session/${sessionId}/attendance/manual`, {
        studentId,
        status,
    });
    return response.data;
};

/**
 * POST /api/faculty/session/:sessionId/qr/refresh
 * Returns: { qrToken }
 */
export const refreshSessionQR = async (sessionId) => {
    const response = await apiClient.post(`/faculty/session/${sessionId}/qr/refresh`);
    return response.data;
};
