"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var csDept, passwordHash, facultySharma, students, dsSubject, dbSubject, todayValue, time1Start, time1End, time2Start, time2End, dsSchedule, dbSchedule, lastWeek, pastSession, _i, students_1, student;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Clearing database...');
                    return [4 /*yield*/, prisma.attendance.deleteMany()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.classSession.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.leaveRequest.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.timetableSchedule.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.subject.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.department.deleteMany()];
                case 7:
                    _a.sent();
                    console.log('Seeding Database...');
                    return [4 /*yield*/, prisma.department.create({
                            data: {
                                name: 'Computer Science and Engineering',
                                code: 'CSE',
                            },
                        })];
                case 8:
                    csDept = _a.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash('Password123!', 10)];
                case 9:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                identifier: 'FAC001',
                                firstName: 'Rajesh',
                                lastName: 'Sharma',
                                email: 'rajesh.sharma@sih.edu',
                                passwordHash: passwordHash,
                                role: client_1.Role.FACULTY,
                                gender: client_1.Gender.MALE,
                                dateOfBirth: new Date('1980-05-15'),
                                departmentId: csDept.id,
                            },
                        })];
                case 10:
                    facultySharma = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.user.create({
                                data: {
                                    identifier: '24BCS101', firstName: 'Rohan', lastName: 'Kumar', email: 'rohan.k@sih.edu',
                                    passwordHash: passwordHash,
                                    role: client_1.Role.STUDENT, gender: client_1.Gender.MALE, dateOfBirth: new Date('2004-01-10'),
                                    departmentId: csDept.id, semester: 3, division: 'A'
                                }
                            }),
                            prisma.user.create({
                                data: {
                                    identifier: '24BCS102', firstName: 'Priya', lastName: 'Singh', email: 'priya.s@sih.edu',
                                    passwordHash: passwordHash,
                                    role: client_1.Role.STUDENT, gender: client_1.Gender.FEMALE, dateOfBirth: new Date('2004-03-22'),
                                    departmentId: csDept.id, semester: 3, division: 'A'
                                }
                            }),
                            prisma.user.create({
                                data: {
                                    identifier: '24BCS103', firstName: 'Amit', lastName: 'Verma', email: 'amit.v@sih.edu',
                                    passwordHash: passwordHash,
                                    role: client_1.Role.STUDENT, gender: client_1.Gender.MALE, dateOfBirth: new Date('2003-11-05'),
                                    departmentId: csDept.id, semester: 3, division: 'A'
                                }
                            }),
                            prisma.user.create({
                                data: {
                                    identifier: '24BCS104', firstName: 'Sneha', lastName: 'Patel', email: 'sneha.p@sih.edu',
                                    passwordHash: passwordHash,
                                    role: client_1.Role.STUDENT, gender: client_1.Gender.FEMALE, dateOfBirth: new Date('2004-08-14'),
                                    departmentId: csDept.id, semester: 3, division: 'A'
                                }
                            }),
                        ])];
                case 11:
                    students = _a.sent();
                    return [4 /*yield*/, prisma.subject.create({
                            data: {
                                name: 'Data Structures', code: 'CS301', credits: 4, departmentId: csDept.id, facultyId: facultySharma.id
                            }
                        })];
                case 12:
                    dsSubject = _a.sent();
                    return [4 /*yield*/, prisma.subject.create({
                            data: {
                                name: 'Database Systems', code: 'CS302', credits: 3, departmentId: csDept.id, facultyId: facultySharma.id
                            }
                        })];
                case 13:
                    dbSubject = _a.sent();
                    todayValue = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][new Date().getDay()];
                    time1Start = new Date();
                    time1Start.setHours(10, 0, 0, 0);
                    time1End = new Date();
                    time1End.setHours(11, 0, 0, 0);
                    time2Start = new Date();
                    time2Start.setHours(13, 0, 0, 0);
                    time2End = new Date();
                    time2End.setHours(14, 0, 0, 0);
                    return [4 /*yield*/, prisma.timetableSchedule.create({
                            data: {
                                subjectId: dsSubject.id, facultyId: facultySharma.id, departmentId: csDept.id,
                                semester: 3, division: 'A', dayOfWeek: todayValue, type: client_1.ClassType.LECTURE,
                                startTime: time1Start, endTime: time1End
                            }
                        })];
                case 14:
                    dsSchedule = _a.sent();
                    return [4 /*yield*/, prisma.timetableSchedule.create({
                            data: {
                                subjectId: dbSubject.id, facultyId: facultySharma.id, departmentId: csDept.id,
                                semester: 3, division: 'A', dayOfWeek: todayValue, type: client_1.ClassType.LAB,
                                startTime: time2Start, endTime: time2End
                            }
                        })];
                case 15:
                    dbSchedule = _a.sent();
                    lastWeek = new Date();
                    lastWeek.setDate(lastWeek.getDate() - 7);
                    return [4 /*yield*/, prisma.classSession.create({
                            data: { scheduleId: dsSchedule.id, date: lastWeek, status: 'COMPLETED' }
                        })];
                case 16:
                    pastSession = _a.sent();
                    _i = 0, students_1 = students;
                    _a.label = 17;
                case 17:
                    if (!(_i < students_1.length)) return [3 /*break*/, 20];
                    student = students_1[_i];
                    return [4 /*yield*/, prisma.attendance.create({
                            data: {
                                sessionId: pastSession.id,
                                studentId: student.id,
                                status: student.identifier === '24BCS103' ? client_1.AttendanceStatus.ABSENT : client_1.AttendanceStatus.PRESENT,
                                markedBy: facultySharma.id,
                            }
                        })];
                case 18:
                    _a.sent();
                    _a.label = 19;
                case 19:
                    _i++;
                    return [3 /*break*/, 17];
                case 20: 
                // 8. Create a pending Leave Request from Rohan
                return [4 /*yield*/, prisma.leaveRequest.create({
                        data: {
                            userId: students[0].id,
                            type: client_1.LeaveType.MEDICAL,
                            startDate: new Date(),
                            endDate: new Date(),
                            reason: 'Fever',
                            status: client_1.LeaveStatus.PENDING
                        }
                    })];
                case 21:
                    // 8. Create a pending Leave Request from Rohan
                    _a.sent();
                    console.log('Database seeded successfully!');
                    console.log("Test Faculty: FAC001 / Password123!");
                    console.log("Test Student: 24BCS101 / Password123!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
