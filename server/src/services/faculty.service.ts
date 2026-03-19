// src/services/faculty.service.ts

import { prisma } from '../db.js';
import { ApiError } from '../utils/ApiError.js';
import { getIO } from '../socket.js';
import jwt from 'jsonwebtoken';
import type { LeaveStatus, AttendanceStatus } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper to get the current day as our DayOfWeek enum value
const getDayOfWeek = (): string => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[new Date().getDay()]!;
};

// =============================================================================
// GET DASHBOARD
// Returns today's classes, active session, at-risk students, and pending leaves.
// Frontend: FacultyDashboard.js
// =============================================================================
export const getDashboard = async (userId: string) => {
    const faculty = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, firstName: true, lastName: true, departmentId: true }
    });
    if (!faculty) throw new ApiError(404, 'Faculty not found');

    const today = getDayOfWeek();
    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todaysSchedules = await prisma.timetableSchedule.findMany({
        where: { facultyId: userId, dayOfWeek: today as any },
        include: {
            subject: { select: { name: true, code: true } },
            department: { select: { name: true } },
            sessions: {
                where: { date: todayDate, status: 'COMPLETED' },
                select: { id: true }
            }
        },
        orderBy: { startTime: 'asc' }
    });

    // Filter out completed sessions
    const activeTodaysSchedules = todaysSchedules.filter(s => s.sessions.length === 0);

    const todaysClasses = activeTodaysSchedules.map(s => ({
        scheduleId: s.id,
        classId: s.subject.code,
        subjectName: s.subject.name,
        time: `${s.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - ${s.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`,
        semester: `Sem ${s.semester}, ${s.department.name}`,
        type: s.type,
        division: s.division,
    }));

    // --- ACTIVE LIVE SESSION ---
    const activeSession = await prisma.classSession.findFirst({
        where: {
            schedule: { facultyId: userId },
            status: 'ACTIVE',
            date: todayDate,
        },
        include: {
            schedule: { include: { subject: { select: { name: true, code: true } } } },
            attendances: true,
        }
    });

    let liveSession = null;
    if (activeSession) {
        const presentCount = activeSession.attendances.filter(
            a => a.status === 'PRESENT' || a.status === 'LATE'
        ).length;

        // Get total students in this class
        const totalStudents = await prisma.user.count({
            where: {
                role: 'STUDENT',
                departmentId: activeSession.schedule.departmentId,
                semester: activeSession.schedule.semester,
                ...(activeSession.schedule.division ? { division: activeSession.schedule.division } : {}),
            }
        });

        liveSession = {
            sessionId: activeSession.id,
            classId: activeSession.schedule.subject.code,
            subjectName: activeSession.schedule.subject.name,
            presentCount,
            totalStudents,
            status: 'Active',
        };
    }

    // --- AT-RISK STUDENTS (< 75% attendance across faculty's subjects) ---
    const facultySubjects = await prisma.subject.findMany({
        where: { facultyId: userId },
        select: { id: true }
    });
    const subjectIds = facultySubjects.map(s => s.id);

    // Find students whose attendance in these subjects is below 75%
    const studentsInSubjects = await prisma.attendance.groupBy({
        by: ['studentId'],
        where: {
            session: { schedule: { subjectId: { in: subjectIds } } }
        },
        _count: { id: true },
    });

    const presentCounts = await prisma.attendance.groupBy({
        by: ['studentId'],
        where: {
            session: { schedule: { subjectId: { in: subjectIds } } },
            status: { in: ['PRESENT', 'LATE'] }
        },
        _count: { id: true },
    });

    const presentMap = new Map(presentCounts.map(p => [p.studentId, p._count.id]));
    const atRiskIds: string[] = [];

    for (const s of studentsInSubjects) {
        const present = presentMap.get(s.studentId) ?? 0;
        const percentage = s._count.id > 0 ? Math.round((present / s._count.id) * 100) : 0;
        if (percentage < 75) atRiskIds.push(s.studentId);
    }

    const atRiskUsers = atRiskIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: atRiskIds } },
            select: { firstName: true, lastName: true, identifier: true, id: true }
        })
        : [];

    const atRiskStudentsRaw = atRiskUsers.map(u => {
        const total = studentsInSubjects.find(s => s.studentId === u.id)?._count.id ?? 0;
        const present = presentMap.get(u.id) ?? 0;
        const pct = total > 0 ? Math.round((present / total) * 100) : 0;
        return {
            name: `${u.firstName} ${u.lastName}`,
            pct,
            attendance: `${pct}%`,
            roll: u.identifier,
        };
    });

    const atRiskStudents = atRiskStudentsRaw.sort((a, b) => a.pct - b.pct).slice(0, 5);

    // --- PENDING LEAVES ---
    const pendingLeaves = await prisma.leaveRequest.findMany({
        where: {
            status: 'PENDING',
            user: {
                role: 'STUDENT',
                ...(faculty.departmentId && { departmentId: faculty.departmentId }),
            }
        },
        include: { user: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    const pendingLeavesData = pendingLeaves.map(l => ({
        id: l.id,
        studentName: `${l.user.firstName} ${l.user.lastName}`,
        forDates: `${l.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${l.startDate.getTime() !== l.endDate.getTime() ? ` - ${l.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}`,
        reason: l.type,
    }));

    // --- FULL WEEKLY TIMETABLE FOR MY CLASSES PAGE ---
    const allSchedules = await prisma.timetableSchedule.findMany({
        where: { facultyId: userId },
        include: {
            subject: { select: { name: true, code: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    const dayDisplayMap: Record<string, string> = {
        MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
        THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday'
    };

    const timetable: Record<string, any[]> = {};
    for (const s of allSchedules) {
        const dayName = dayDisplayMap[s.dayOfWeek] ?? s.dayOfWeek;
        if (!timetable[dayName]) timetable[dayName] = [];
        timetable[dayName].push({
            scheduleId: s.id,
            subject_name: s.subject.name,
            subject_code: s.subject.code,
            division: s.division || 'A',
            start_time: s.startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            end_time: s.endTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            type: s.type,
        });
    }

    return {
        faculty: { firstName: faculty.firstName, lastName: faculty.lastName },
        todaysClasses,
        timetable,
        liveSession,
        atRiskStudents,
        pendingLeaves: pendingLeavesData,
    };
};

// =============================================================================
// GET ANALYTICS
// Heavy aggregation endpoint for ReportsPage.js
// =============================================================================
export const getAnalytics = async (userId: string) => {
    const facultySubjects = await prisma.subject.findMany({
        where: { facultyId: userId },
        select: { id: true, name: true }
    });
    const subjectIds = facultySubjects.map(s => s.id);

    // --- ATTENDANCE TRENDS (weekly) ---
    const allSessions = await prisma.classSession.findMany({
        where: { schedule: { subjectId: { in: subjectIds } } },
        include: { attendances: true },
        orderBy: { date: 'asc' }
    });

    // Group sessions by week number and compute avg attendance %
    const weekMap = new Map<string, { total: number; present: number }>();
    for (const session of allSessions) {
        const weekNum = getWeekNumber(session.date);
        const key = `Week ${weekNum}`;
        if (!weekMap.has(key)) weekMap.set(key, { total: 0, present: 0 });
        const entry = weekMap.get(key)!;
        entry.total += session.attendances.length;
        entry.present += session.attendances.filter(
            a => a.status === 'PRESENT' || a.status === 'LATE'
        ).length;
    }

    const attendanceTrends = Array.from(weekMap.entries()).map(([week, data]) => ({
        week,
        attendance: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
        target: 75,
    }));

    // --- RISK DISTRIBUTION (Safe / Warning / Critical) ---
    const studentAttendance = await prisma.attendance.groupBy({
        by: ['studentId'],
        where: { session: { schedule: { subjectId: { in: subjectIds } } } },
        _count: { id: true },
    });

    const studentPresent = await prisma.attendance.groupBy({
        by: ['studentId'],
        where: {
            session: { schedule: { subjectId: { in: subjectIds } } },
            status: { in: ['PRESENT', 'LATE'] }
        },
        _count: { id: true },
    });

    const presentLookup = new Map(studentPresent.map(p => [p.studentId, p._count.id]));
    let safe = 0, warning = 0, critical = 0;

    for (const s of studentAttendance) {
        const present = presentLookup.get(s.studentId) ?? 0;
        const pct = s._count.id > 0 ? Math.round((present / s._count.id) * 100) : 0;
        if (pct >= 75) safe++;
        else if (pct >= 65) warning++;
        else critical++;
    }

    const riskDistribution = [
        { name: 'Safe (>75%)', value: safe, color: '#10b981' },
        { name: 'Warning (65-75%)', value: warning, color: '#f59e0b' },
        { name: 'Critical (<65%)', value: critical, color: '#ef4444' },
    ];

    // --- SUBJECT PERFORMANCE ---
    const subjectPerformance = [];
    for (const subj of facultySubjects) {
        const totalRecords = await prisma.attendance.count({
            where: { session: { schedule: { subjectId: subj.id } } }
        });
        const presentRecords = await prisma.attendance.count({
            where: {
                session: { schedule: { subjectId: subj.id } },
                status: { in: ['PRESENT', 'LATE'] }
            }
        });
        const passRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
        subjectPerformance.push({
            name: subj.name,
            passRate,
            avgScore: passRate, // attendance-based metric
        });
    }

    // --- KPI SUMMARIES ---
    const totalSessions = allSessions.length;
    const allAttendances = allSessions.flatMap(s => s.attendances);
    const totalRecords = allAttendances.length;
    const totalPresent = allAttendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const cohortAvg = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100 * 10) / 10 : 0;

    return {
        attendanceTrends,
        riskDistribution,
        subjectPerformance,
        kpis: {
            cohortAvgAttendance: `${cohortAvg}%`,
            atRiskPopulation: warning + critical,
            classesExecuted: totalSessions,
        }
    };
};

// Helper: get ISO week number from a date
function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// =============================================================================
// GET PENDING LEAVES
// Student leave requests needing this faculty's review
// =============================================================================
export const getPendingLeaves = async (userId: string) => {
    const faculty = await prisma.user.findUnique({
        where: { id: userId },
        select: { departmentId: true }
    });
    if (!faculty) throw new ApiError(404, 'Faculty not found');

    const leaves = await prisma.leaveRequest.findMany({
        where: {
            status: 'PENDING',
            user: {
                role: 'STUDENT',
                ...(faculty.departmentId && { departmentId: faculty.departmentId }),
            }
        },
        include: {
            user: { select: { firstName: true, lastName: true, identifier: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return leaves.map(l => ({
        id: l.id,
        studentName: `${l.user.firstName} ${l.user.lastName}`,
        rollNo: l.user.identifier,
        type: l.type,
        days: Math.ceil((l.endDate.getTime() - l.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        dates: `${l.startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}${l.startDate.getTime() !== l.endDate.getTime() ? ` - ${l.endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}` : ''}`,
        reason: l.reason,
        status: l.status,
        avatarMatch: `${l.user.firstName.charAt(0)}${l.user.lastName.charAt(0)}`,
    }));
};

// =============================================================================
// REVIEW LEAVE — Approve or reject
// =============================================================================
export const reviewLeave = async (
    userId: string,
    leaveId: string,
    status: 'APPROVED' | 'REJECTED'
) => {
    const leave = await prisma.leaveRequest.findUnique({ where: { id: leaveId } });
    if (!leave) throw new ApiError(404, 'Leave request not found');
    if (leave.status !== 'PENDING') throw new ApiError(400, 'Leave request already reviewed');

    const updated = await prisma.leaveRequest.update({
        where: { id: leaveId },
        data: {
            status: status as LeaveStatus,
            reviewedById: userId,
            reviewedAt: new Date(),
        }
    });

    return { id: updated.id, status: updated.status };
};

// =============================================================================
// APPLY LEAVE — Faculty files their own leave request
// =============================================================================
export const applyLeave = async (
    userId: string,
    body: { type: string; startDate: string; endDate: string; reason: string }
) => {
    const leave = await prisma.leaveRequest.create({
        data: {
            userId,
            type: body.type as any,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            reason: body.reason,
        }
    });

    return { id: leave.id, status: leave.status };
};

// =============================================================================
// GET LEAVE HISTORY — Faculty's own past leaves
// =============================================================================
export const getLeaveHistory = async (userId: string) => {
    const leaves = await prisma.leaveRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });

    return leaves.map(l => ({
        id: l.id,
        type: l.type,
        startDate: l.startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        endDate: l.endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: l.status,
    }));
};

// =============================================================================
// START SESSION — Create a ClassSession and return QR JWT + student roster
// =============================================================================
export const startSession = async (userId: string, scheduleId: string) => {
    // Verify the schedule belongs to this faculty
    const schedule = await prisma.timetableSchedule.findUnique({
        where: { id: scheduleId },
        include: { subject: { select: { name: true, code: true } } }
    });

    if (!schedule) throw new ApiError(404, 'Schedule not found');
    if (schedule.facultyId !== userId) throw new ApiError(403, 'This schedule does not belong to you');

    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if a session already exists for today
    let session = await prisma.classSession.findFirst({
        where: { scheduleId, date: todayDate }
    });

    if (session && session.status === 'ACTIVE') {
        // Session already active, just return it
    } else if (session && session.status === 'COMPLETED') {
        throw new ApiError(400, 'Session for today has already been completed');
    } else {
        // Create new session
        session = await prisma.classSession.create({
            data: {
                scheduleId,
                date: todayDate,
                status: 'ACTIVE',
            }
        });
    }

    // Generate QR JWT containing sessionId (short-lived, 30s)
    const qrToken = jwt.sign({ sessionId: session.id }, JWT_SECRET, { expiresIn: '30s' });

    // Get the student roster for this class
    const students = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            departmentId: schedule.departmentId,
            semester: schedule.semester,
            ...(schedule.division ? { division: schedule.division } : {}),
        },
        select: { id: true, firstName: true, lastName: true, identifier: true }
    });

    // Get already-present students
    const existingAttendances = await prisma.attendance.findMany({
        where: { sessionId: session.id, status: { in: ['PRESENT', 'LATE'] } },
        select: { studentId: true }
    });
    const presentIds = new Set(existingAttendances.map(a => a.studentId));

    const presentStudents = students
        .filter(s => presentIds.has(s.id))
        .map(s => ({ id: s.identifier, name: `${s.firstName} ${s.lastName}`, studentId: s.id }));

    const absentStudents = students
        .filter(s => !presentIds.has(s.id))
        .map(s => ({ id: s.identifier, name: `${s.firstName} ${s.lastName}`, studentId: s.id }));

    return {
        sessionId: session.id,
        scheduleId: schedule.id,
        subjectName: schedule.subject.name,
        subjectCode: schedule.subject.code,
        qrToken,
        students,
    };
};

// Helper: Generates a new QR token for a session and emits it via socket
export const refreshQRToken = (sessionId: string): string => {
    const qrToken = jwt.sign({ sessionId }, JWT_SECRET, { expiresIn: '30s' });
    try {
        getIO().to(sessionId).emit('qr_refresh', { qrToken });
    } catch { /* socket not initialised in tests */ }
    return qrToken;
};

// =============================================================================
// END SESSION — Mark session as COMPLETED, mark remaining as ABSENT
// =============================================================================
export const endSession = async (userId: string, sessionId: string) => {
    const session = await prisma.classSession.findUnique({
        where: { id: sessionId },
        include: { schedule: true, attendances: true }
    });

    if (!session) throw new ApiError(404, 'Session not found');
    if (session.schedule.facultyId !== userId) throw new ApiError(403, 'Not your session');
    if (session.status !== 'ACTIVE') throw new ApiError(400, 'Session is not active');

    // Get all students who should be in this class
    const allStudents = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            departmentId: session.schedule.departmentId,
            semester: session.schedule.semester,
            ...(session.schedule.division ? { division: session.schedule.division } : {}),
        },
        select: { id: true }
    });

    const markedStudentIds = new Set(session.attendances.map(a => a.studentId));
    const unmarkedStudents = allStudents.filter(s => !markedStudentIds.has(s.id));

    // Bulk-create ABSENT records for unmarked students
    if (unmarkedStudents.length > 0) {
        await prisma.attendance.createMany({
            data: unmarkedStudents.map(s => ({
                sessionId,
                studentId: s.id,
                status: 'ABSENT' as AttendanceStatus,
                markedBy: 'SYSTEM_AUTO',
            }))
        });
    }

    // Mark session as completed
    await prisma.classSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED' }
    });

    const finalPresent = session.attendances.filter(
        a => a.status === 'PRESENT' || a.status === 'LATE'
    ).length;

    return {
        sessionId,
        status: 'COMPLETED',
        presentCount: finalPresent,
        totalStudents: allStudents.length,
    };
};

// =============================================================================
// MANUAL ATTENDANCE — Mark a student present or absent manually
// =============================================================================
export const manualAttendance = async (
    userId: string,
    sessionId: string,
    studentId: string,
    status: 'PRESENT' | 'ABSENT'
) => {
    const session = await prisma.classSession.findUnique({
        where: { id: sessionId },
        include: { schedule: true }
    });

    if (!session) throw new ApiError(404, 'Session not found');
    if (session.schedule.facultyId !== userId) throw new ApiError(403, 'Not your session');
    if (session.status !== 'ACTIVE') throw new ApiError(400, 'Session is not active');

    const attendance = await prisma.attendance.upsert({
        where: {
            sessionId_studentId: { sessionId, studentId }
        },
        update: {
            status: status as AttendanceStatus,
            markedAt: new Date(),
            markedBy: userId,
        },
        create: {
            sessionId,
            studentId,
            status: status as AttendanceStatus,
            markedBy: userId,
        }
    });

    // Emit real-time event
    const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: { firstName: true, lastName: true, identifier: true }
    });

    const eventName = status === 'PRESENT' ? 'student_added' : 'student_removed';
    try {
        getIO().to(sessionId).emit(eventName, {
            id: student?.identifier,
            name: `${student?.firstName} ${student?.lastName}`,
            studentId,
        });
    } catch { /* socket not initialised in tests */ }

    return { attendanceId: attendance.id, status: attendance.status };
};
