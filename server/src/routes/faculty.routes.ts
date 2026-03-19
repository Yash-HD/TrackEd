// src/routes/faculty.routes.ts

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
    dashboard, analytics,
    pendingLeaves, reviewLeaveHandler, applyLeaveHandler, leaveHistory,
    startSessionHandler, endSessionHandler, manualAttendanceHandler, refreshQRTokenHandler
} from '../controllers/faculty.controller.js';

const router = Router();

// All faculty routes require authentication + FACULTY role
router.use(authenticate, authorize('FACULTY'));

// Dashboard & Analytics
router.get('/dashboard', dashboard);
router.get('/analytics', analytics);

// Leave Management
router.get('/leaves/pending', pendingLeaves);
router.post('/leaves/:id/review', reviewLeaveHandler);
router.post('/leaves/apply', applyLeaveHandler);
router.get('/leaves/history', leaveHistory);

// Live Session Management
router.post('/session/:scheduleId/start', startSessionHandler);
router.post('/session/:sessionId/end', endSessionHandler);
router.post('/session/:sessionId/attendance/manual', manualAttendanceHandler);
router.post('/session/:sessionId/qr/refresh', refreshQRTokenHandler);

export default router;
