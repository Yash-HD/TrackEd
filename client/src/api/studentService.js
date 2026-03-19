// src/api/studentService.js
// Student portal API calls.

import apiClient from './client';

/**
 * GET /api/student/dashboard
 * Returns: { student, overallAttendancePercentage, atRiskCount, todaysClasses, subjectBreakdown }
 */
export const getStudentDashboard = async () => {
    const response = await apiClient.get('/student/dashboard');
    return response.data;
};

/**
 * GET /api/student/timetable
 * Returns: { Monday: [...], Tuesday: [...], ... }
 */
export const getStudentTimetable = async () => {
    const response = await apiClient.get('/student/timetable');
    return response.data;
};

/**
 * GET /api/student/attendance?month=3&subjectId=abc
 * Returns: { records, subjects, subjectStats }
 */
export const getStudentAttendance = async (month, subjectId) => {
    const params = {};
    if (month) params.month = month;
    if (subjectId) params.subjectId = subjectId;
    const response = await apiClient.get('/student/attendance', { params });
    return response.data;
};

/**
 * POST /api/student/attendance/scan
 * Body: { qrToken, location? }
 */
export const scanAttendance = async (qrToken, location) => {
    const response = await apiClient.post('/student/attendance/scan', { qrToken, location });
    return response.data;
};

/**
 * GET /api/student/attendance/history?subjectId=abc&limit=30
 * Returns flat list of latest attendance records
 */
export const getAttendanceHistory = async (limit = 20, subjectId) => {
    const params = { limit };
    if (subjectId) params.subjectId = subjectId;
    const response = await apiClient.get('/student/attendance/history', { params });
    return response.data;
};
