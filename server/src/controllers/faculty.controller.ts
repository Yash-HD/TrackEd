// src/controllers/faculty.controller.ts

import type { Request, Response, NextFunction } from 'express';
import {
    getDashboard, getAnalytics,
    getPendingLeaves, reviewLeave, applyLeave, getLeaveHistory,
    startSession, endSession, manualAttendance
} from '../services/faculty.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// GET /api/faculty/dashboard
export const dashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const data = await getDashboard(req.user.userId);
        res.status(200).json(new ApiResponse(200, data, 'Dashboard loaded'));
    } catch (error) { next(error); }
};

// GET /api/faculty/analytics
export const analytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const data = await getAnalytics(req.user.userId);
        res.status(200).json(new ApiResponse(200, data, 'Analytics loaded'));
    } catch (error) { next(error); }
};

// GET /api/faculty/leaves/pending
export const pendingLeaves = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const data = await getPendingLeaves(req.user.userId);
        res.status(200).json(new ApiResponse(200, data, 'Pending leaves loaded'));
    } catch (error) { next(error); }
};

// POST /api/faculty/leaves/:id/review
export const reviewLeaveHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const { status } = req.body;
        if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
            throw new ApiError(400, 'Status must be APPROVED or REJECTED');
        }
        const data = await reviewLeave(req.user.userId, req.params.id as string, status);
        res.status(200).json(new ApiResponse(200, data, `Leave ${status.toLowerCase()}`));
    } catch (error) { next(error); }
};

// POST /api/faculty/leaves/apply
export const applyLeaveHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const { type, startDate, endDate, reason } = req.body;
        if (!type || !startDate || !endDate || !reason) {
            throw new ApiError(400, 'Type, startDate, endDate, and reason are required');
        }
        const data = await applyLeave(req.user.userId, { type, startDate, endDate, reason });
        res.status(201).json(new ApiResponse(201, data, 'Leave request submitted'));
    } catch (error) { next(error); }
};

// GET /api/faculty/leaves/history
export const leaveHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const data = await getLeaveHistory(req.user.userId);
        res.status(200).json(new ApiResponse(200, data, 'Leave history loaded'));
    } catch (error) { next(error); }
};

// POST /api/faculty/session/:scheduleId/start
export const startSessionHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const data = await startSession(req.user.userId, req.params.scheduleId as string);
        res.status(200).json(new ApiResponse(200, data, 'Session started'));
    } catch (error) { next(error); }
};

// POST /api/faculty/session/:sessionId/end
export const endSessionHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const data = await endSession(req.user.userId, req.params.sessionId as string);
        res.status(200).json(new ApiResponse(200, data, 'Session ended'));
    } catch (error) { next(error); }
};

// POST /api/faculty/session/:sessionId/attendance/manual
export const manualAttendanceHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new ApiError(401, 'Authentication required.');
        const { studentId, status } = req.body;
        if (!studentId || !status || !['PRESENT', 'ABSENT'].includes(status)) {
            throw new ApiError(400, 'studentId and status (PRESENT/ABSENT) are required');
        }
        const data = await manualAttendance(req.user.userId, req.params.sessionId as string, studentId, status);
        res.status(200).json(new ApiResponse(200, data, `Student marked ${status.toLowerCase()}`));
    } catch (error) { next(error); }
};
