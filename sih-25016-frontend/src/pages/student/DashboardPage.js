import React, { useState } from 'react';
import MainLayout from '../../components/student/MainLayout';
import { FaQrcode, FaCalendarAlt, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import QRCodeScannerModal from '../../components/student/QRCodeScannerModal';
import { motion } from 'framer-motion';

// SVG Progress Ring Component
const ProgressRing = ({ percentage, colorClass, size = 80, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                    className="text-platinum-200 dark:text-onyx-800 transition-colors duration-300"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Ring */}
                <motion.circle
                    className={`${colorClass} transition-colors duration-300 drop-shadow-md`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // Start empty for animation
                    animate={{ strokeDashoffset }}   // Animate to full
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {/* Center Text */}
            <div className={`absolute text-xl font-extrabold ${colorClass}`}>
                {percentage}%
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    // Sample data
    const upcomingClasses = [
        { time: '11:00 AM', subject: 'Data Structures', faculty: 'Dr. Sharma' },
        { time: '01:00 PM', subject: 'Operating Systems', faculty: 'Prof. Verma' },
    ];
    const subjectData = [
        { name: 'Data Structures', percentage: 92 },
        { name: 'Operating Systems', percentage: 74 },
        { name: 'Database Management', percentage: 85 },
        { name: 'Computer Networks', percentage: 68 },
    ];

    const atRiskSubjects = subjectData.filter(subj => subj.percentage < 75);

    const getPercentColor = (pct) => {
        if (pct >= 85) return 'text-green-500 dark:text-green-400';
        if (pct >= 70) return 'text-amber-500 dark:text-amber-400';
        return 'text-red-500 dark:text-red-400';
    };

    const getPercentColorBg = (pct) => {
        if (pct >= 85) return 'bg-green-500 dark:bg-green-400';
        if (pct >= 70) return 'bg-amber-500 dark:bg-amber-400';
        return 'bg-red-500 dark:bg-red-400';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
    };

    return (
        <MainLayout>
            {/* AMBIENT LIGHTING BACKGROUND - Gives the extreme depth in Dark/Light mode */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden md:block">
                {/* Top left teal glow */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-dark-teal-400/20 dark:bg-dark-teal-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-pulse" style={{ animationDuration: '8s' }}></div>
                {/* Bottom right stormy glow */}
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-stormy-teal-300/30 dark:bg-stormy-teal-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-60"></div>
                {/* Deep background color layer */}
                <div className="absolute inset-0 bg-platinum-50/80 dark:bg-onyx-950/90 backdrop-blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10 p-2 sm:p-4 lg:p-6 text-onyx-900 dark:text-platinum-50">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {/* 1. WELCOME CARD - GLASSMORPHISM */}
                    <motion.div variants={itemVariants} className="lg:col-span-3 relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-platinum-100 dark:border-onyx-700/50 p-8 md:p-10 transition-all duration-300">
                        {/* Decorative inner light flare */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-dark-teal-300/40 to-transparent dark:from-dark-teal-600/30 rounded-full filter blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative z-10">
                            <div className="max-w-xl">
                                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-onyx-900 to-onyx-600 dark:from-platinum-50 dark:to-platinum-300 pb-2">Welcome back, Rohan.</h2>
                                <p className="text-onyx-600 dark:text-platinum-300 mt-2 text-lg font-medium leading-relaxed">Your attendance overview is ready. You are currently maintaining excellent standing.</p>
                            </div>

                            {/* Premium Gradient Button */}
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(27,218,228,0.4)" }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setIsScannerOpen(true)}
                                className="relative group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-br from-dark-teal-600 to-dark-teal-800 dark:from-dark-teal-500 dark:to-stormy-teal-700 text-white shadow-lg shadow-dark-teal-900/20 font-bold tracking-wide overflow-hidden transition-all"
                            >
                                {/* Button Inner Glow */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <FaQrcode className="text-2xl relative z-10" />
                                <span className="relative z-10 text-lg">Scan QR Code</span>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* 2 & 3. KEY STATISTIC CARDS with SVG RINGS */}
                    <motion.div variants={itemVariants} whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }} className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl rounded-3xl border border-platinum-100 dark:border-onyx-700/50 shadow-sm dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] p-6 md:p-8 flex flex-col justify-between transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-onyx-500 dark:text-platinum-400 uppercase tracking-widest">Overall Attendance</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                                <span className="text-5xl font-black text-onyx-900 dark:text-platinum-50 tracking-tighter">88<span className="text-2xl text-onyx-400">%</span></span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Excellent Status
                                </span>
                            </div>
                            {/* SVG Ring */}
                            <ProgressRing percentage={88} colorClass="text-green-500 dark:text-green-400" size={90} strokeWidth={10} />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }} className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl rounded-3xl border border-platinum-100 dark:border-onyx-700/50 shadow-sm dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] p-6 md:p-8 flex flex-col justify-between transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold text-onyx-500 dark:text-platinum-400 uppercase tracking-widest">Subjects at Risk</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                                <span className="text-5xl font-black text-onyx-900 dark:text-platinum-50 tracking-tighter">02</span>
                                <span className="text-sm font-medium text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Requires Attention
                                </span>
                            </div>
                            {/* Warning Icon styled like the ring */}
                            <div className="w-[90px] h-[90px] rounded-full border-8 border-platinum-200 dark:border-onyx-800 flex items-center justify-center">
                                <FaExclamationTriangle className="text-amber-500 text-3xl drop-shadow-md" />
                            </div>
                        </div>
                    </motion.div>

                    {/* 4. UPCOMING SCHEDULE */}
                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl rounded-3xl border border-platinum-100 dark:border-onyx-700/50 shadow-sm dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] p-6 md:p-8">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-onyx-900 to-onyx-600 dark:from-platinum-50 dark:to-platinum-300 mb-6">Today's Schedule</h3>
                        <div className="space-y-4">
                            {upcomingClasses.map((cls, idx) => (
                                <motion.div whileHover={{ scale: 1.02 }} key={idx} className="group relative flex items-center gap-5 bg-white/80 dark:bg-onyx-900/60 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-platinum-100 dark:border-onyx-700/50 shadow-sm transition-all cursor-default overflow-hidden">
                                    {/* Hover highlight bar */}
                                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-dark-teal-400 to-dark-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-platinum-50 dark:bg-onyx-800 text-onyx-900 dark:text-platinum-50 border border-platinum-200 dark:border-onyx-700">
                                        <span className="text-lg font-black leading-none">{cls.time.split(' ')[0]}</span>
                                        <span className="text-xs font-bold text-onyx-500 uppercase mt-1">{cls.time.split(' ')[1]}</span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-onyx-900 dark:text-platinum-50">{cls.subject}</p>
                                        <p className="text-sm font-medium text-onyx-500 dark:text-platinum-300 flex items-center gap-2 mt-1">
                                            <FaUser className="text-xs opacity-70" /> {cls.faculty}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 5. SUBJECT-WISE BREAKDOWN */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl rounded-3xl border border-platinum-100 dark:border-onyx-700/50 shadow-sm dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-onyx-900 to-onyx-600 dark:from-platinum-50 dark:to-platinum-300">Subject Breakdown</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {subjectData.map((subj, idx) => (
                                <div key={idx} className="bg-white/80 dark:bg-onyx-900/50 backdrop-blur-sm rounded-2xl p-5 border border-platinum-100 dark:border-onyx-700/50">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="font-bold text-onyx-800 dark:text-platinum-100">{subj.name}</span>
                                        <span className={`text-xl font-black ${getPercentColor(subj.percentage)}`}>{subj.percentage}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-platinum-100 dark:bg-onyx-800 rounded-full overflow-hidden shrink-0">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${subj.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.3 + (idx * 0.1), ease: "easeOut" }}
                                            className={`h-full rounded-full ${getPercentColorBg(subj.percentage)} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 6. SUBJECTS AT RISK LIST */}
                    <motion.div variants={itemVariants} className="lg:col-span-3 bg-gradient-to-br from-red-50/80 to-red-100/50 dark:from-onyx-800/60 dark:to-onyx-900/60 backdrop-blur-xl rounded-3xl border border-red-200 dark:border-onyx-700/50 shadow-sm p-6 md:p-8 relative overflow-hidden">
                        {/* Red ambient warning glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-400/10 dark:bg-red-900/20 rounded-full filter blur-[60px] pointer-events-none"></div>

                        <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-3 relative z-10">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <FaExclamationTriangle />
                            </div>
                            Action Required
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                            {atRiskSubjects.length > 0 ? atRiskSubjects.map((subj, idx) => (
                                <motion.div whileHover={{ scale: 1.02 }} key={idx} className="flex items-center justify-between bg-white/90 dark:bg-onyx-900/80 rounded-2xl p-4 border border-red-100 dark:border-onyx-700 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-onyx-900 dark:text-platinum-50">{subj.name}</span>
                                        <span className="text-xs font-semibold text-red-500 mt-0.5 uppercase tracking-wide">Short Attendance</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border-4 border-red-100 dark:border-onyx-800 flex items-center justify-center">
                                        <span className={`text-sm font-black text-red-600 dark:text-red-400`}>{subj.percentage}%</span>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full text-center p-8 bg-white/50 dark:bg-onyx-800/30 backdrop-blur-sm rounded-2xl border border-green-200 dark:border-onyx-700 border-dashed">
                                    <p className="text-lg font-bold text-green-700 dark:text-green-500">You are in perfect standing. Nice work!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                </motion.div>
            </div>

            <QRCodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
            />
        </MainLayout>
    );
};

export default DashboardPage;