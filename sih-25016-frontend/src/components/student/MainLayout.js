import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaThLarge, FaChartBar, FaCalendarAlt, FaUser, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeProvider';

// Reusable navigation items array for both Mobile Bottom Nav and Desktop Sidebar
const navItems = [
	{ path: '/student/dashboard', icon: FaThLarge, label: 'Dashboard' },
	{ path: '/student/attendance', icon: FaChartBar, label: 'Attendance' },
	{ path: '/student/timetable', icon: FaCalendarAlt, label: 'Timetable' },
	{ path: '/student/profile', icon: FaUser, label: 'Profile' },
];

const DesktopSidebar = () => {
	const location = useLocation();
	const isActive = (path) => location.pathname === path;

	const linkClass = (path) => 
		`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
			isActive(path) 
				? 'bg-platinum-100 dark:bg-onyx-800 text-onyx-900 dark:text-platinum-50 font-bold shadow-sm' 
				: 'text-onyx-600 dark:text-platinum-200 hover:bg-platinum-50 dark:hover:bg-onyx-800/50 hover:text-onyx-900 dark:hover:text-platinum-50 font-medium'
		}`;

	const iconClass = (path) => 
		`text-xl ${isActive(path) ? 'text-dark-teal-700 dark:text-stormy-teal-500' : 'text-onyx-400 dark:text-onyx-500'}`;

	return (
		<aside className="hidden md:flex flex-col fixed left-0 top-0 z-30 h-full w-72 bg-white dark:bg-onyx-900 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] border-r border-platinum-200 dark:border-onyx-800">
			{/* Logo Area */}
			<div className="h-20 flex items-center px-8 border-b border-platinum-200 dark:border-onyx-800">
				<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dark-teal-600 to-dark-teal-800 dark:from-stormy-teal-500 dark:to-stormy-teal-700 flex items-center justify-center mr-3 shadow-md">
					<span className="text-white font-bold text-lg leading-none">T</span>
				</div>
				<span className="text-2xl font-extrabold text-onyx-900 dark:text-platinum-50 tracking-tight">TrackEd</span>
			</div>
			
			{/* Navigation Links */}
			<nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
				{navItems.map((item) => (
					<Link key={item.path} to={item.path} className={linkClass(item.path)}>
						<item.icon className={iconClass(item.path)} />
						<span>{item.label}</span>
					</Link>
				))}
			</nav>

			{/* Logout Area */}
			<div className="p-4 border-t border-platinum-200 dark:border-onyx-800">
				<Link to="/" className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
					<FaSignOutAlt className="text-lg" />
					<span>Logout</span>
				</Link>
			</div>
		</aside>
	);
};

const MobileBottomNav = () => {
	const location = useLocation();
	const isActive = (path) => location.pathname === path;

	return (
		<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-onyx-900/90 backdrop-blur-lg border-t border-platinum-200 dark:border-onyx-800 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] pb-safe">
			<div className="flex items-center justify-around h-16 px-2">
				{navItems.map((item) => {
					const active = isActive(item.path);
					return (
						<Link 
							key={item.path} 
							to={item.path} 
							className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
						>
							{active && (
								<div className="absolute top-0 w-8 h-1 bg-dark-teal-600 dark:bg-stormy-teal-500 rounded-b-full shadow-[0_2px_8px_rgba(16,131,137,0.5)]"></div>
							)}
							<item.icon className={`text-xl transition-all duration-200 ${active ? 'text-dark-teal-700 dark:text-stormy-teal-400 mb-0.5' : 'text-onyx-400 dark:text-onyx-500'}`} />
							<span className={`text-[10px] sm:text-xs tracking-wide transition-all duration-200 ${active ? 'font-bold text-dark-teal-800 dark:text-stormy-teal-300' : 'font-medium text-onyx-500 dark:text-onyx-400'}`}>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};

const Header = ({ isDarkMode, onThemeToggle, title }) => {
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const onClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
		};
		const onEsc = (e) => {
			if (e.key === 'Escape') setIsProfileOpen(false);
		};
		document.addEventListener('mousedown', onClickOutside);
		document.addEventListener('keydown', onEsc);
		return () => {
			document.removeEventListener('mousedown', onClickOutside);
			document.removeEventListener('keydown', onEsc);
		};
	}, []);

	return (
		<header className="fixed top-0 left-0 right-0 z-20 md:ml-72 bg-white/80 dark:bg-onyx-950/80 backdrop-blur-xl border-b border-platinum-200 dark:border-onyx-800 transition-colors duration-200">
			<div className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between">
				{/* Mobile Logo / Title */}
				<div className="flex items-center gap-3">
					<div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-dark-teal-600 to-dark-teal-800 dark:from-stormy-teal-500 dark:to-stormy-teal-700 flex items-center justify-center shadow-sm">
						<span className="text-white font-bold text-lg leading-none">T</span>
					</div>
					<h1 className="text-xl md:text-2xl font-bold tracking-tight text-onyx-900 dark:text-platinum-50">{title}</h1>
				</div>

				{/* Right Side Actions */}
				<div className="flex items-center gap-3 md:gap-6">
					{/* Theme Toggle */}
					<button
						type="button"
						onClick={onThemeToggle}
						className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-platinum-100 dark:bg-onyx-800 text-onyx-700 dark:text-platinum-200 shadow-sm border border-platinum-200 dark:border-onyx-700 hover:bg-platinum-200 dark:hover:bg-onyx-700 transition-all hover:scale-105 active:scale-95"
						aria-label="Toggle theme"
					>
						{isDarkMode ? <FaSun className="text-amber-400 text-lg" /> : <FaMoon className="text-onyx-600 text-lg" />}
					</button>

					{/* Profile Dropdown */}
					<div className="relative" ref={dropdownRef}>
						<button
							type="button"
							onClick={() => setIsProfileOpen((s) => !s)}
							className="flex items-center gap-3 p-1 pl-1 md:pl-3 md:pr-1 rounded-full md:rounded-xl hover:bg-platinum-100 dark:hover:bg-onyx-800 transition-all border border-transparent md:hover:border-platinum-200 md:dark:hover:border-onyx-700"
							aria-haspopup="menu"
							aria-expanded={isProfileOpen}
						>
							<div className="hidden md:flex flex-col items-end mr-1 text-right">
								<span className="text-sm font-bold text-onyx-900 dark:text-platinum-50 leading-none">Rohan Kumar</span>
								<span className="text-xs font-medium text-onyx-500 dark:text-onyx-400 mt-1">Student</span>
							</div>
							<img
								src="https://ui-avatars.com/api/?name=Rohan+Kumar&background=108389&color=fff&bold=true"
								alt="Avatar"
								className="h-10 w-10 sm:h-9 sm:w-9 rounded-full shadow-sm ring-2 ring-white dark:ring-onyx-800"
							/>
						</button>

						{isProfileOpen && (
							<div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-onyx-800 shadow-xl ring-1 ring-onyx-950/5 dark:ring-white/10 overflow-hidden z-50 transform origin-top-right transition-all">
								<div className="px-4 py-3 md:hidden border-b border-platinum-100 dark:border-onyx-700">
									<p className="text-sm font-bold text-onyx-900 dark:text-platinum-50">Rohan Kumar</p>
									<p className="text-xs font-medium text-onyx-500 dark:text-onyx-400 mt-0.5">Student</p>
								</div>
								<Link to="/student/profile" className="flex items-center px-4 py-3 text-sm font-semibold text-onyx-700 dark:text-platinum-100 hover:bg-platinum-50 dark:hover:bg-onyx-700 transition-colors">
									View Profile
								</Link>
								<button className="w-full flex items-center px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-platinum-100 dark:border-onyx-700">
									Logout
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

const MainLayout = ({ children }) => {
	const { theme, toggleTheme } = useTheme();
	const location = useLocation();

	// Removed the confusing mobile sidebar since bottom nav replaces it natively.
	
	const titleMap = {
		'/student/dashboard': 'Dashboard',
		'/student/attendance': 'My Attendance',
		'/student/timetable': 'My Timetable',
		'/student/profile': 'My Profile',
	};
	
	// Default to Dashboard if not found, but prioritize finding the exact match
	const currentTitle = titleMap[location.pathname] || 'TrackEd';

	return (
		<div className="bg-platinum-50 dark:bg-onyx-950 font-sans min-h-screen transition-colors duration-300 selection:bg-dark-teal-500/30 selection:text-onyx-900 dark:selection:text-platinum-50 text-onyx-800 dark:text-platinum-100">
			{/* Desktop Sidebar (hidden on mobile) */}
			<DesktopSidebar />
			
			{/* Header (adjusted padding for desktop sidebar) */}
			<Header
				isDarkMode={theme === 'dark'}
				onThemeToggle={toggleTheme}
				title={currentTitle}
			/>
			
			{/* Main Content Area */}
			{/* pt-16 md:pt-20 avoids the header. pb-20 md:pb-8 avoids the mobile bottom nav. md:ml-72 makes room for desktop sidebar */}
			<main className="pt-16 md:pt-20 pb-20 md:pb-8 md:ml-72 min-h-screen overflow-x-hidden">
				{/* A wrapper to define max width and padding for pages */}
				<div className="w-full h-full p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
					{children}
				</div>
			</main>
			
			{/* Mobile Bottom Navigation (hidden on desktop) */}
			<MobileBottomNav />
		</div>
	);
};

export default MainLayout;
