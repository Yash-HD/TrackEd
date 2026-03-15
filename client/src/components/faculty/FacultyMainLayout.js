import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaThLarge, FaUsers, FaChartPie, FaCalendarCheck, FaUserCircle, FaSignOutAlt, FaSun, FaMoon, FaBars } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose, currentPath }) => {
    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-onyx-950/60 backdrop-blur-sm lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Laptop-First Sidebar panel */}
            <aside
                className={`fixed left-0 top-0 z-50 h-full w-72 bg-white/80 dark:bg-onyx-900/80 backdrop-blur-2xl border-r border-platinum-200 dark:border-onyx-800 shadow-[20px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[20px_0_40px_rgba(0,0,0,0.3)] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand Header */}
                <div className="h-24 flex items-center px-8 border-b border-platinum-200 dark:border-onyx-800/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-dark-teal-400/20 to-transparent dark:from-dark-teal-600/10 rounded-full filter blur-xl opacity-70 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                    <div className="flex items-center gap-3 relative z-10 w-full">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-teal-500 to-stormy-teal-600 shadow-lg shadow-dark-teal-500/20 flex items-center justify-center text-white font-black text-xl">
                            T
                        </div>
                        <span className="text-2xl font-black tracking-tight text-onyx-900 dark:text-platinum-50">Track<span className="text-dark-teal-600 dark:text-stormy-teal-400">Ed</span></span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 flex flex-col gap-2 overflow-y-auto h-[calc(100%-6rem)]">
                    <p className="px-4 text-xs font-bold text-onyx-400 dark:text-onyx-500 uppercase tracking-widest mt-4 mb-2">Faculty Portal</p>
                    
                    {[
                        { path: '/faculty/dashboard', icon: FaThLarge, label: 'Dashboard' },
                        { path: '/faculty/classes', icon: FaUsers, label: 'My Classes' },
                        { path: '/faculty/reports', icon: FaChartPie, label: 'Analytics' },
                        { path: '/faculty/leave', icon: FaCalendarCheck, label: 'Leave Approvals' },
                        { path: '/faculty/profile', icon: FaUserCircle, label: 'My Profile' }
                    ].map((item) => {
                        const isActive = currentPath === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                onClick={() => onClose()}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden ${isActive ? 'bg-dark-teal-50 dark:bg-onyx-800/80 shadow-sm border border-dark-teal-100 dark:border-onyx-700/50' : 'hover:bg-platinum-100 dark:hover:bg-onyx-800/40 text-onyx-600 dark:text-onyx-300'}`}
                            >
                                {/* Active background glow */}
                                {isActive && <div className="absolute left-0 top-0 w-1.5 h-full bg-dark-teal-500 dark:bg-dark-teal-400 rounded-r-full shadow-[0_0_10px_rgba(27,218,228,0.5)]"></div>}
                                
                                <item.icon className={`text-xl transition-colors ${isActive ? 'text-dark-teal-600 dark:text-dark-teal-400' : 'text-onyx-400 group-hover:text-dark-teal-500 dark:group-hover:text-platinum-300'}`} />
                                <span className={`font-bold tracking-wide transition-colors ${isActive ? 'text-dark-teal-900 dark:text-white' : 'group-hover:text-onyx-900 dark:group-hover:text-platinum-50'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    <div className="mt-auto pt-6 pb-4">
                        <Link to="/" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                            <FaSignOutAlt className="text-xl opacity-70 group-hover:opacity-100" />
                            <span className="font-bold tracking-wide">Secure Logout</span>
                        </Link>
                    </div>
                </nav>
            </aside>
        </>
    );
};

const Header = ({ onMenuClick, isDarkMode, onThemeToggle, title }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-40 lg:pl-72 bg-white/80 dark:bg-onyx-950/80 backdrop-blur-2xl border-b border-platinum-200 dark:border-onyx-800/50 transition-all duration-300">
            <div className="h-24 px-6 md:px-10 flex items-center justify-between">
                
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-onyx-800 border border-platinum-200 dark:border-onyx-700 text-onyx-600 dark:text-onyx-300 shadow-sm hover:text-dark-teal-600 dark:hover:text-platinum-50 hover:border-dark-teal-200 dark:hover:border-onyx-600 transition-all"
                        aria-label="Open sidebar"
                    >
                        <FaBars size={20} />
                    </button>
                    
                    <div>
                        <motion.h1 
                            key={title}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl md:text-3xl font-black tracking-tight text-onyx-900 dark:text-platinum-50"
                        >
                            {title}
                        </motion.h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Theme Toggle Button */}
                    <button
                        type="button"
                        onClick={onThemeToggle}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-platinum-100/50 dark:bg-onyx-800/50 border border-platinum-200 dark:border-onyx-700 text-onyx-600 dark:text-onyx-300 hover:text-dark-teal-600 dark:hover:text-platinum-50 shadow-inner transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <FaMoon size={20} /> : <FaSun size={20} className="text-onyx-500" />}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            type="button" 
                            onClick={() => setIsProfileOpen((s) => !s)} 
                            className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white dark:bg-onyx-800 border border-platinum-200 dark:border-onyx-700 shadow-sm hover:border-dark-teal-300 dark:hover:border-onyx-600 transition-all"
                        >
                            <img
                                src="https://ui-avatars.com/api/?name=Dr+Sharma&background=108389&color=fff&bold=true"
                                alt="Avatar"
                                className="h-10 w-10 rounded-xl"
                            />
                            <div className="hidden md:flex flex-col items-start leading-tight">
                                <span className="text-sm font-extrabold text-onyx-900 dark:text-platinum-50 tracking-tight">Dr. Sharma</span>
                                <span className="text-xs font-bold text-dark-teal-600 dark:text-stormy-teal-400">Computer Science</span>
                            </div>
                        </button>
                        
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-onyx-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-platinum-200 dark:border-onyx-700 overflow-hidden z-50 p-2"
                                >
                                    <Link to="/faculty/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-onyx-700 dark:text-onyx-200 hover:bg-platinum-100 dark:hover:bg-onyx-700 rounded-xl transition-colors">
                                        <FaUserCircle className="text-lg text-onyx-400" /> View Identity
                                    </Link>
                                    <div className="h-px bg-platinum-200 dark:bg-onyx-700 my-1 mx-2"></div>
                                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                                        <FaSignOutAlt className="text-lg" /> Override & Exit
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default function FacultyMainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const titleMap = {
        '/faculty/dashboard': 'Command Center',
        '/faculty/classes': 'My Classes',
        '/faculty/reports': 'Analytics Engine',
        '/faculty/leave': 'Leave Approvals',
        '/faculty/profile': 'Identity Overview',
    };
    const currentTitle = titleMap[location.pathname] || 'Facility Portal';

    return (
        <div className="min-h-screen bg-platinum-50 dark:bg-onyx-950 selection:bg-dark-teal-500/30 selection:text-onyx-900 dark:selection:text-platinum-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPath={location.pathname} />
            <Header
                onMenuClick={() => setIsSidebarOpen((s) => !s)}
                isDarkMode={theme === 'dark'}
                onThemeToggle={toggleTheme}
                title={currentTitle}
            />
            {/* Main Content Area - Laptop First Padding */}
            <main className="pt-24 lg:pl-72 min-h-screen">
                <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}