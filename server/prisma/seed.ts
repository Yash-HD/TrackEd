// prisma/seed.ts
import {
  Role,
  Gender,
  DayOfWeek,
  ClassType,
  AttendanceStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/db.js';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function time(h: number, m = 0): Date {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function pastDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Convert attendance percentage + total delivered → lectures attended count
// already given in the PDF, so we just use what's provided directly.

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('🗑️  Clearing existing data...');
  await prisma.attendance.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.timetableSchedule.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log('🌱 Seeding database...');

  // ── 1. DEPARTMENT ──────────────────────────
  const compDept = await prisma.department.create({
    data: {
      name: 'Computer Engineering',
      code: 'COMP',
    },
  });

  // ── 2. PASSWORD ────────────────────────────
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // ── 3. FACULTY ─────────────────────────────
  // Faculty initials extracted from all four timetables
  const facultyData = [
    { identifier: 'FAC-KKD', firstName: 'Kailas', lastName: 'Devadkar', email: 'kailas.devadkar@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-AVN', firstName: 'Anant', lastName: 'Nimkar', email: 'anant.nimkar@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-JS', firstName: 'Jignesh', lastName: 'Sisodia', email: 'jignesh.sisodia@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-NR', firstName: 'Nataasha', lastName: 'Raul', email: 'nataasha.raul@spit.ac.in', gender: Gender.FEMALE },
    { identifier: 'FAC-DN', firstName: 'Deepak', lastName: 'Nair', email: 'deepak.nair@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-SND', firstName: 'Sudhir', lastName: 'Dhage', email: 'sudhir.dhage@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-AT', firstName: 'Anuj', lastName: 'Tawari', email: 'anuj.tawari@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-AST', firstName: 'Asma', lastName: 'Tambe', email: 'asma.tambe@spit.ac.in', gender: Gender.FEMALE },
    { identifier: 'FAC-PBB', firstName: 'P. B.', lastName: 'Bhavathankar', email: 'pb.bhavathankar@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-AVS', firstName: 'Abhijeet', lastName: 'Salunke', email: 'abhijeet.salunke@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-SK', firstName: 'Swapnali', lastName: 'Kurhade', email: 'swapnali.kurhade@spit.ac.in', gender: Gender.FEMALE },
    { identifier: 'FAC-SD', firstName: 'Sonali', lastName: 'Dudhihalli', email: 'sonali.dudhihalli@spit.ac.in', gender: Gender.FEMALE },
    { identifier: 'FAC-SM', firstName: 'Suman', lastName: 'M', email: 'suman.m@spit.ac.in', gender: Gender.FEMALE },
    { identifier: 'FAC-AGN', firstName: 'Amey', lastName: 'Nile', email: 'amey.nile@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-IS', firstName: 'Isha', lastName: 'Sawalkar', email: 'isha.sawalkar@spit.ac.in', gender: Gender.FEMALE },
    { identifier: 'FAC-CRG', firstName: 'C. R.', lastName: 'Gajbhiye', email: 'cr.gajbhiye@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-TP', firstName: 'Taqdis', lastName: 'Pawle', email: 'taqdis.pawle@spit.ac.in', gender: Gender.FEMALE },
    { identifier: 'FAC-AY', firstName: 'Arman', lastName: 'Yadav', email: 'arman.yadav@spit.ac.in', gender: Gender.MALE },
    { identifier: 'FAC-AN', firstName: 'Aishwarya', lastName: 'Nalawade', email: 'aishwarya.nalawade@spit.ac.in', gender: Gender.FEMALE },
  ];

  const facultyMap: Record<string, string> = {}; // initials → id
  for (const f of facultyData) {
    const u = await prisma.user.create({
      data: {
        identifier: f.identifier,
        firstName: f.firstName,
        lastName: f.lastName,
        email: f.email,
        passwordHash,
        role: Role.FACULTY,
        gender: f.gender,
        dateOfBirth: new Date('1985-01-01'),
        departmentId: compDept.id,
      },
    });
    // map by the short code after "FAC-"
    facultyMap[f.identifier.replace('FAC-', '')] = u.id;
  }

  // ── 4. SUBJECTS (Semester IV) ──────────────
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: 'Operating Systems', code: 'COMP401', credits: 4, departmentId: compDept.id, facultyId: facultyMap['KKD'] } }),
    prisma.subject.create({ data: { name: 'Design and Analysis of Algorithms', code: 'COMP402', credits: 4, departmentId: compDept.id, facultyId: facultyMap['AVN'] } }),
    prisma.subject.create({ data: { name: 'Computer Communication Networks', code: 'COMP403', credits: 4, departmentId: compDept.id, facultyId: facultyMap['JS'] } }),
    prisma.subject.create({ data: { name: 'Principles of Communication Systems', code: 'COMP404', credits: 3, departmentId: compDept.id, facultyId: facultyMap['DN'] } }),
    prisma.subject.create({ data: { name: 'Statistical Methods for Computer Science', code: 'COMP405', credits: 3, departmentId: compDept.id, facultyId: facultyMap['AT'] } }),
    prisma.subject.create({ data: { name: 'Fundamentals of Management II', code: 'COMP406', credits: 2, departmentId: compDept.id, facultyId: facultyMap['AST'] } }),
  ]);

  const [osSubj, daaSubj, ccnSubj, pcsSubj, smcsSubj, fomSubj] = subjects;

  // ── 5. TIMETABLE SCHEDULES ─────────────────
  // Format from timetable: SUBJECT / FACULTY / ROOM
  // Div A  – w.e.f 27/01/2026
  // OS: KKD, DAA: AVN, CCN: JS, PCS: DN, SMCS: AT, FOM-II: AST
  // Div B  – OS: KKD, DAA: AVN, CCN: JS, PCS: DN, SMCS: AT
  // Div C  – OS: SK,  DAA: PBB, CCN: AVS, PCS: SD, SMCS: CRG/TP
  // Div D  – OS: SK,  DAA: PBB, CCN: AVS, PCS: SD, SMCS: CRG/TP

  type ScheduleInput = {
    subjectId: string;
    facultyId: string;
    division: string;
    dayOfWeek: DayOfWeek;
    startTime: Date;
    endTime: Date;
    type: ClassType;
  };

  const scheduleInputs: ScheduleInput[] = [
    // ────────── DIV A ──────────
    // Monday
    { subjectId: osSubj.id, facultyId: facultyMap['KKD'], division: 'A', dayOfWeek: DayOfWeek.MONDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LAB },
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'A', dayOfWeek: DayOfWeek.MONDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LAB },
    { subjectId: smcsSubj.id, facultyId: facultyMap['AT'], division: 'A', dayOfWeek: DayOfWeek.MONDAY, startTime: time(2, 15), endTime: time(3, 15), type: ClassType.LECTURE }, // 2.15 PM
    // Tuesday
    { subjectId: osSubj.id, facultyId: facultyMap['KKD'], division: 'A', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'A', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: smcsSubj.id, facultyId: facultyMap['AT'], division: 'A', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(2, 15), endTime: time(3, 15), type: ClassType.LECTURE },
    // Wednesday
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'A', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['KKD'], division: 'A', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['JS'], division: 'A', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LAB },
    { subjectId: fomSubj.id, facultyId: facultyMap['AST'], division: 'A', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Thursday
    { subjectId: pcsSubj.id, facultyId: facultyMap['DN'], division: 'A', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'A', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['KKD'], division: 'A', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: fomSubj.id, facultyId: facultyMap['AST'], division: 'A', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Friday
    { subjectId: ccnSubj.id, facultyId: facultyMap['JS'], division: 'A', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'A', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: pcsSubj.id, facultyId: facultyMap['DN'], division: 'A', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LAB },

    // ────────── DIV B ──────────
    // Monday
    { subjectId: osSubj.id, facultyId: facultyMap['KKD'], division: 'B', dayOfWeek: DayOfWeek.MONDAY, startTime: time(9, 0), endTime: time(11, 0), type: ClassType.LAB },
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'B', dayOfWeek: DayOfWeek.MONDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: smcsSubj.id, facultyId: facultyMap['AT'], division: 'B', dayOfWeek: DayOfWeek.MONDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Tuesday
    { subjectId: osSubj.id, facultyId: facultyMap['KKD'], division: 'B', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['JS'], division: 'B', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'B', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: smcsSubj.id, facultyId: facultyMap['AT'], division: 'B', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Wednesday
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'B', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['KKD'], division: 'B', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['JS'], division: 'B', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LAB },
    { subjectId: fomSubj.id, facultyId: facultyMap['AST'], division: 'B', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Thursday
    { subjectId: pcsSubj.id, facultyId: facultyMap['DN'], division: 'B', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'B', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: fomSubj.id, facultyId: facultyMap['AST'], division: 'B', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Friday
    { subjectId: ccnSubj.id, facultyId: facultyMap['JS'], division: 'B', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['AVN'], division: 'B', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['KKD'], division: 'B', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: smcsSubj.id, facultyId: facultyMap['AT'], division: 'B', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },

    // ────────── DIV C ──────────
    // Monday
    { subjectId: daaSubj.id, facultyId: facultyMap['PBB'], division: 'C', dayOfWeek: DayOfWeek.MONDAY, startTime: time(9, 0), endTime: time(11, 0), type: ClassType.LAB },
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'C', dayOfWeek: DayOfWeek.MONDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['AVS'], division: 'C', dayOfWeek: DayOfWeek.MONDAY, startTime: time(12, 15), endTime: time(13, 15), type: ClassType.LECTURE },
    { subjectId: smcsSubj.id, facultyId: facultyMap['CRG'], division: 'C', dayOfWeek: DayOfWeek.MONDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Tuesday
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'C', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['PBB'], division: 'C', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'C', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LAB },
    { subjectId: smcsSubj.id, facultyId: facultyMap['CRG'], division: 'C', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Wednesday
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'C', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['PBB'], division: 'C', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['AVS'], division: 'C', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: fomSubj.id, facultyId: facultyMap['AST'], division: 'C', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Thursday
    { subjectId: pcsSubj.id, facultyId: facultyMap['SD'], division: 'C', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'C', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['PBB'], division: 'C', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['AVS'], division: 'C', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(12, 15), endTime: time(13, 15), type: ClassType.LECTURE },
    { subjectId: fomSubj.id, facultyId: facultyMap['AST'], division: 'C', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Friday
    { subjectId: ccnSubj.id, facultyId: facultyMap['AVS'], division: 'C', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: smcsSubj.id, facultyId: facultyMap['TP'], division: 'C', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'C', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },

    // ────────── DIV D ──────────
    // Monday
    { subjectId: daaSubj.id, facultyId: facultyMap['PBB'], division: 'D', dayOfWeek: DayOfWeek.MONDAY, startTime: time(9, 0), endTime: time(11, 0), type: ClassType.LAB },
    { subjectId: daaSubj.id, facultyId: facultyMap['PBB'], division: 'D', dayOfWeek: DayOfWeek.MONDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['AVS'], division: 'D', dayOfWeek: DayOfWeek.MONDAY, startTime: time(12, 15), endTime: time(13, 15), type: ClassType.LECTURE },
    { subjectId: smcsSubj.id, facultyId: facultyMap['CRG'], division: 'D', dayOfWeek: DayOfWeek.MONDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Tuesday
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'D', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: pcsSubj.id, facultyId: facultyMap['SD'], division: 'D', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'D', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LAB },
    { subjectId: smcsSubj.id, facultyId: facultyMap['CRG'], division: 'D', dayOfWeek: DayOfWeek.TUESDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Wednesday
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'D', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: daaSubj.id, facultyId: facultyMap['PBB'], division: 'D', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['AVS'], division: 'D', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: fomSubj.id, facultyId: facultyMap['AST'], division: 'D', dayOfWeek: DayOfWeek.WEDNESDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Thursday
    { subjectId: daaSubj.id, facultyId: facultyMap['PBB'], division: 'D', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'D', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: ccnSubj.id, facultyId: facultyMap['AVS'], division: 'D', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(11, 15), endTime: time(12, 15), type: ClassType.LECTURE },
    { subjectId: fomSubj.id, facultyId: facultyMap['AST'], division: 'D', dayOfWeek: DayOfWeek.THURSDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
    // Friday
    { subjectId: ccnSubj.id, facultyId: facultyMap['AVS'], division: 'D', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(9, 0), endTime: time(10, 0), type: ClassType.LECTURE },
    { subjectId: smcsSubj.id, facultyId: facultyMap['TP'], division: 'D', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(10, 0), endTime: time(11, 0), type: ClassType.LECTURE },
    { subjectId: osSubj.id, facultyId: facultyMap['SK'], division: 'D', dayOfWeek: DayOfWeek.FRIDAY, startTime: time(14, 15), endTime: time(15, 15), type: ClassType.LECTURE },
  ];

  const scheduleMap: Record<string, string> = {}; // "DIV-SUBJECT-DAY-TYPE" → id
  for (const s of scheduleInputs) {
    const key = `${s.division}-${s.subjectId}-${s.dayOfWeek}-${s.type}`;
    const sched = await prisma.timetableSchedule.create({
      data: {
        subjectId: s.subjectId,
        facultyId: s.facultyId,
        departmentId: compDept.id,
        semester: 4,
        division: s.division,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        type: s.type,
      },
    });
    scheduleMap[key] = sched.id;
  }

  // Helper to get first matching schedule id
  function getScheduleId(division: string, subjId: string, day: DayOfWeek, type: ClassType): string | undefined {
    const key = `${division}-${subjId}-${day}-${type}`;
    return scheduleMap[key];
  }

  // ── 6. STUDENTS ────────────────────────────
  // We'll parse name into firstName + lastName (lastName = first token, rest = firstName)
  // UID format from doc used as identifier

  type StudentRow = {
    uid: string;
    name: string;
    division: string;
    gender: Gender;
    // Theory attendance counts  [OS, DAA, CCN, PCS, SMCS]
    thLec: [number, number, number, number, number];
    // Lab attendance counts     [OS, DAA, CCN, PCS]
    labLec: [number, number, number, number];
  };

  // Total delivered per division (from document headers):
  // DIV A/B theory: OS=19, DAA=20, CCN=19, PCS=7, SMCS=19  labs: OS=3(A)/5(B), DAA=5(A)/3(B)..
  // DIV C/D theory: OS=19, DAA=21, CCN=14, PCS=7, SMCS=21  labs each=5

  // For simplicity we store "sessions attended" as the lecture count from doc.
  // We generate one ClassSession per unique (schedule, date) pair historically.
  // We'll create sessions at weekly intervals going back from 27-Jan-2026.

  const divAStudents: StudentRow[] = [
    { uid: '2024300001', name: 'Agarwal Ekaagra Manish', division: 'A', gender: Gender.MALE, thLec: [19, 18, 18, 7, 15], labLec: [1, 5, 5, 4] },
    { uid: '2024300002', name: 'Agarwal Ananthari Abhishek', division: 'A', gender: Gender.MALE, thLec: [15, 16, 16, 7, 14], labLec: [2, 4, 5, 4] },
    { uid: '2024300003', name: 'Agrawal Meet Rajesh', division: 'A', gender: Gender.MALE, thLec: [17, 17, 16, 6, 13], labLec: [1, 5, 5, 3] },
    { uid: '2024300004', name: 'Akhade Arya Santosh', division: 'A', gender: Gender.FEMALE, thLec: [18, 18, 16, 7, 19], labLec: [2, 4, 4, 4] },
    { uid: '2024300005', name: 'Alphanso Chris Cajitan', division: 'A', gender: Gender.MALE, thLec: [16, 20, 19, 7, 17], labLec: [2, 5, 5, 4] },
    { uid: '2024300006', name: 'Alwala Nipun Shekhar', division: 'A', gender: Gender.MALE, thLec: [18, 17, 18, 7, 17], labLec: [2, 5, 5, 4] },
    { uid: '2024300007', name: 'Ambekar Sanvi Sandeep', division: 'A', gender: Gender.FEMALE, thLec: [18, 18, 18, 6, 17], labLec: [2, 4, 5, 3] },
    { uid: '2024300008', name: 'Annsh Shailesh Amin', division: 'A', gender: Gender.MALE, thLec: [16, 18, 19, 4, 15], labLec: [2, 3, 3, 2] },
    { uid: '2024300009', name: 'Angadi Laxmi Mahesh', division: 'A', gender: Gender.FEMALE, thLec: [17, 18, 18, 6, 16], labLec: [2, 4, 5, 4] },
    { uid: '2024300010', name: 'Asrani Suhana Sunjay', division: 'A', gender: Gender.FEMALE, thLec: [17, 19, 18, 6, 17], labLec: [2, 5, 5, 4] },
    { uid: '2024300011', name: 'Avhad Om Shantaram', division: 'A', gender: Gender.MALE, thLec: [15, 18, 16, 6, 14], labLec: [2, 3, 5, 4] },
    { uid: '2024300012', name: 'Omkar Babar', division: 'A', gender: Gender.MALE, thLec: [13, 18, 15, 5, 17], labLec: [2, 5, 5, 4] },
    { uid: '2024300013', name: 'Badade Vikrant Bhausaheb', division: 'A', gender: Gender.MALE, thLec: [5, 12, 7, 5, 11], labLec: [1, 4, 4, 3] },
    { uid: '2024300014', name: 'Bagad Sushant Ravindra', division: 'A', gender: Gender.MALE, thLec: [9, 15, 12, 4, 14], labLec: [2, 4, 5, 4] },
    { uid: '2024300015', name: 'Balwa Hamzah Sayeed', division: 'A', gender: Gender.MALE, thLec: [17, 16, 18, 6, 16], labLec: [2, 5, 5, 4] },
    { uid: '2024300016', name: 'Bardiya Muskan Rajesh', division: 'A', gender: Gender.FEMALE, thLec: [16, 16, 15, 6, 15], labLec: [2, 3, 4, 4] },
    { uid: '2024300017', name: 'Bhadreshwara Dhruv Manish', division: 'A', gender: Gender.MALE, thLec: [18, 19, 18, 7, 19], labLec: [2, 5, 5, 4] },
    { uid: '2024300018', name: 'Bhagat Saumya Ajay', division: 'A', gender: Gender.FEMALE, thLec: [14, 16, 16, 5, 14], labLec: [2, 4, 4, 4] },
    { uid: '2024300019', name: 'Bhalani Dhruv Vipul', division: 'A', gender: Gender.MALE, thLec: [17, 20, 15, 7, 16], labLec: [2, 5, 5, 4] },
    { uid: '2024300020', name: 'Bhangare Yash Bhaurao', division: 'A', gender: Gender.MALE, thLec: [16, 13, 15, 5, 12], labLec: [4, 2, 4, 5] },
    { uid: '2024300021', name: 'Bhardwaj Pranav Vasant', division: 'A', gender: Gender.MALE, thLec: [16, 15, 15, 7, 17], labLec: [5, 3, 5, 5] },
    { uid: '2024300022', name: 'Bhide Avani Vishwajit', division: 'A', gender: Gender.FEMALE, thLec: [19, 20, 19, 7, 19], labLec: [5, 3, 5, 5] },
    { uid: '2024300023', name: 'Bhide Tanuj Vivek', division: 'A', gender: Gender.MALE, thLec: [16, 18, 17, 7, 16], labLec: [5, 3, 5, 5] },
    { uid: '2024300024', name: 'Soham Sanjay Bobhate', division: 'A', gender: Gender.MALE, thLec: [14, 19, 17, 6, 17], labLec: [5, 3, 5, 5] },
    { uid: '2024300025', name: 'Boricha Jai Nikhil', division: 'A', gender: Gender.MALE, thLec: [16, 19, 17, 6, 15], labLec: [5, 3, 5, 4] },
    { uid: '2024300026', name: 'Chaudhari Tanaya Manish', division: 'A', gender: Gender.FEMALE, thLec: [17, 18, 18, 7, 17], labLec: [5, 3, 5, 4] },
    { uid: '2024300027', name: 'Chaudhari Anushka Pradip', division: 'A', gender: Gender.FEMALE, thLec: [18, 19, 17, 7, 17], labLec: [5, 3, 5, 5] },
    { uid: '2024300028', name: 'Chavan Chetan Tulshiram', division: 'A', gender: Gender.MALE, thLec: [14, 17, 15, 5, 13], labLec: [5, 3, 4, 5] },
    { uid: '2024300029', name: 'Chhadva Yaadi Ramesh', division: 'A', gender: Gender.MALE, thLec: [16, 14, 16, 7, 16], labLec: [5, 3, 5, 5] },
    { uid: '2024300030', name: 'Choksi Daivik Monil', division: 'A', gender: Gender.MALE, thLec: [11, 16, 11, 4, 15], labLec: [4, 3, 4, 4] },
    { uid: '2024300031', name: 'Dalal Yashvi Umang', division: 'A', gender: Gender.FEMALE, thLec: [18, 17, 19, 6, 18], labLec: [5, 3, 5, 5] },
    { uid: '2024300032', name: 'Dalal Anusha Naren', division: 'A', gender: Gender.FEMALE, thLec: [14, 16, 17, 7, 17], labLec: [4, 3, 4, 5] },
    { uid: '2024300033', name: 'Dalvi Atharva Ravindra', division: 'A', gender: Gender.MALE, thLec: [4, 8, 5, 4, 13], labLec: [2, 1, 1, 3] },
    { uid: '2024300034', name: 'Dalvi Chinmay Milind', division: 'A', gender: Gender.MALE, thLec: [16, 19, 17, 5, 15], labLec: [5, 3, 5, 5] },
    { uid: '2024300035', name: 'Dalvi Durvank Hemant', division: 'A', gender: Gender.MALE, thLec: [18, 19, 18, 7, 18], labLec: [5, 3, 5, 5] },
    { uid: '2024300036', name: 'Damewale Prashant Rameshwar', division: 'A', gender: Gender.MALE, thLec: [14, 16, 14, 6, 17], labLec: [3, 1, 4, 5] },
    { uid: '2024300037', name: 'Darakh Aayush Pavan', division: 'A', gender: Gender.MALE, thLec: [13, 13, 11, 5, 14], labLec: [5, 3, 4, 5] },
    { uid: '2024300038', name: 'Davare Samiksha Manoj', division: 'A', gender: Gender.FEMALE, thLec: [17, 20, 18, 4, 17], labLec: [5, 3, 5, 5] },
    { uid: '2024300039', name: 'Dave Aashka Pankaj', division: 'A', gender: Gender.FEMALE, thLec: [14, 14, 14, 5, 16], labLec: [5, 4, 3, 4] },
    { uid: '2024300040', name: 'Daware Sampada Anil', division: 'A', gender: Gender.FEMALE, thLec: [15, 17, 17, 5, 15], labLec: [5, 5, 4, 5] },
    { uid: '2024300041', name: 'Desai Jai Devang', division: 'A', gender: Gender.MALE, thLec: [17, 19, 17, 7, 15], labLec: [5, 5, 4, 5] },
    { uid: '2024300042', name: 'Desai Stavan Ketan', division: 'A', gender: Gender.MALE, thLec: [17, 19, 17, 6, 18], labLec: [5, 5, 4, 5] },
    { uid: '2024300043', name: 'Deshmukh Amar Raju', division: 'A', gender: Gender.MALE, thLec: [14, 15, 15, 4, 18], labLec: [5, 5, 3, 5] },
    { uid: '2024300044', name: 'Deshmukh Shivaji Hemant', division: 'A', gender: Gender.MALE, thLec: [14, 15, 16, 7, 16], labLec: [4, 5, 3, 5] },
    { uid: '2024300045', name: 'Deshpande Soniya Sameer', division: 'A', gender: Gender.FEMALE, thLec: [18, 20, 17, 7, 17], labLec: [5, 5, 4, 5] },
    { uid: '2024300046', name: 'Dhamale Kunal Manik', division: 'A', gender: Gender.MALE, thLec: [19, 18, 19, 7, 18], labLec: [5, 5, 4, 5] },
    { uid: '2024300047', name: 'Dharamshi Yash Hiren', division: 'A', gender: Gender.MALE, thLec: [17, 19, 19, 7, 16], labLec: [5, 5, 4, 5] },
    { uid: '2024300048', name: 'Dhoka Vivan Manish', division: 'A', gender: Gender.MALE, thLec: [17, 16, 17, 6, 15], labLec: [5, 5, 3, 5] },
    { uid: '2024300049', name: 'Dhumal Rohan Shashikant', division: 'A', gender: Gender.MALE, thLec: [15, 18, 17, 7, 15], labLec: [5, 5, 4, 5] },
    { uid: '2024300050', name: 'Dhyani Nidhi Rajkamal', division: 'A', gender: Gender.FEMALE, thLec: [16, 13, 15, 4, 16], labLec: [4, 5, 4, 5] },
    { uid: '2024300051', name: 'Shrut Navneet Diwakar', division: 'A', gender: Gender.MALE, thLec: [15, 15, 18, 7, 16], labLec: [4, 5, 3, 5] },
    { uid: '2024300052', name: 'Swanand Sandip Dixit', division: 'A', gender: Gender.MALE, thLec: [15, 16, 15, 6, 15], labLec: [4, 5, 3, 4] },
    { uid: '2024300053', name: 'Doshi Aaditya Kiran', division: 'A', gender: Gender.MALE, thLec: [17, 18, 16, 7, 15], labLec: [4, 4, 3, 5] },
    { uid: '2024300054', name: 'Fatnani Piyush Navin', division: 'A', gender: Gender.MALE, thLec: [19, 20, 19, 7, 18], labLec: [5, 5, 4, 5] },
    { uid: '2024300055', name: 'Clark Fernandes', division: 'A', gender: Gender.MALE, thLec: [19, 20, 19, 7, 19], labLec: [5, 5, 4, 5] },
    { uid: '2024300056', name: 'Gadekar Krrish Jacob', division: 'A', gender: Gender.MALE, thLec: [11, 14, 12, 6, 14], labLec: [5, 4, 3, 5] },
    { uid: '2024300057', name: 'Gaglani Dev Sandeep', division: 'A', gender: Gender.MALE, thLec: [14, 16, 13, 5, 17], labLec: [5, 5, 3, 5] },
    { uid: '2024300058', name: 'Gandhi Amit Tushar', division: 'A', gender: Gender.MALE, thLec: [19, 20, 18, 7, 16], labLec: [5, 5, 5, 2] },
    { uid: '2024300059', name: 'Grasit Kiran Gandhi', division: 'A', gender: Gender.MALE, thLec: [18, 19, 16, 7, 17], labLec: [5, 5, 5, 2] },
    { uid: '2024300060', name: 'Gangaramani Krisha Prakash', division: 'A', gender: Gender.FEMALE, thLec: [19, 18, 19, 7, 17], labLec: [5, 5, 5, 2] },
    { uid: '2024300061', name: 'Dhruv Hemant Gangurde', division: 'A', gender: Gender.MALE, thLec: [12, 13, 13, 5, 16], labLec: [4, 4, 4, 1] },
    { uid: '2024300062', name: 'Gayakwad Garima Vilas', division: 'A', gender: Gender.FEMALE, thLec: [19, 18, 18, 7, 17], labLec: [5, 5, 5, 2] },
    { uid: '2024300063', name: 'Ghanshani Suneet Manish', division: 'A', gender: Gender.MALE, thLec: [17, 18, 16, 6, 15], labLec: [5, 5, 5, 2] },
    { uid: '2024300064', name: 'Gharwade Tanishka Laxmikant', division: 'A', gender: Gender.FEMALE, thLec: [18, 17, 18, 7, 18], labLec: [5, 4, 5, 2] },
    { uid: '2024300065', name: 'Gholba Vedansh Vikas', division: 'A', gender: Gender.MALE, thLec: [18, 19, 18, 5, 18], labLec: [5, 4, 4, 2] },
    { uid: '2024300066', name: 'Ghole Harsh Kiran', division: 'A', gender: Gender.MALE, thLec: [13, 16, 13, 5, 14], labLec: [5, 4, 4, 2] },
    { uid: '2024300067', name: 'Ghuge Vedant Ganesh', division: 'A', gender: Gender.MALE, thLec: [14, 18, 17, 5, 15], labLec: [5, 5, 5, 2] },
    { uid: '2024300068', name: 'Goggi Parth Vinay', division: 'A', gender: Gender.MALE, thLec: [16, 19, 18, 6, 14], labLec: [5, 5, 5, 2] },
    { uid: '2024300069', name: 'Gonugade Arjun Jalandar', division: 'A', gender: Gender.MALE, thLec: [17, 20, 17, 4, 17], labLec: [4, 5, 5, 2] },
    { uid: '2024300070', name: 'Gosar Prasham Shrenik', division: 'A', gender: Gender.MALE, thLec: [18, 19, 18, 7, 18], labLec: [5, 5, 5, 2] },
    { uid: '2024300071', name: 'Aryan Ravindra Gosavi', division: 'A', gender: Gender.MALE, thLec: [14, 17, 14, 6, 11], labLec: [5, 5, 5, 2] },
    { uid: '2024300072', name: 'Gujar Rutuja Ravindra', division: 'A', gender: Gender.FEMALE, thLec: [17, 15, 16, 7, 14], labLec: [4, 4, 5, 2] },
    { uid: '2024300073', name: 'Gupta Aryan Rajiv', division: 'A', gender: Gender.MALE, thLec: [19, 20, 19, 7, 18], labLec: [5, 5, 5, 2] },
    { uid: '2024300074', name: 'Gupte Anushka Alhad', division: 'A', gender: Gender.FEMALE, thLec: [17, 20, 19, 7, 19], labLec: [5, 5, 5, 2] },
    { uid: '2024300075', name: 'Gurav Soham Santosh', division: 'A', gender: Gender.MALE, thLec: [15, 17, 18, 5, 15], labLec: [4, 5, 5, 2] },
    { uid: '2024300076', name: 'Hade Sarthak Sunil', division: 'A', gender: Gender.MALE, thLec: [17, 20, 17, 6, 17], labLec: [4, 5, 5, 2] },
  ];

  const divBStudents: StudentRow[] = [
    { uid: '2024300077', name: 'Harel Shravani Rajesh', division: 'B', gender: Gender.FEMALE, thLec: [15, 15, 17, 6, 16], labLec: [3, 5, 4, 5] },
    { uid: '2024300078', name: 'Haware Khushant Chandrashekhar', division: 'B', gender: Gender.MALE, thLec: [15, 14, 14, 5, 17], labLec: [3, 4, 5, 5] },
    { uid: '2024300079', name: 'Sarang Ashish Hirlekar', division: 'B', gender: Gender.MALE, thLec: [15, 19, 15, 5, 18], labLec: [3, 5, 5, 5] },
    { uid: '2024300080', name: 'Hivrale Tanmay Bhikan', division: 'B', gender: Gender.MALE, thLec: [7, 7, 9, 3, 10], labLec: [1, 2, 5, 3] },
    { uid: '2024300081', name: 'Shashank Sunil Ingale', division: 'B', gender: Gender.MALE, thLec: [0, 4, 0, 1, 9], labLec: [0, 1, 0, 0] },
    { uid: '2024300082', name: 'Irdande Arjun Kishor', division: 'B', gender: Gender.MALE, thLec: [18, 19, 17, 6, 16], labLec: [3, 5, 5, 5] },
    { uid: '2024300083', name: 'Madhav Ravi Israni', division: 'B', gender: Gender.MALE, thLec: [15, 20, 19, 7, 16], labLec: [3, 5, 5, 5] },
    { uid: '2024300084', name: 'Iyengar Adityavardhan Arvindkumar', division: 'B', gender: Gender.MALE, thLec: [19, 20, 17, 7, 18], labLec: [3, 5, 5, 5] },
    { uid: '2024300085', name: 'Iyer Reyansh Akilandeshwaran', division: 'B', gender: Gender.MALE, thLec: [18, 18, 18, 7, 15], labLec: [3, 5, 5, 5] },
    { uid: '2024300086', name: 'Rajwardhan Shankar Jadhav', division: 'B', gender: Gender.MALE, thLec: [10, 15, 13, 5, 12], labLec: [2, 2, 4, 2] },
    { uid: '2024300087', name: 'Jadhav Komal Harshad', division: 'B', gender: Gender.FEMALE, thLec: [18, 17, 18, 6, 17], labLec: [3, 5, 5, 5] },
    { uid: '2024300088', name: 'Pritam Suresh Jadhav', division: 'B', gender: Gender.MALE, thLec: [17, 17, 16, 6, 18], labLec: [3, 5, 5, 5] },
    { uid: '2024300089', name: 'Jadyal Sohan Sanjaykumar', division: 'B', gender: Gender.MALE, thLec: [16, 19, 16, 6, 18], labLec: [3, 5, 5, 5] },
    { uid: '2024300090', name: 'Kavya Jagani', division: 'B', gender: Gender.FEMALE, thLec: [18, 18, 18, 7, 17], labLec: [3, 5, 5, 5] },
    { uid: '2024300091', name: 'Jagushte Soham Prashant', division: 'B', gender: Gender.MALE, thLec: [19, 20, 18, 7, 18], labLec: [3, 5, 5, 5] },
    { uid: '2024300092', name: 'Jain Aayush Jeetendra', division: 'B', gender: Gender.MALE, thLec: [18, 17, 18, 7, 15], labLec: [3, 5, 5, 5] },
    { uid: '2024300093', name: 'Jain Tattva Bharat', division: 'B', gender: Gender.MALE, thLec: [18, 18, 19, 7, 17], labLec: [3, 5, 5, 5] },
    { uid: '2024300094', name: 'Tanish Chetan Jain', division: 'B', gender: Gender.MALE, thLec: [5, 6, 2, 1, 11], labLec: [1, 2, 3, 2] },
    { uid: '2024300095', name: 'Jethva Krish Rajesh', division: 'B', gender: Gender.MALE, thLec: [18, 19, 17, 6, 17], labLec: [3, 4, 5, 5] },
    { uid: '2024300096', name: 'Jethwa Vandan Ghanshyam', division: 'B', gender: Gender.MALE, thLec: [15, 18, 17, 6, 16], labLec: [5, 3, 5, 5] },
    { uid: '2024300097', name: 'Jogi Pranav Shankarrao', division: 'B', gender: Gender.MALE, thLec: [16, 19, 17, 7, 16], labLec: [5, 3, 5, 5] },
    { uid: '2024300098', name: 'Joshi Neerav Shripad', division: 'B', gender: Gender.MALE, thLec: [17, 17, 19, 5, 17], labLec: [5, 3, 4, 5] },
    { uid: '2024300099', name: 'Rewan Uddhav Kadam', division: 'B', gender: Gender.MALE, thLec: [18, 19, 14, 5, 16], labLec: [4, 2, 5, 5] },
    { uid: '2024300100', name: 'Kadhane Abhimanyu Nitin', division: 'B', gender: Gender.MALE, thLec: [18, 18, 19, 7, 16], labLec: [5, 3, 5, 5] },
    { uid: '2024300101', name: 'Kadu Shrutika Ashokrao', division: 'B', gender: Gender.FEMALE, thLec: [18, 18, 19, 7, 19], labLec: [5, 3, 5, 4] },
    { uid: '2024300102', name: 'Kale Raj Girish', division: 'B', gender: Gender.MALE, thLec: [18, 16, 18, 7, 16], labLec: [5, 3, 5, 5] },
    { uid: '2024300103', name: 'Kamble Rohan Rajesh', division: 'B', gender: Gender.MALE, thLec: [14, 17, 15, 4, 18], labLec: [5, 3, 5, 5] },
    { uid: '2024300104', name: 'Kaner Atharv Babarao', division: 'B', gender: Gender.MALE, thLec: [16, 18, 15, 4, 18], labLec: [5, 3, 4, 5] },
    { uid: '2024300105', name: 'Karande Nishad Vinayak', division: 'B', gender: Gender.MALE, thLec: [13, 16, 15, 5, 17], labLec: [5, 3, 5, 5] },
    { uid: '2024300106', name: 'Karkal Kushal Navin', division: 'B', gender: Gender.MALE, thLec: [17, 16, 19, 7, 17], labLec: [5, 3, 5, 5] },
    { uid: '2024300107', name: 'Anish Kumar Karlupia', division: 'B', gender: Gender.MALE, thLec: [4, 12, 7, 5, 14], labLec: [1, 3, 3, 1] },
    { uid: '2024300108', name: 'Kasodariya Divy Jigneshbhai', division: 'B', gender: Gender.MALE, thLec: [15, 19, 16, 6, 16], labLec: [5, 3, 4, 4] },
    { uid: '2024300109', name: 'Kaul Dakkshesh Bharat', division: 'B', gender: Gender.MALE, thLec: [16, 18, 17, 6, 18], labLec: [5, 3, 4, 5] },
    { uid: '2024300110', name: 'Kedia Dheer Sanjay', division: 'B', gender: Gender.MALE, thLec: [11, 10, 12, 4, 14], labLec: [4, 2, 4, 3] },
    { uid: '2024300111', name: 'Khadse Tatvik Sanjay', division: 'B', gender: Gender.MALE, thLec: [18, 19, 19, 7, 18], labLec: [5, 3, 5, 5] },
    { uid: '2024300112', name: 'Khairnar Atharva Jitendra', division: 'B', gender: Gender.MALE, thLec: [19, 19, 17, 5, 17], labLec: [5, 2, 5, 4] },
    { uid: '2024300113', name: 'Khandwala Krish Viral', division: 'B', gender: Gender.MALE, thLec: [18, 18, 19, 7, 19], labLec: [5, 3, 5, 4] },
    { uid: '2024300114', name: 'Kharangate Vighnesh Bhaskar', division: 'B', gender: Gender.MALE, thLec: [12, 11, 9, 3, 13], labLec: [2, 0, 0, 4] },
    { uid: '2024300115', name: 'Khemka Aabhash Meneesh', division: 'B', gender: Gender.MALE, thLec: [18, 19, 16, 7, 16], labLec: [5, 4, 2, 5] },
    { uid: '2024300116', name: 'Khetwani Arav Amit', division: 'B', gender: Gender.MALE, thLec: [19, 20, 19, 7, 19], labLec: [5, 5, 3, 5] },
    { uid: '2024300117', name: 'Kochade Tanushree Yogiraj', division: 'B', gender: Gender.FEMALE, thLec: [14, 13, 12, 4, 15], labLec: [3, 4, 2, 3] },
    { uid: '2024300118', name: 'Kolpe Devank Swamiprasad', division: 'B', gender: Gender.MALE, thLec: [13, 13, 15, 6, 15], labLec: [5, 5, 3, 5] },
    { uid: '2024300119', name: 'Kshirsagar Shravani Satish', division: 'B', gender: Gender.FEMALE, thLec: [19, 20, 16, 7, 17], labLec: [5, 4, 3, 5] },
    { uid: '2024300120', name: 'Kulkarni Atharva Arvind', division: 'B', gender: Gender.MALE, thLec: [14, 16, 13, 6, 16], labLec: [3, 4, 1, 5] },
    { uid: '2024300121', name: 'Kulkarni Aaryan Yogesh', division: 'B', gender: Gender.MALE, thLec: [19, 18, 19, 7, 18], labLec: [5, 5, 3, 5] },
    { uid: '2024300122', name: 'Kurade Parth Anil', division: 'B', gender: Gender.MALE, thLec: [13, 12, 15, 3, 18], labLec: [3, 4, 2, 4] },
    { uid: '2024300123', name: 'Pavan Devanand Landge', division: 'B', gender: Gender.MALE, thLec: [4, 3, 4, 0, 0], labLec: [2, 0, 0, 0] },
    { uid: '2024300124', name: 'Lathiya Vansh Pravinbhai', division: 'B', gender: Gender.MALE, thLec: [11, 16, 10, 5, 15], labLec: [3, 3, 2, 4] },
    { uid: '2024300125', name: 'Limbani Bhavya Subhash', division: 'B', gender: Gender.MALE, thLec: [18, 17, 14, 5, 16], labLec: [4, 4, 3, 5] },
    { uid: '2024300126', name: 'Madane Shubham Sanjay', division: 'B', gender: Gender.MALE, thLec: [15, 16, 15, 2, 15], labLec: [3, 3, 3, 4] },
    { uid: '2024300127', name: 'Mahabdi Harsh Ganesh', division: 'B', gender: Gender.MALE, thLec: [4, 0, 1, 1, 11], labLec: [2, 0, 0, 2] },
    { uid: '2024300128', name: 'Mahadik Nidhi Ramesh', division: 'B', gender: Gender.FEMALE, thLec: [19, 18, 15, 6, 16], labLec: [5, 5, 3, 5] },
    { uid: '2024300129', name: 'Malekar Aditya Mahesh', division: 'B', gender: Gender.MALE, thLec: [19, 16, 18, 7, 19], labLec: [5, 5, 3, 4] },
    { uid: '2024300130', name: 'Malode Omkar Shivaji', division: 'B', gender: Gender.MALE, thLec: [14, 13, 11, 4, 12], labLec: [5, 4, 2, 4] },
    { uid: '2024300131', name: 'Malpekar Divij Sumit', division: 'B', gender: Gender.MALE, thLec: [17, 18, 19, 7, 18], labLec: [5, 5, 3, 4] },
    { uid: '2024300132', name: 'Diksha Raju Mane', division: 'B', gender: Gender.FEMALE, thLec: [15, 16, 18, 4, 15], labLec: [5, 5, 3, 3] },
    { uid: '2024300133', name: 'Mehta Harshil Rajesh', division: 'B', gender: Gender.MALE, thLec: [19, 20, 18, 7, 18], labLec: [5, 5, 3, 5] },
    { uid: '2024300134', name: 'Mehta Siddharth Sanket', division: 'B', gender: Gender.MALE, thLec: [14, 12, 13, 5, 14], labLec: [5, 4, 4, 3] },
    { uid: '2024300135', name: 'Mehta Dharmil Jignesh', division: 'B', gender: Gender.MALE, thLec: [14, 15, 17, 7, 15], labLec: [5, 4, 5, 2] },
    { uid: '2024300136', name: 'Mehta Devanshi Ketan', division: 'B', gender: Gender.FEMALE, thLec: [18, 20, 19, 7, 18], labLec: [5, 5, 5, 3] },
    { uid: '2024300137', name: 'Mehta Aditya Chirag', division: 'B', gender: Gender.MALE, thLec: [13, 13, 14, 6, 12], labLec: [5, 4, 4, 3] },
    { uid: '2024300138', name: 'Mehta Vedant', division: 'B', gender: Gender.MALE, thLec: [18, 16, 19, 7, 18], labLec: [5, 3, 5, 2] },
    { uid: '2024300139', name: 'Meshram Aryan Chandrapal', division: 'B', gender: Gender.MALE, thLec: [19, 18, 19, 6, 17], labLec: [5, 5, 5, 3] },
    { uid: '2024300140', name: 'More Rishika Bhalchandra', division: 'B', gender: Gender.FEMALE, thLec: [18, 16, 19, 6, 17], labLec: [5, 4, 4, 3] },
    { uid: '2024300141', name: 'Mulani Shivam Dilip', division: 'B', gender: Gender.MALE, thLec: [18, 19, 18, 7, 17], labLec: [5, 4, 5, 3] },
    { uid: '2024300142', name: 'Mulewar Sanved Santosh', division: 'B', gender: Gender.MALE, thLec: [2, 3, 0, 4, 10], labLec: [0, 0, 0, 1] },
    { uid: '2024300143', name: 'Mundhe Srushti Shantaram', division: 'B', gender: Gender.FEMALE, thLec: [18, 16, 18, 6, 18], labLec: [5, 4, 5, 3] },
    { uid: '2024300144', name: 'Murhade Viveksing Sangramsing', division: 'B', gender: Gender.MALE, thLec: [14, 16, 17, 7, 16], labLec: [5, 5, 5, 3] },
    { uid: '2024300145', name: 'Laksh Yogesh Nagrare', division: 'B', gender: Gender.MALE, thLec: [17, 17, 14, 7, 17], labLec: [5, 5, 5, 3] },
    { uid: '2024300146', name: 'Nandrajog Gurshaan Gurmit', division: 'B', gender: Gender.MALE, thLec: [16, 16, 15, 7, 15], labLec: [5, 3, 5, 3] },
    { uid: '2024300147', name: 'Navarkar Samidha Kishor', division: 'B', gender: Gender.FEMALE, thLec: [17, 17, 18, 6, 18], labLec: [5, 5, 5, 3] },
    { uid: '2024300148', name: 'Nayak Keertan Dhananjay', division: 'B', gender: Gender.MALE, thLec: [19, 17, 18, 7, 16], labLec: [5, 5, 5, 3] },
    { uid: '2024300149', name: 'Nerurkar Anup Ashay', division: 'B', gender: Gender.MALE, thLec: [16, 14, 17, 7, 17], labLec: [5, 5, 5, 3] },
    { uid: '2024300150', name: 'Nimbalkar Malhar Umesh', division: 'B', gender: Gender.MALE, thLec: [18, 18, 18, 7, 17], labLec: [5, 5, 5, 3] },
    { uid: '2024300151', name: 'Orke Piyush Sanjay', division: 'B', gender: Gender.MALE, thLec: [16, 17, 15, 6, 17], labLec: [5, 4, 4, 3] },
    { uid: '2024300152', name: 'Panchal Prithvi Vikram', division: 'B', gender: Gender.MALE, thLec: [19, 18, 19, 7, 16], labLec: [5, 5, 5, 3] },
  ];

  const divCStudents: StudentRow[] = [
    { uid: '2024300154', name: 'Pandya Jay Vijay', division: 'C', gender: Gender.MALE, thLec: [16, 16, 11, 7, 15], labLec: [5, 4, 4, 5] },
    { uid: '2024300155', name: 'Panhalkar Advait Jitendra', division: 'C', gender: Gender.MALE, thLec: [15, 19, 10, 6, 15], labLec: [5, 4, 5, 5] },
    { uid: '2024300156', name: 'Parab Yash Rajendra', division: 'C', gender: Gender.MALE, thLec: [18, 20, 13, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300157', name: 'Parakh Tanish Gautamchand', division: 'C', gender: Gender.MALE, thLec: [14, 16, 10, 3, 14], labLec: [4, 4, 4, 5] },
    { uid: '2024300158', name: 'Paranjpe Sahil Harshendu', division: 'C', gender: Gender.MALE, thLec: [16, 17, 13, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300159', name: 'Parekh Yash Paresh', division: 'C', gender: Gender.MALE, thLec: [15, 17, 11, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300160', name: 'Parmar Rishil Vikram', division: 'C', gender: Gender.MALE, thLec: [18, 21, 13, 7, 20], labLec: [5, 5, 5, 4] },
    { uid: '2024300161', name: 'Patadia Rushil Devang', division: 'C', gender: Gender.MALE, thLec: [15, 17, 11, 7, 17], labLec: [5, 5, 5, 5] },
    { uid: '2024300162', name: 'Patel Yash Haresh', division: 'C', gender: Gender.MALE, thLec: [12, 13, 11, 7, 14], labLec: [4, 3, 3, 4] },
    { uid: '2024300163', name: 'Patel Rudra Shailesh', division: 'C', gender: Gender.MALE, thLec: [19, 18, 12, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300164', name: 'Patel Vidhi Bipin', division: 'C', gender: Gender.FEMALE, thLec: [15, 19, 12, 3, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300165', name: 'Patil Atharv Hambirrao', division: 'C', gender: Gender.MALE, thLec: [17, 18, 11, 3, 16], labLec: [5, 5, 5, 5] },
    { uid: '2024300166', name: 'Patil Gitesh Nitin', division: 'C', gender: Gender.MALE, thLec: [10, 14, 10, 5, 9], labLec: [5, 3, 5, 5] },
    { uid: '2024300167', name: 'Patil Priya Tukaram', division: 'C', gender: Gender.FEMALE, thLec: [11, 15, 12, 6, 16], labLec: [5, 4, 5, 4] },
    { uid: '2024300168', name: 'Patil Ashmit Uttam', division: 'C', gender: Gender.MALE, thLec: [17, 17, 11, 7, 18], labLec: [4, 5, 5, 4] },
    { uid: '2024300169', name: 'Patil Aryan Anand', division: 'C', gender: Gender.MALE, thLec: [16, 21, 13, 7, 18], labLec: [5, 4, 4, 5] },
    { uid: '2024300170', name: 'Patil Vedant Dinkar', division: 'C', gender: Gender.MALE, thLec: [17, 21, 13, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300171', name: 'Patil Kunal Chandrakant', division: 'C', gender: Gender.MALE, thLec: [15, 20, 12, 6, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300172', name: 'Patil Anay Dipak', division: 'C', gender: Gender.MALE, thLec: [13, 17, 12, 3, 16], labLec: [4, 5, 5, 5] },
    { uid: '2025301016', name: 'Kshirsagar Swanandi Shilesh', division: 'C', gender: Gender.FEMALE, thLec: [16, 17, 12, 6, 0], labLec: [4, 4, 5, 5] },
    { uid: '2024300173', name: 'Patil Akshat Sanjay', division: 'C', gender: Gender.MALE, thLec: [18, 18, 11, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300174', name: 'Pawar Aniket Manoj', division: 'C', gender: Gender.MALE, thLec: [12, 13, 10, 7, 15], labLec: [5, 5, 5, 4] },
    { uid: '2024300175', name: 'Pawar Ashwita Vinay', division: 'C', gender: Gender.FEMALE, thLec: [14, 16, 12, 6, 19], labLec: [5, 3, 5, 5] },
    { uid: '2024300176', name: 'Paygude Avani Nilesh', division: 'C', gender: Gender.FEMALE, thLec: [18, 19, 14, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300177', name: 'Pednekar Vaibhavi Laxman', division: 'C', gender: Gender.FEMALE, thLec: [18, 18, 12, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300178', name: 'Pillalamarri Thrish Nitin', division: 'C', gender: Gender.MALE, thLec: [18, 21, 13, 7, 21], labLec: [5, 5, 5, 5] },
    { uid: '2024300179', name: 'Pingle Parth Dattatray', division: 'C', gender: Gender.MALE, thLec: [16, 17, 12, 7, 17], labLec: [5, 5, 4, 5] },
    { uid: '2024300180', name: 'Pisal Soham Prashant', division: 'C', gender: Gender.MALE, thLec: [13, 18, 12, 7, 18], labLec: [5, 5, 4, 5] },
    { uid: '2024300181', name: 'Poddar Shivam Shailendra', division: 'C', gender: Gender.MALE, thLec: [18, 19, 12, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300182', name: 'Porwal Pratham Ajay', division: 'C', gender: Gender.MALE, thLec: [18, 21, 13, 7, 21], labLec: [5, 5, 5, 5] },
    { uid: '2024300183', name: 'Prabhudesai Riddhi Prakash', division: 'C', gender: Gender.FEMALE, thLec: [17, 18, 11, 6, 17], labLec: [5, 5, 5, 5] },
    { uid: '2024300184', name: 'Pradhan Jay Nandan', division: 'C', gender: Gender.MALE, thLec: [17, 18, 11, 6, 19], labLec: [4, 4, 5, 5] },
    { uid: '2024300185', name: 'Pradhan Sanyogeeta Swapneel', division: 'C', gender: Gender.FEMALE, thLec: [17, 20, 12, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300186', name: 'Prajapati Soham Bhavesh', division: 'C', gender: Gender.MALE, thLec: [17, 16, 10, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300187', name: 'Prasad Rohit Kishun', division: 'C', gender: Gender.MALE, thLec: [19, 17, 12, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300188', name: 'Raina Keshav', division: 'C', gender: Gender.MALE, thLec: [8, 12, 8, 6, 9], labLec: [2, 3, 1, 4] },
    { uid: '2024300189', name: 'Rajgor Param Vikram', division: 'C', gender: Gender.MALE, thLec: [17, 17, 12, 6, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300190', name: 'Rambhia Diyaan Mukesh', division: 'C', gender: Gender.MALE, thLec: [15, 17, 10, 6, 17], labLec: [2, 4, 5, 5] },
    { uid: '2024300191', name: 'Rane Rushi Santosh', division: 'C', gender: Gender.MALE, thLec: [17, 21, 13, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2025301022', name: 'Rathod Nidhi Ramesh', division: 'C', gender: Gender.FEMALE, thLec: [14, 15, 10, 6, 0], labLec: [3, 3, 4, 3] },
    { uid: '2024300192', name: 'Rathi Sakshi Damodar', division: 'C', gender: Gender.FEMALE, thLec: [19, 17, 10, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300193', name: 'Rathod Pushpendra Singh', division: 'C', gender: Gender.MALE, thLec: [18, 21, 13, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300194', name: 'Viraj Naresh Rathod', division: 'C', gender: Gender.MALE, thLec: [17, 19, 12, 7, 18], labLec: [5, 5, 5, 4] },
    { uid: '2024300195', name: 'Raval Om Hitendra', division: 'C', gender: Gender.MALE, thLec: [16, 17, 13, 7, 17], labLec: [5, 5, 5, 4] },
    { uid: '2024300196', name: 'Redekar Anoushka Vijay', division: 'C', gender: Gender.FEMALE, thLec: [16, 18, 12, 7, 19], labLec: [4, 5, 5, 4] },
    { uid: '2024300197', name: 'Rodrigues Orion Alwyn', division: 'C', gender: Gender.MALE, thLec: [16, 20, 13, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300198', name: 'Sacher Dhiren Kailash', division: 'C', gender: Gender.MALE, thLec: [16, 20, 12, 7, 16], labLec: [5, 5, 5, 5] },
    { uid: '2024300199', name: 'Sahu Ayush Sunil', division: 'C', gender: Gender.MALE, thLec: [16, 19, 11, 7, 16], labLec: [5, 5, 5, 5] },
    { uid: '2024300200', name: 'Sakariya Siddh Deepak', division: 'C', gender: Gender.MALE, thLec: [15, 15, 10, 7, 16], labLec: [5, 5, 5, 5] },
    { uid: '2024300201', name: 'Salot Het Jignesh', division: 'C', gender: Gender.MALE, thLec: [15, 17, 13, 7, 16], labLec: [5, 5, 5, 4] },
    { uid: '2024300202', name: 'Sangani Bhavya Ketan', division: 'C', gender: Gender.FEMALE, thLec: [17, 17, 12, 7, 16], labLec: [5, 5, 5, 5] },
    { uid: '2024300203', name: 'Sarda Jay Rajesh', division: 'C', gender: Gender.MALE, thLec: [16, 21, 13, 7, 19], labLec: [4, 4, 5, 4] },
    { uid: '2024300204', name: 'Sathe Arsh Nitin', division: 'C', gender: Gender.MALE, thLec: [8, 13, 9, 6, 9], labLec: [2, 3, 5, 3] },
    { uid: '2024300205', name: 'Satone Gaurang Pankaj', division: 'C', gender: Gender.MALE, thLec: [17, 20, 11, 6, 16], labLec: [5, 5, 5, 5] },
    { uid: '2024300206', name: 'Savaratkar Adesh Dattatray', division: 'C', gender: Gender.MALE, thLec: [19, 19, 13, 7, 18], labLec: [5, 4, 5, 5] },
    { uid: '2024300207', name: 'Save Bhargavee Rahul', division: 'C', gender: Gender.FEMALE, thLec: [16, 16, 11, 6, 18], labLec: [5, 5, 5, 4] },
    { uid: '2024300208', name: 'Sawant Saee Amol', division: 'C', gender: Gender.FEMALE, thLec: [19, 21, 13, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300209', name: 'Sawant Pranav Ravindra', division: 'C', gender: Gender.MALE, thLec: [16, 18, 10, 6, 17], labLec: [5, 5, 5, 5] },
    { uid: '2024300210', name: 'Anushree Sameer Sawant', division: 'C', gender: Gender.FEMALE, thLec: [16, 19, 13, 7, 19], labLec: [5, 5, 5, 4] },
    { uid: '2025301010', name: 'Hekare Pratiksha Bapu', division: 'C', gender: Gender.FEMALE, thLec: [17, 18, 12, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2024300211', name: 'Bhumit Praveen Sethi', division: 'C', gender: Gender.MALE, thLec: [16, 17, 9, 4, 13], labLec: [4, 3, 5, 5] },
    { uid: '2024300212', name: 'Shah Vidhaan Nilesh', division: 'C', gender: Gender.MALE, thLec: [18, 20, 13, 7, 20], labLec: [4, 5, 5, 5] },
    { uid: '2024300213', name: 'Aryan Nirav Shah', division: 'C', gender: Gender.MALE, thLec: [16, 18, 12, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300214', name: 'Shah Rudraksh Jitesh', division: 'C', gender: Gender.MALE, thLec: [17, 17, 12, 7, 20], labLec: [5, 5, 4, 5] },
    { uid: '2024300215', name: 'Shah Darsh Naresh', division: 'C', gender: Gender.MALE, thLec: [10, 12, 8, 2, 9], labLec: [4, 2, 4, 2] },
    { uid: '2024300216', name: 'Shah Riya Malay', division: 'C', gender: Gender.FEMALE, thLec: [18, 20, 13, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300217', name: 'Shah Jalak Milan', division: 'C', gender: Gender.MALE, thLec: [17, 17, 10, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300218', name: 'Shah Vansh Viral', division: 'C', gender: Gender.MALE, thLec: [19, 18, 12, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300219', name: 'Shah Ruhi Kunal', division: 'C', gender: Gender.FEMALE, thLec: [18, 19, 13, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300220', name: 'Shah Smit Pritam', division: 'C', gender: Gender.MALE, thLec: [18, 19, 13, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300221', name: 'Shah Dev Jigar', division: 'C', gender: Gender.MALE, thLec: [15, 18, 12, 3, 10], labLec: [5, 5, 5, 5] },
    { uid: '2024300222', name: 'Shah Jinay Manish', division: 'C', gender: Gender.MALE, thLec: [14, 14, 10, 4, 14], labLec: [5, 5, 5, 5] },
    { uid: '2024300223', name: 'Shah Aryan Rajendra', division: 'C', gender: Gender.MALE, thLec: [15, 17, 11, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300224', name: 'Shah Dhruvin Firoz', division: 'C', gender: Gender.MALE, thLec: [17, 19, 12, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300225', name: 'Shah Harshul Nikunj', division: 'C', gender: Gender.MALE, thLec: [14, 15, 10, 5, 17], labLec: [5, 5, 4, 5] },
    { uid: '2024300226', name: 'Shah Meet Nikhil', division: 'C', gender: Gender.MALE, thLec: [17, 19, 12, 7, 21], labLec: [5, 5, 5, 5] },
    { uid: '2024300227', name: 'Shah Shlok Jesal', division: 'C', gender: Gender.MALE, thLec: [19, 19, 13, 7, 21], labLec: [5, 5, 5, 5] },
    { uid: '2024300228', name: 'Shah Rishi Chintan', division: 'C', gender: Gender.MALE, thLec: [16, 17, 10, 6, 16], labLec: [5, 4, 4, 4] },
    { uid: '2024300229', name: 'Shah Rahil Devang', division: 'C', gender: Gender.MALE, thLec: [16, 15, 10, 6, 20], labLec: [5, 5, 4, 5] },
    { uid: '2025301025', name: 'Sanghvi Dhyani Paratik', division: 'C', gender: Gender.MALE, thLec: [17, 18, 12, 7, 0], labLec: [5, 5, 5, 5] },
  ];

  const divDStudents: StudentRow[] = [
    { uid: '2024300230', name: 'Shah Miti Niraj', division: 'D', gender: Gender.FEMALE, thLec: [17, 20, 13, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300231', name: 'Shah Twissha Jignesh', division: 'D', gender: Gender.FEMALE, thLec: [17, 21, 13, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300233', name: 'Shaikh Rayyan Zaid Mushraf', division: 'D', gender: Gender.MALE, thLec: [18, 19, 11, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300234', name: 'Sharma Akshit Bharat', division: 'D', gender: Gender.MALE, thLec: [17, 18, 12, 6, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300235', name: 'Sharma Darsh Nityanand', division: 'D', gender: Gender.MALE, thLec: [18, 19, 10, 7, 19], labLec: [5, 4, 5, 5] },
    { uid: '2024300236', name: 'Shaw Krish Sanjay', division: 'D', gender: Gender.MALE, thLec: [18, 20, 13, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300237', name: 'Shelke Tanishka Ratnakar', division: 'D', gender: Gender.FEMALE, thLec: [18, 19, 13, 6, 19], labLec: [5, 4, 5, 5] },
    { uid: '2024300238', name: 'Sheth Esha Ankush', division: 'D', gender: Gender.FEMALE, thLec: [19, 21, 12, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300239', name: 'Sheth Tanvi Ankit', division: 'D', gender: Gender.FEMALE, thLec: [18, 19, 13, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300240', name: 'Shinde Kunal Santosh', division: 'D', gender: Gender.MALE, thLec: [12, 16, 11, 6, 13], labLec: [4, 4, 4, 4] },
    { uid: '2024300241', name: 'Harsh Abhijeet Shinde', division: 'D', gender: Gender.MALE, thLec: [16, 18, 10, 6, 17], labLec: [5, 5, 5, 4] },
    { uid: '2024300242', name: 'Shitkar Dipesh Laxman', division: 'D', gender: Gender.MALE, thLec: [16, 19, 11, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300243', name: 'Singh Ujjwal Pramod', division: 'D', gender: Gender.MALE, thLec: [14, 19, 11, 7, 17], labLec: [5, 5, 5, 5] },
    { uid: '2024300244', name: 'Singh Brishchket', division: 'D', gender: Gender.MALE, thLec: [16, 21, 12, 7, 18], labLec: [5, 4, 5, 5] },
    { uid: '2024300245', name: 'Sirsikar Amogh Manish', division: 'D', gender: Gender.MALE, thLec: [18, 21, 13, 7, 20], labLec: [5, 5, 5, 5] },
    { uid: '2024300246', name: 'Solunke Pranav Bhagwansing', division: 'D', gender: Gender.MALE, thLec: [17, 18, 12, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300247', name: 'Sejal Soni', division: 'D', gender: Gender.FEMALE, thLec: [16, 20, 12, 7, 16], labLec: [5, 5, 5, 5] },
    { uid: '2024300248', name: 'Sownane Kuldeep Subhash', division: 'D', gender: Gender.MALE, thLec: [16, 19, 11, 5, 17], labLec: [4, 4, 4, 3] },
    { uid: '2024300249', name: 'Srivastava Shubh', division: 'D', gender: Gender.MALE, thLec: [15, 18, 11, 7, 17], labLec: [4, 5, 4, 5] },
    { uid: '2025301006', name: 'Dhangar Gangesh Sanjay', division: 'D', gender: Gender.MALE, thLec: [19, 21, 13, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2024300250', name: 'Sundrani Devraj Ravi', division: 'D', gender: Gender.MALE, thLec: [15, 17, 11, 6, 19], labLec: [4, 5, 5, 5] },
    { uid: '2024300251', name: 'Surana Lavya Pravin', division: 'D', gender: Gender.MALE, thLec: [13, 16, 13, 6, 13], labLec: [4, 5, 5, 3] },
    { uid: '2024300252', name: 'Surve Aryan Arun', division: 'D', gender: Gender.MALE, thLec: [14, 15, 13, 7, 15], labLec: [4, 4, 5, 5] },
    { uid: '2024300253', name: 'Suvarna Aneesh Naveenkumar', division: 'D', gender: Gender.MALE, thLec: [16, 21, 12, 7, 19], labLec: [4, 5, 5, 5] },
    { uid: '2024300254', name: 'Talpade Akshay Pradip', division: 'D', gender: Gender.MALE, thLec: [16, 21, 13, 7, 18], labLec: [4, 5, 5, 5] },
    { uid: '2024300255', name: 'Videsh Sanjay Tambe', division: 'D', gender: Gender.MALE, thLec: [18, 21, 13, 7, 19], labLec: [4, 5, 5, 5] },
    { uid: '2024300256', name: 'Tandel Mayur Sandip', division: 'D', gender: Gender.MALE, thLec: [18, 18, 12, 7, 18], labLec: [4, 5, 4, 5] },
    { uid: '2024300257', name: 'Tapase Swayam Sanjay', division: 'D', gender: Gender.MALE, thLec: [17, 20, 12, 6, 18], labLec: [4, 5, 5, 4] },
    { uid: '2024300258', name: 'Tarde Mayuri Kiran', division: 'D', gender: Gender.FEMALE, thLec: [18, 20, 11, 6, 19], labLec: [4, 5, 5, 5] },
    { uid: '2024300259', name: 'Tarmale Bhumika Anil', division: 'D', gender: Gender.FEMALE, thLec: [17, 20, 12, 7, 18], labLec: [4, 5, 5, 5] },
    { uid: '2024300260', name: 'Jaynish Jayraj Thakar', division: 'D', gender: Gender.MALE, thLec: [16, 19, 10, 4, 17], labLec: [4, 5, 5, 5] },
    { uid: '2024300261', name: 'Thakkar Deven Vipul', division: 'D', gender: Gender.MALE, thLec: [17, 19, 13, 7, 18], labLec: [4, 5, 5, 5] },
    { uid: '2024300262', name: 'Thakkar Param Nikhil', division: 'D', gender: Gender.MALE, thLec: [13, 15, 10, 6, 20], labLec: [4, 5, 5, 5] },
    { uid: '2024300263', name: 'Upadhyay Nityanand Rajesh', division: 'D', gender: Gender.MALE, thLec: [11, 15, 12, 5, 14], labLec: [4, 4, 4, 4] },
    { uid: '2024300264', name: 'Vadhani Shrey Anish', division: 'D', gender: Gender.MALE, thLec: [16, 18, 11, 6, 16], labLec: [4, 5, 5, 5] },
    { uid: '2024300265', name: 'Vageriya Maisha Mitesh', division: 'D', gender: Gender.FEMALE, thLec: [13, 16, 11, 6, 14], labLec: [4, 4, 5, 4] },
    { uid: '2024300266', name: 'Valvi Sahil Azad', division: 'D', gender: Gender.MALE, thLec: [17, 20, 12, 7, 18], labLec: [4, 5, 5, 5] },
    { uid: '2024300267', name: 'Vedant Atharv Nilesh', division: 'D', gender: Gender.MALE, thLec: [15, 17, 12, 6, 18], labLec: [4, 4, 4, 5] },
    { uid: '2024300268', name: 'Vishwakarma Tanmay', division: 'D', gender: Gender.MALE, thLec: [16, 18, 12, 7, 19], labLec: [4, 5, 5, 5] },
    { uid: '2025301024', name: 'Raut Saish Sanjaykumar', division: 'D', gender: Gender.MALE, thLec: [15, 18, 12, 6, 0], labLec: [4, 5, 5, 5] },
    { uid: '2024300269', name: 'Vishwakarma Harsh Ashok', division: 'D', gender: Gender.MALE, thLec: [15, 15, 12, 7, 16], labLec: [4, 5, 5, 4] },
    { uid: '2024300270', name: 'Vora Pranay Nirav', division: 'D', gender: Gender.MALE, thLec: [15, 16, 13, 6, 16], labLec: [5, 5, 5, 4] },
    { uid: '2024300271', name: 'Vyawahare Harsh Viraj', division: 'D', gender: Gender.MALE, thLec: [18, 21, 11, 7, 17], labLec: [5, 5, 5, 5] },
    { uid: '2024300272', name: 'Waghela Harshvardhan Bipin', division: 'D', gender: Gender.MALE, thLec: [19, 21, 11, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300273', name: 'Waghmare Sanket Dilip', division: 'D', gender: Gender.MALE, thLec: [15, 20, 12, 7, 16], labLec: [5, 4, 5, 4] },
    { uid: '2024300274', name: 'Zala Parth Mukesh', division: 'D', gender: Gender.MALE, thLec: [14, 13, 11, 6, 15], labLec: [5, 5, 5, 5] },
    { uid: '2024300275', name: 'K V S Varshith', division: 'D', gender: Gender.MALE, thLec: [18, 20, 13, 7, 19], labLec: [5, 5, 5, 5] },
    { uid: '2024300276', name: 'Simrit Kaur Chhatwal', division: 'D', gender: Gender.FEMALE, thLec: [16, 20, 13, 7, 18], labLec: [5, 5, 5, 5] },
    { uid: '2024300277', name: 'Vansh Bhimani', division: 'D', gender: Gender.MALE, thLec: [18, 21, 12, 7, 17], labLec: [5, 5, 5, 5] },
    { uid: '2023300063', name: 'Abhishek Gawade', division: 'D', gender: Gender.MALE, thLec: [17, 16, 10, 6, 15], labLec: [4, 4, 4, 4] },
    { uid: '2023300171', name: 'Tanishq Patil', division: 'D', gender: Gender.MALE, thLec: [15, 15, 11, 7, 13], labLec: [5, 5, 4, 4] },
    { uid: '2023300262', name: 'Anshul Warade', division: 'D', gender: Gender.MALE, thLec: [16, 18, 12, 7, 18], labLec: [5, 5, 4, 5] },
    { uid: '2025301011', name: 'Jagare Dhruv Vishwas', division: 'D', gender: Gender.MALE, thLec: [17, 18, 12, 6, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301017', name: 'Madage Ronit Santosh', division: 'D', gender: Gender.MALE, thLec: [14, 16, 10, 6, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301018', name: 'Marathe Shantanu Dinesh', division: 'D', gender: Gender.MALE, thLec: [17, 18, 12, 7, 0], labLec: [5, 5, 5, 4] },
    { uid: '2025301028', name: 'Shah Heli Rahul', division: 'D', gender: Gender.FEMALE, thLec: [17, 21, 12, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301029', name: 'Shah Siddharth Paresh', division: 'D', gender: Gender.MALE, thLec: [19, 21, 13, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301030', name: 'Shah Vidhi Chandresh', division: 'D', gender: Gender.FEMALE, thLec: [16, 19, 11, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301032', name: 'Shirodkar Falashree Harish', division: 'D', gender: Gender.FEMALE, thLec: [15, 20, 12, 7, 0], labLec: [5, 5, 5, 4] },
    { uid: '2025301033', name: 'Thakkar Parth Rakesh', division: 'D', gender: Gender.MALE, thLec: [15, 19, 11, 6, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301001', name: 'Ansari Ariba Tabrez Ahmed', division: 'D', gender: Gender.FEMALE, thLec: [15, 17, 11, 6, 0], labLec: [5, 4, 4, 5] },
    { uid: '2025301002', name: 'Bharambe Prarthana Sudhakar', division: 'D', gender: Gender.FEMALE, thLec: [17, 20, 13, 7, 0], labLec: [5, 5, 5, 4] },
    { uid: '2025301003', name: 'Chaphekar Aditi Amar', division: 'D', gender: Gender.FEMALE, thLec: [17, 19, 13, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301004', name: 'Dagale Vivek Ravindra', division: 'D', gender: Gender.MALE, thLec: [15, 17, 11, 6, 0], labLec: [5, 4, 5, 4] },
    { uid: '2025301005', name: 'Dalvi Ayushri Rohan', division: 'D', gender: Gender.FEMALE, thLec: [15, 16, 10, 7, 0], labLec: [4, 4, 4, 4] },
    { uid: '2025301007', name: 'Gadge Pranav Mahendra', division: 'D', gender: Gender.MALE, thLec: [15, 19, 12, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301008', name: 'Gaikwad Nitin Subhash', division: 'D', gender: Gender.MALE, thLec: [17, 19, 12, 6, 0], labLec: [5, 4, 5, 5] },
    { uid: '2025301009', name: 'Gupta Nirupam Sunilkumar', division: 'D', gender: Gender.MALE, thLec: [11, 16, 11, 4, 0], labLec: [3, 3, 4, 3] },
    { uid: '2025301012', name: 'Jain Jayeshkumar Subhashchand', division: 'D', gender: Gender.MALE, thLec: [12, 14, 8, 5, 0], labLec: [5, 3, 4, 3] },
    { uid: '2025301013', name: 'Kakade Avishkar Prakash', division: 'D', gender: Gender.MALE, thLec: [16, 20, 12, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301014', name: 'Shah Kankshi Maulik', division: 'D', gender: Gender.FEMALE, thLec: [14, 15, 9, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301015', name: 'Khadayate Mayank Prafulla', division: 'D', gender: Gender.MALE, thLec: [14, 15, 10, 6, 0], labLec: [3, 3, 4, 4] },
    { uid: '2025301019', name: 'Marti Raizel Milton', division: 'D', gender: Gender.MALE, thLec: [16, 20, 11, 6, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301020', name: 'Masarankar Aditya Sanjay', division: 'D', gender: Gender.MALE, thLec: [14, 16, 12, 5, 0], labLec: [5, 4, 4, 4] },
    { uid: '2025301021', name: 'More Manasvi Santosh', division: 'D', gender: Gender.FEMALE, thLec: [16, 17, 9, 7, 0], labLec: [4, 5, 5, 5] },
    { uid: '2025301023', name: 'Patil Jay Janardan', division: 'D', gender: Gender.MALE, thLec: [17, 20, 12, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301026', name: 'Sarvaiya Diya Rajesh', division: 'D', gender: Gender.FEMALE, thLec: [18, 21, 13, 6, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301027', name: 'Sawant Shrey Mohan', division: 'D', gender: Gender.MALE, thLec: [16, 20, 13, 6, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301031', name: 'Shelar Diksha Dilip', division: 'D', gender: Gender.FEMALE, thLec: [18, 21, 13, 7, 0], labLec: [5, 5, 5, 5] },
    { uid: '2025301034', name: 'Tikadiya Smith Nilesh', division: 'D', gender: Gender.MALE, thLec: [17, 21, 13, 6, 0], labLec: [5, 5, 5, 5] },
  ];

  // Create all students
  const allStudents = [...divAStudents, ...divBStudents, ...divCStudents, ...divDStudents];

  // Helper: split full name (last first) → { firstName, lastName }
  function parseName(fullName: string): { firstName: string; middleName?: string; lastName: string } {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
    if (parts.length === 2) return { firstName: parts[1], lastName: parts[0] };
    // 3+ parts: first token = last name, rest = first + middle
    const lastName = parts[0];
    const firstName = parts[1];
    const middleName = parts.slice(2).join(' ');
    return { firstName, middleName, lastName };
  }

  const studentMap: Record<string, string> = {}; // uid → prisma id

  for (const s of allStudents) {
    const { firstName, middleName, lastName } = parseName(s.name);
    const emailLocal = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${s.uid.slice(-4)}`;
    const user = await prisma.user.create({
      data: {
        identifier: s.uid,
        firstName,
        middleName,
        lastName,
        email: `${emailLocal}@spit.ac.in`,
        passwordHash,
        role: Role.STUDENT,
        gender: s.gender,
        dateOfBirth: new Date('2005-06-15'),
        departmentId: compDept.id,
        semester: 4,
        division: s.division,
      },
    });
    studentMap[s.uid] = user.id;
  }

  // ── 7. CLASS SESSIONS + ATTENDANCE ─────────
  // We simulate sessions from 27-Jan-2026 to 28-Feb-2026 (5 weeks).
  // For each theory subject per division, we create weekly sessions and
  // distribute attendance proportionally to the documented counts.

  // Map: subject index → subjectId
  const subjectIds = [osSubj.id, daaSubj.id, ccnSubj.id, pcsSubj.id, smcsSubj.id];

  // Total lectures delivered per division (theory):
  // Div A/B: OS=19, DAA=20, CCN=19, PCS=7, SMCS=19
  // Div C/D: OS=19, DAA=21, CCN=14, PCS=7, SMCS=21
  // We'll create 5 sessions per theory subject (~ weekly) and 5 lab sessions.

  const SESSION_DATES = [
    pastDate(35), pastDate(28), pastDate(21), pastDate(14), pastDate(7),
  ]; // 5 past Mondays

  // For each division, for each subject, pick a matching schedule
  const divSchedule: Record<string, Record<string, string | undefined>> = {};
  for (const div of ['A', 'B', 'C', 'D']) {
    divSchedule[div] = {};
    for (const subj of subjectIds) {
      const sid = getScheduleId(div, subj, DayOfWeek.MONDAY, ClassType.LECTURE)
        ?? getScheduleId(div, subj, DayOfWeek.TUESDAY, ClassType.LECTURE)
        ?? getScheduleId(div, subj, DayOfWeek.WEDNESDAY, ClassType.LECTURE)
        ?? getScheduleId(div, subj, DayOfWeek.THURSDAY, ClassType.LECTURE)
        ?? getScheduleId(div, subj, DayOfWeek.FRIDAY, ClassType.LECTURE);
      divSchedule[div][subj] = sid;
    }
  }

  // Create sessions for each (division, subject) pair
  // Then mark attendance per student based on their thLec[i] count
  const sessionsByDivSubj: Record<string, string[]> = {};

  for (const div of ['A', 'B', 'C', 'D']) {
    for (let si = 0; si < 5; si++) {
      const subjId = subjectIds[si];
      const schedId = divSchedule[div][subjId];
      if (!schedId) continue;

      const key = `${div}-${si}`;
      sessionsByDivSubj[key] = [];

      for (const date of SESSION_DATES) {
        const session = await prisma.classSession.create({
          data: { scheduleId: schedId, date, status: 'COMPLETED' },
        });
        sessionsByDivSubj[key].push(session.id);
      }
    }
  }

  // Mark attendance: for each student, for each subject, mark first N sessions
  // as PRESENT (N = thLec[si]) and remaining as ABSENT
  const TOTAL_SESSIONS = SESSION_DATES.length; // 5

  const divMap: Record<string, StudentRow[]> = {
    A: divAStudents, B: divBStudents, C: divCStudents, D: divDStudents,
  };

  for (const [div, students] of Object.entries(divMap)) {
    for (const student of students) {
      const studentId = studentMap[student.uid];
      if (!studentId) continue;

      for (let si = 0; si < 5; si++) {
        const key = `${div}-${si}`;
        const sessionIds = sessionsByDivSubj[key];
        if (!sessionIds) continue;

        // Scale: if thLec > TOTAL_SESSIONS cap at TOTAL_SESSIONS
        const attended = Math.min(student.thLec[si], TOTAL_SESSIONS);

        for (let i = 0; i < sessionIds.length; i++) {
          const status = i < attended ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT;
          await prisma.attendance.create({
            data: {
              sessionId: sessionIds[i],
              studentId,
              status,
              markedBy: facultyMap[si === 0 ? 'KKD' : si === 1 ? 'AVN' : si === 2 ? 'JS' : si === 3 ? 'DN' : 'AT'],
            },
          });
        }
      }
    }
  }

  // ── 8. LAB SESSIONS + ATTENDANCE ───────────
  // Labs: 5 sessions each for OS, DAA, CCN, PCS
  const LAB_DATES = [
    pastDate(34), pastDate(27), pastDate(20), pastDate(13), pastDate(6),
  ];

  const labSubjectIds = [osSubj.id, daaSubj.id, ccnSubj.id, pcsSubj.id];
  const labScheduleByDiv: Record<string, Record<string, string | undefined>> = {};
  for (const div of ['A', 'B', 'C', 'D']) {
    labScheduleByDiv[div] = {};
    for (const subjId of labSubjectIds) {
      const sid = getScheduleId(div, subjId, DayOfWeek.MONDAY, ClassType.LAB)
        ?? getScheduleId(div, subjId, DayOfWeek.TUESDAY, ClassType.LAB)
        ?? getScheduleId(div, subjId, DayOfWeek.WEDNESDAY, ClassType.LAB)
        ?? getScheduleId(div, subjId, DayOfWeek.THURSDAY, ClassType.LAB)
        ?? getScheduleId(div, subjId, DayOfWeek.FRIDAY, ClassType.LAB);
      labScheduleByDiv[div][subjId] = sid;
    }
  }

  const labSessionsByDivSubj: Record<string, string[]> = {};
  for (const div of ['A', 'B', 'C', 'D']) {
    for (let li = 0; li < 4; li++) {
      const subjId = labSubjectIds[li];
      const schedId = labScheduleByDiv[div][subjId];
      if (!schedId) continue;

      const key = `lab-${div}-${li}`;
      labSessionsByDivSubj[key] = [];
      for (const date of LAB_DATES) {
        const session = await prisma.classSession.create({
          data: { scheduleId: schedId, date, status: 'COMPLETED' },
        });
        labSessionsByDivSubj[key].push(session.id);
      }
    }
  }

  for (const [div, students] of Object.entries(divMap)) {
    for (const student of students) {
      const studentId = studentMap[student.uid];
      if (!studentId) continue;

      for (let li = 0; li < 4; li++) {
        const key = `lab-${div}-${li}`;
        const sessionIds = labSessionsByDivSubj[key];
        if (!sessionIds) continue;

        const attended = Math.min(student.labLec[li], LAB_DATES.length);

        for (let i = 0; i < sessionIds.length; i++) {
          const status = i < attended ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT;
          await prisma.attendance.create({
            data: {
              sessionId: sessionIds[i],
              studentId,
              status,
              markedBy: facultyMap['KKD'],
            },
          });
        }
      }
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('─────────────────────────────────────────');
  console.log('Test Faculty logins:');
  console.log('  FAC-KKD / Password123!  (Dr. Kailas Devadkar - OS)');
  console.log('  FAC-AVN / Password123!  (Dr. Anant Nimkar - DAA)');
  console.log('  FAC-SK  / Password123!  (Prof. Swapnali Kurhade - OS Div C/D)');
  console.log('Test Student logins (UID / Password123!):');
  console.log('  2024300001  Div A - Agarwal Ekaagra');
  console.log('  2024300077  Div B - Harel Shravani');
  console.log('  2024300154  Div C - Pandya Jay');
  console.log('  2024300230  Div D - Shah Miti');
  console.log('─────────────────────────────────────────');
  console.log(`Total students seeded: ${allStudents.length}`);
  console.log(`Total faculty seeded:  ${facultyData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });