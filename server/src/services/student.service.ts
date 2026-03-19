// src/services/student.service.ts

import { prisma } from '../db.js';
import { ApiError } from '../utils/ApiError.js';
import { getIO } from '../socket.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper to get the current day as our DayOfWeek enum value
const getDayOfWeek = (): string => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[new Date().getDay()]!;
};

export const getDashboard = async (userId: string) => {
    // Fetch the student with their department info
    const student = await prisma.user.findUnique({
        where: { id: userId },
        include: { department: true }
    });

    if (!student) throw new ApiError(404, 'Student not found');

    // --- TODAY'S CLASSES ---
    // Find today's scheduled classes for this student's dept/semester/division
    const today = getDayOfWeek();
    const todaysSchedules = await prisma.timetableSchedule.findMany({
        where: {
            ...(student.departmentId && { departmentId: student.departmentId }),
            ...(student.semester && { semester: student.semester }),
            division: student.division,
            dayOfWeek: today as any,
        },
        include: {
            subject: true,
            faculty: { select: { firstName: true, lastName: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    // --- ATTENDANCE HISTORY ---
    // Get all attendance records for this student
    const attendances = await prisma.attendance.findMany({
        where: { studentId: userId },
        include: {
            session: {
                include: {
                    schedule: {
                        include: { subject: true }
                    }
                }
            }
        }
    });

    // --- AGGREGATE: Subject-wise breakdown ---
    const subjectMap = new Map<string, { name: string; total: number; present: number }>();

    for (const record of attendances) {
        const subjectName = record.session.schedule.subject.name;
        const subjectId = record.session.schedule.subjectId;

        if (!subjectMap.has(subjectId)) {
            subjectMap.set(subjectId, { name: subjectName, total: 0, present: 0 });
        }

        const entry = subjectMap.get(subjectId)!;
        entry.total++;
        if (record.status === 'PRESENT' || record.status === 'LATE') {
            entry.present++;
        }
    }

    const subjectBreakdown = Array.from(subjectMap.entries()).map(([id, data]) => ({
        subjectId: id,
        subjectName: data.name,
        totalClasses: data.total,
        attended: data.present,
        percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
    }));

    // --- OVERALL STATS ---
    const totalClasses = attendances.length;
    const totalPresent = attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
    const atRiskCount = subjectBreakdown.filter(s => s.percentage < 75).length;

    return {
        student: {
            firstName: student.firstName,
            lastName: student.lastName,
            department: student.department?.name,
            semester: student.semester,
        },
        overallAttendancePercentage: overallPercentage,
        atRiskCount,
        todaysClasses: todaysSchedules.map(s => ({
            scheduleId: s.id,
            subjectName: s.subject.name,
            subjectCode: s.subject.code,
            faculty: `${s.faculty.firstName} ${s.faculty.lastName}`,
            startTime: s.startTime,
            endTime: s.endTime,
            type: s.type,
        })),
        subjectBreakdown,
    };
};

// =============================================================================
// GET TIMETABLE
// Returns the student's weekly timetable grouped by day of week.
// Frontend: TimetablePage.js expects { Monday: [...], Tuesday: [...], ... }
// =============================================================================
export const getTimetable = async (userId: string) => {
    const student = await prisma.user.findUnique({
        where: { id: userId },
        select: { departmentId: true, semester: true, division: true }
    });

    if (!student) throw new ApiError(404, 'Student not found');

    const schedules = await prisma.timetableSchedule.findMany({
        where: {
            ...(student.departmentId && { departmentId: student.departmentId }),
            ...(student.semester && { semester: student.semester }),
            division: student.division,
        },
        include: {
            subject: { select: { name: true, code: true } },
            faculty: { select: { firstName: true, lastName: true } }
        },
        orderBy: { startTime: 'asc' }
    });

    // Map DayOfWeek enum values (MONDAY) to display names (Monday) and group
    const dayDisplayMap: Record<string, string> = {
        MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
        THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday'
    };

    const timetable: Record<string, any[]> = {};

    for (const s of schedules) {
        const dayName = dayDisplayMap[s.dayOfWeek] ?? s.dayOfWeek;
        if (!timetable[dayName]) timetable[dayName] = [];

        timetable[dayName].push({
            scheduleId: s.id,
            subject_name: s.subject.name,
            subject_code: s.subject.code,
            teacher_name: `${s.faculty.firstName} ${s.faculty.lastName}`,
            start_time: s.startTime,
            end_time: s.endTime,
            type: s.type,
        });
    }

    return timetable;
};

// =============================================================================
// GET ATTENDANCE
// Returns the student's attendance history with optional month/subject filters,
// plus a list of unique subjects and per-subject stats.
// Frontend: AttendancePage.js expects { records: [...], subjects: [...], subjectStats: [...] }
// =============================================================================
export const getAttendance = async (
    userId: string,
    month?: number,
    subjectId?: string
) => {
    // Build date range filter if month is specified
    const dateFilter: any = {};
    if (month) {
        const year = new Date().getFullYear();
        dateFilter.session = {
            date: {
                gte: new Date(year, month - 1, 1),
                lt: new Date(year, month, 1),
            }
        };
    }

    const attendances = await prisma.attendance.findMany({
        where: {
            studentId: userId,
            ...(subjectId && {
                session: {
                    schedule: { subjectId },
                    ...dateFilter.session,
                }
            }),
            ...(!subjectId && dateFilter.session ? { session: dateFilter.session } : {}),
        },
        include: {
            session: {
                include: {
                    schedule: {
                        include: { subject: { select: { id: true, name: true, code: true } } }
                    }
                }
            }
        },
        orderBy: { markedAt: 'desc' }
    });

    // Build the flat record list the frontend expects
    const records = attendances.map(a => ({
        id: a.id,
        datetime: a.session.date.toISOString(),
        subject: a.session.schedule.subject.name,
        subjectCode: a.session.schedule.subject.code,
        status: a.status === 'PRESENT' || a.status === 'LATE' ? 'Present' : 'Absent',
    }));

    // Unique subject list for the filter dropdown (prepended with "All Subjects" on frontend)
    const subjectSet = new Map<string, string>();
    for (const a of attendances) {
        subjectSet.set(a.session.schedule.subject.id, a.session.schedule.subject.name);
    }
    const subjects = Array.from(subjectSet.values());

    // Per-subject stats
    const statsMap = new Map<string, { subjectName: string; totalLec: number; attendedLec: number }>();
    for (const a of attendances) {
        const name = a.session.schedule.subject.name;
        if (!statsMap.has(name)) {
            statsMap.set(name, { subjectName: name, totalLec: 0, attendedLec: 0 });
        }
        const entry = statsMap.get(name)!;
        entry.totalLec++;
        if (a.status === 'PRESENT' || a.status === 'LATE') entry.attendedLec++;
    }
    const subjectStats = Array.from(statsMap.values()).map(s => ({
        ...s,
        percentage: s.totalLec > 0 ? Math.round((s.attendedLec / s.totalLec) * 100) : 0
    }));

    return { records, subjects, subjectStats };
};

// =============================================================================
// SCAN QR — Mark attendance via QR code
// The QR token is a JWT signed by the server containing { sessionId }.
// We verify it, confirm the session is ACTIVE, then upsert attendance.
// =============================================================================
export const scanQR = async (
    userId: string,
    qrToken: string,
    location?: { latitude: number; longitude: number }
) => {
    // 1. Verify the QR JWT
    let payload: { sessionId: string };
    try {
        payload = jwt.verify(qrToken, JWT_SECRET) as { sessionId: string };
    } catch {
        throw new ApiError(400, 'Invalid or expired QR code.');
    }

    if (!payload.sessionId) {
        throw new ApiError(400, 'Malformed QR code payload.');
    }

    // 2. Confirm the session exists and is currently active
    const session = await prisma.classSession.findUnique({
        where: { id: payload.sessionId },
        include: {
            schedule: {
                include: { subject: { select: { name: true } } }
            }
        }
    });

    if (!session) throw new ApiError(404, 'Session not found.');
    if (session.status !== 'ACTIVE') {
        throw new ApiError(400, 'This session is no longer active.');
    }

    // 3. Verify the student belongs to this class (dept/semester/division match)
    const student = await prisma.user.findUnique({
        where: { id: userId },
        select: { departmentId: true, semester: true, division: true }
    });

    if (!student) throw new ApiError(404, 'Student not found.');

    const schedule = session.schedule;
    if (
        student.departmentId !== schedule.departmentId ||
        student.semester !== schedule.semester ||
        student.division !== schedule.division
    ) {
        throw new ApiError(403, 'You are not enrolled in this class.');
    }

    // 4. Upsert attendance (idempotent thanks to @@unique([sessionId, studentId]))
    const attendance = await prisma.attendance.upsert({
        where: {
            sessionId_studentId: {
                sessionId: payload.sessionId,
                studentId: userId,
            }
        },
        update: {
            status: 'PRESENT',
            markedAt: new Date(),
            markedBy: 'SYSTEM_QR',
            ...(location && { latitude: location.latitude, longitude: location.longitude }),
        },
        create: {
            sessionId: payload.sessionId,
            studentId: userId,
            status: 'PRESENT',
            markedBy: 'SYSTEM_QR',
            ...(location && { latitude: location.latitude, longitude: location.longitude }),
        }
    });

    // 5. Emit real-time event to the faculty's live session room
    const studentInfo = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true, identifier: true }
    });

    try {
        getIO().to(payload.sessionId).emit('student_joined', {
            id: userId,
            identifier: studentInfo?.identifier,
            firstName: studentInfo?.firstName,
            lastName: studentInfo?.lastName,
        });
    } catch { /* socket not initialised in tests */ }


    return {
        attendanceId: attendance.id,
        message: `Attendance Marked for ${schedule.subject.name}!`,
    };
};

export const getAttendanceHistory = async (userId: string, limit: number = 20, subjectId?: string) => {
    // 1. Fetch attendance records
    const attendanceRecords = await prisma.attendance.findMany({
        where: {
            studentId: userId,
            ...(subjectId ? { session: { schedule: { subjectId: subjectId } } } : {}),
            status: { in: ['PRESENT', 'LATE'] }
        },
        take: limit,
        orderBy: {
            markedAt: 'desc'
        },
        include: {
            session: {
                include: {
                    schedule: {
                        include: { subject: true }
                    }
                }
            }
        }
    });

    const dayDisplayMap: Record<string, string> = {
        MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
        THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday'
    };

    // 2. Format into history cards
    const historyCards = attendanceRecords.map(record => {
        const sched = record.session.schedule;
        const dateObj = record.session.date;
        return {
            id: record.id,
            subjectName: sched.subject.name,
            subjectCode: sched.subject.code,
            day: dayDisplayMap[sched.dayOfWeek] || sched.dayOfWeek,
            date: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: `${sched.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - ${sched.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`,
            status: record.status
        };
    });

    return { history: historyCards };
};
