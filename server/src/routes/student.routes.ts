// src/routes/student.routes.ts

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';
import { dashboard, timetable, attendance, scanAttendance, attendanceHistory } from '../controllers/student.controller.js';

const router = Router();

// All student routes require authentication + STUDENT role
router.use(authenticate, authorize('STUDENT'));

// GET  /api/student/dashboard
router.get('/dashboard', dashboard);

// GET  /api/student/timetable
router.get('/timetable', timetable);

// GET  /api/student/attendance?month=3&subjectId=abc
router.get('/attendance', attendance);

// POST /api/student/attendance/scan
router.post('/attendance/scan', scanAttendance);

// GET /api/student/attendance/history
router.get('/attendance/history', attendanceHistory);

export default router;
