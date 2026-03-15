// prisma/seed.ts
import { Role, Gender, DayOfWeek, ClassType, AttendanceStatus, LeaveType, LeaveStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/db.js';

async function main() {
  console.log('Clearing database...');
  await prisma.attendance.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.timetableSchedule.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log('Seeding Database...');

  // 1. Create Department
  const csDept = await prisma.department.create({
    data: {
      name: 'Computer Science and Engineering',
      code: 'CSE',
    },
  });

  // 2. Hash Password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 3. Create Faculty
  const facultySharma = await prisma.user.create({
    data: {
      identifier: 'FAC001',
      firstName: 'Rajesh',
      lastName: 'Sharma',
      email: 'rajesh.sharma@sih.edu',
      passwordHash,
      role: Role.FACULTY,
      gender: Gender.MALE,
      dateOfBirth: new Date('1980-05-15'),
      departmentId: csDept.id,
    },
  });

  // 4. Create Students (5 students for a small cohort)
  const students = await Promise.all([
    prisma.user.create({
      data: {
        identifier: '24BCS101', firstName: 'Rohan', lastName: 'Kumar', email: 'rohan.k@sih.edu',
        passwordHash, role: Role.STUDENT, gender: Gender.MALE, dateOfBirth: new Date('2004-01-10'),
        departmentId: csDept.id, semester: 3, division: 'A'
      }
    }),
    prisma.user.create({
      data: {
        identifier: '24BCS102', firstName: 'Priya', lastName: 'Singh', email: 'priya.s@sih.edu',
        passwordHash, role: Role.STUDENT, gender: Gender.FEMALE, dateOfBirth: new Date('2004-03-22'),
        departmentId: csDept.id, semester: 3, division: 'A'
      }
    }),
    prisma.user.create({
      data: {
        identifier: '24BCS103', firstName: 'Amit', lastName: 'Verma', email: 'amit.v@sih.edu',
        passwordHash, role: Role.STUDENT, gender: Gender.MALE, dateOfBirth: new Date('2003-11-05'),
        departmentId: csDept.id, semester: 3, division: 'A'
      }
    }),
    prisma.user.create({
      data: {
        identifier: '24BCS104', firstName: 'Sneha', lastName: 'Patel', email: 'sneha.p@sih.edu',
        passwordHash, role: Role.STUDENT, gender: Gender.FEMALE, dateOfBirth: new Date('2004-08-14'),
        departmentId: csDept.id, semester: 3, division: 'A'
      }
    }),
  ]);

  // 5. Create Subjects
  const dsSubject = await prisma.subject.create({
    data: {
      name: 'Data Structures', code: 'CS301', credits: 4, departmentId: csDept.id, facultyId: facultySharma.id
    }
  });

  const dbSubject = await prisma.subject.create({
    data: {
      name: 'Database Systems', code: 'CS302', credits: 3, departmentId: csDept.id, facultyId: facultySharma.id
    }
  });

  // 6. Create Timetable Schedules for Today (so dashboard shows them)
  const todayValue = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date().getDay()] as DayOfWeek;
  
  // Set times for today
  const time1Start = new Date(); time1Start.setHours(10, 0, 0, 0);
  const time1End = new Date(); time1End.setHours(11, 0, 0, 0);

  const time2Start = new Date(); time2Start.setHours(13, 0, 0, 0);
  const time2End = new Date(); time2End.setHours(14, 0, 0, 0);

  const dsSchedule = await prisma.timetableSchedule.create({
    data: {
      subjectId: dsSubject.id, facultyId: facultySharma.id, departmentId: csDept.id,
      semester: 3, division: 'A', dayOfWeek: todayValue, type: ClassType.LECTURE,
      startTime: time1Start, endTime: time1End
    }
  });

  const dbSchedule = await prisma.timetableSchedule.create({
    data: {
      subjectId: dbSubject.id, facultyId: facultySharma.id, departmentId: csDept.id,
      semester: 3, division: 'A', dayOfWeek: todayValue, type: ClassType.LAB,
      startTime: time2Start, endTime: time2End
    }
  });

  // 7. Create Past Sessions + Attendance (for Analytics)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const pastSession = await prisma.classSession.create({
    data: { scheduleId: dsSchedule.id, date: lastWeek, status: 'COMPLETED' }
  });

  // Mark all present except student 3 (Amit) -> creates 'at-risk' data
  for (const student of students) {
    await prisma.attendance.create({
      data: {
        sessionId: pastSession.id,
        studentId: student.id,
        status: student.identifier === '24BCS103' ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
        markedBy: facultySharma.id,
      }
    });
  }

  // 8. Create a pending Leave Request from Rohan
  await prisma.leaveRequest.create({
    data: {
      userId: students[0].id,
      type: LeaveType.MEDICAL,
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Fever',
      status: LeaveStatus.PENDING
    }
  });

  console.log('Database seeded successfully!');
  console.log(`Test Faculty: FAC001 / Password123!`);
  console.log(`Test Student: 24BCS101 / Password123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
