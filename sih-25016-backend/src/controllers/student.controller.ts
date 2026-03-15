// src/controllers/student.controller.ts

import type { Request, Response, NextFunction } from 'express';
import { getDashboard, getTimetable, getAttendance, scanQR } from '../services/student.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * GET /api/student/dashboard
 * Returns personalised dashboard data: today's classes, attendance stats, subject breakdown.
 */
export const dashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const data = await getDashboard(req.user.userId);
        res.status(200).json(new ApiResponse(200, data, 'Dashboard loaded'));
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/student/timetable
 * Returns the student's weekly timetable grouped by day of week.
 */
export const timetable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const data = await getTimetable(req.user.userId);
        res.status(200).json(new ApiResponse(200, data, 'Timetable loaded'));
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/student/attendance?month=3&subjectId=abc
 * Returns attendance history with optional month and subject filters.
 */
export const attendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');

        const month = req.query.month ? parseInt(req.query.month as string) : undefined;
        const subjectId = req.query.subjectId as string | undefined;

        const data = await getAttendance(req.user.userId, month, subjectId);
        res.status(200).json(new ApiResponse(200, data, 'Attendance loaded'));
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/student/attendance/scan
 * Body: { qrToken: string, location?: { latitude: number, longitude: number } }
 * Verifies QR JWT, validates session, and marks attendance.
 */
export const scanAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');

        const { qrToken, location } = req.body;

        if (!qrToken) {
            throw new ApiError(400, 'QR token is required.');
        }

        const data = await scanQR(req.user.userId, qrToken, location);
        res.status(200).json(new ApiResponse(200, data, data.message));
    } catch (error) {
        next(error);
    }
};
