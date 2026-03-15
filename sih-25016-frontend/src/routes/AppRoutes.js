import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelectionPage from '../pages/RoleSelectionPage';
import StudentLoginPage from '../pages/StudentLoginPage';
import FacultyLoginPage from '../pages/FacultyLoginPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import DashboardPage from '../pages/student/DashboardPage';
import AttendancePage from '../pages/student/AttendancePage';
import TimetablePage from '../pages/student/TimetablePage';
import ProfilePage from '../pages/student/ProfilePage';
import FacultyDashboard from '../pages/faculty/FacultyDashboard';
import MyClassesPage from '../pages/faculty/MyClassesPage';
import ReportsPage from '../pages/faculty/ReportsPage';
import LeaveManagementPage from '../pages/faculty/LeaveManagementPage';
import FacultyProfilePage from '../pages/faculty/FacultyProfilePage';
import FacultyMainLayout from '../components/faculty/FacultyMainLayout';
import LiveSessionPage from '../pages/faculty/LiveSessionPage';

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<RoleSelectionPage />} />
				<Route path="/login/student" element={<StudentLoginPage />} />
				<Route path="/login/faculty" element={<FacultyLoginPage />} />
				<Route path="/login/admin" element={<AdminLoginPage />} />

				{/* Student Portal Routes */}
				<Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
				<Route path="/student/dashboard" element={<DashboardPage />} />
				<Route path="/student/attendance" element={<AttendancePage />} />
				<Route path="/student/timetable" element={<TimetablePage />} />
				<Route path="/student/profile" element={<ProfilePage />} />

				{/* Faculty Portal Routes */}
				<Route element={<FacultyMainLayout />}>
					<Route path="/faculty" element={<Navigate to="/faculty/dashboard" replace />} />
					<Route path="/faculty/dashboard" element={<FacultyDashboard />} />
					<Route path="/faculty/classes" element={<MyClassesPage />} />
					<Route path="/faculty/reports" element={<ReportsPage />} />
					<Route path="/faculty/leave" element={<LeaveManagementPage />} />
					<Route path="/faculty/profile" element={<FacultyProfilePage />} />
					<Route path="/faculty/session/:classId" element={<LiveSessionPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
} 