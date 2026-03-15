import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaExclamationTriangle, FaEnvelopeOpenText, FaArrowRight, FaVideo, FaCheckCircle, FaUserShield } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Complex Glassmorphism constraints implemented on the dashboard cards
const DashboardCard = ({ children, className }) => (
    <motion.div 
        whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
        className={`bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl border border-platinum-100 dark:border-onyx-700/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative group transition-all duration-300 ${className}`}
    >
        {/* Subtle light catcher border overlay */}
        <div className="absolute inset-0 border-[0.5px] border-white/40 dark:border-white/5 rounded-3xl pointer-events-none"></div>
        {children}
    </motion.div>
);

// Animated SVG Circular Progress Component
const AnimatedCircularProgress = ({ percentage, colorClass, trailColorClass, label }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
                <circle
                    className={`${trailColorClass} stroke-current`}
                    strokeWidth="6"
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="transparent"
                />
                <motion.circle
                    className={`${colorClass} stroke-current`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="transparent"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{ strokeDasharray: circumference }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-xl font-black ${colorClass}`}>{Math.round(percentage)}%</span>
            </div>
            <span className="mt-2 text-xs font-bold uppercase tracking-widest text-onyx-500 dark:text-onyx-400">{label}</span>
        </div>
    );
};

export default function FacultyDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setTimeout(() => {
                const mockData = {
                    todaysClasses: [
                        { classId: "CS301", subjectName: "Data Structures", time: "10:00 AM - 11:00 AM", semester: "3rd Sem, CSE", type: "Core Lecture" },
                        { classId: "EC305", subjectName: "Digital Electronics", time: "01:00 PM - 02:00 PM", semester: "3rd Sem, ECE", type: "Lab Session" },
                        { classId: "CS309", subjectName: "Advanced DBMS", time: "03:00 PM - 04:30 PM", semester: "5th Sem, CSE", type: "Seminar" }
                    ],
                    liveSession: { classId: "CS301", subjectName: "Data Structures", presentCount: 45, totalStudents: 60, status: 'Active' },
                    atRiskStudents: [
                        { name: "Priya Singh", attendance: "68%", roll: "2024CS104" }, 
                        { name: "Amit Kumar", attendance: "71%", roll: "2024EC055" },
                    ],
                    pendingLeaves: [
                        { studentName: "Rohan Kumar", forDates: "Sep 15 - Sep 16", reason: "Medical" }, 
                        { studentName: "Anjali Gupta", forDates: "Sep 15", reason: "Family Emergency" },
                    ],
                };
                setDashboardData(mockData);
                setIsLoading(false);
            }, 800);
        };
        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-onyx-400 dark:text-onyx-500 font-bold uppercase tracking-widest text-sm animate-pulse">
                    <span className="w-10 h-10 border-4 border-onyx-200 dark:border-onyx-800 border-t-dark-teal-500 rounded-full animate-spin"></span>
                    Synchronizing Data...
                </div>
            </div>
        );
    }

    if (!dashboardData) return null;

    return (
        <div className="relative">
            {/* AMBIENT LIGHTING BACKGROUND - Deep Space Effect */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden lg:block">
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-dark-teal-400/20 dark:bg-dark-teal-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: '14s' }}></div>
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-stormy-teal-300/30 dark:bg-stormy-teal-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50"></div>
                <div className="absolute inset-0 bg-platinum-50/80 dark:bg-onyx-950/90 backdrop-blur-[80px]"></div>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-8 relative z-10 w-full text-onyx-900 dark:text-platinum-50">
                
                {/* Welcome Summary Banner */}
                <motion.div variants={itemVariants} className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl rounded-[2rem] border border-platinum-100 dark:border-onyx-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-dark-teal-300/30 to-transparent dark:from-dark-teal-600/20 rounded-full filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full bg-platinum-200/50 dark:bg-onyx-900/80 border border-platinum-300 dark:border-onyx-700 text-xs font-black uppercase tracking-[0.2em] text-onyx-600 dark:text-onyx-400 mb-4">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> SYSTEM ONLINE
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-onyx-900 dark:text-platinum-50 mb-2 leading-tight">
                            Good Afternoon, <br className="md:hidden" /><span className="bg-clip-text text-transparent bg-gradient-to-r from-dark-teal-600 to-stormy-teal-700 dark:from-dark-teal-400 dark:to-platinum-300">Dr. Sharma.</span>
                        </h2>
                        <p className="text-onyx-600 dark:text-onyx-400 font-bold text-lg">You have {dashboardData.todaysClasses.length} sessions scheduled today.</p>
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        <AnimatedCircularProgress 
                            percentage={85} 
                            label="Avg Attendance" 
                            colorClass="text-dark-teal-500" 
                            trailColorClass="text-platinum-200 dark:text-onyx-700" 
                        />
                        <div className="w-px h-16 bg-platinum-300 dark:bg-onyx-700"></div>
                        <AnimatedCircularProgress 
                            percentage={12} 
                            label="At Risk" 
                            colorClass="text-amber-500" 
                            trailColorClass="text-platinum-200 dark:text-onyx-700" 
                        />
                    </div>
                </motion.div>

                {/* Primary Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Today's Schedule */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-8">
                        
                        <DashboardCard className="flex flex-col h-full">
                            <div className="p-6 md:p-8 border-b border-platinum-100 dark:border-onyx-700/50 flex items-center justify-between">
                                <h3 className="text-xl font-extrabold flex items-center gap-3 text-onyx-900 dark:text-platinum-50 tracking-tight">
                                    <div className="w-10 h-10 rounded-xl bg-platinum-100 dark:bg-onyx-900/80 flex items-center justify-center shadow-inner border border-platinum-200 dark:border-onyx-700">
                                        <FaClock className="text-dark-teal-600 dark:text-dark-teal-400" />
                                    </div>
                                    Command Schedule
                                </h3>
                                <button className="text-sm font-bold text-dark-teal-600 dark:text-dark-teal-400 hover:text-dark-teal-800 hover:underline transition-colors">View Timeline</button>
                            </div>
                            
                            <div className="p-6 md:p-8 space-y-4 flex-grow">
                                <AnimatePresence>
                                    {dashboardData.todaysClasses.map((cls, idx) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            key={cls.classId} 
                                            className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/80 dark:bg-onyx-900/60 backdrop-blur-md border border-platinum-100 dark:border-onyx-700/60 rounded-2xl shadow-sm hover:shadow-md transition-all gap-4 overflow-hidden"
                                        >
                                            {/* Hover indicator */}
                                            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-dark-teal-400 to-stormy-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            
                                            <div className="pl-2">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-extrabold text-lg tracking-tight text-onyx-900 dark:text-platinum-50 group-hover:text-dark-teal-700 dark:group-hover:text-platinum-200 transition-colors">{cls.subjectName}</h4>
                                                    <span className="px-2 py-0.5 rounded border border-platinum-200 dark:border-onyx-700 bg-platinum-50 dark:bg-onyx-800 font-bold text-[10px] text-onyx-500 uppercase tracking-widest">{cls.classId}</span>
                                                </div>
                                                <p className="text-sm font-semibold text-onyx-500 dark:text-onyx-400 flex items-center gap-2">
                                                    {cls.time} <span className="w-1 h-1 rounded-full bg-platinum-300 dark:bg-onyx-600"></span> {cls.semester}
                                                </p>
                                            </div>

                                            <Link 
                                                to={`/faculty/session/${cls.classId}`} 
                                                className="shrink-0 flex items-center justify-center gap-2 bg-onyx-900 dark:bg-platinum-100 text-white dark:text-onyx-900 px-6 py-3 rounded-xl font-extrabold shadow-md hover:shadow-lg transition-all active:scale-95 text-sm uppercase tracking-wide group/btn"
                                            >
                                                Initialize
                                                <FaArrowRight className="text-dark-teal-400 dark:text-dark-teal-600 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </DashboardCard>
                    </motion.div>

                    {/* Right Column: Actionable Alerts & Active Sessions */}
                    <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-8">
                        
                        {/* Live Session Override Box */}
                        {dashboardData.liveSession && (
                            <Link to={`/faculty/session/${dashboardData.liveSession.classId}`}>
                                <motion.div 
                                    whileHover={{ scale: 1.02, y: -4, filter: 'brightness(1.1)' }}
                                    className="bg-gradient-to-br from-dark-teal-600 to-stormy-teal-800 text-white rounded-[2rem] shadow-xl p-8 relative overflow-hidden group cursor-pointer"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-black uppercase tracking-widest border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        Live
                                    </div>

                                    <div className="relative z-10 hidden sm:flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl border border-white/20">
                                            <FaVideo className="text-white" />
                                        </div>
                                    </div>
                                    
                                    <p className="font-extrabold text-xl tracking-tight mb-6 relative z-10">{dashboardData.liveSession.subjectName}</p>
                                    
                                    <div className="flex items-baseline gap-2 mb-1 relative z-10">
                                        <span className="text-5xl font-black">{dashboardData.liveSession.presentCount}</span>
                                        <span className="text-xl font-bold opacity-70">/ {dashboardData.liveSession.totalStudents}</span>
                                    </div>
                                    <p className="text-sm font-bold uppercase tracking-widest opacity-80 relative z-10">Presence Confirmed</p>
                                </motion.div>
                            </Link>
                        )}

                        {/* At Risk Alert Card */}
                        <Link to="/faculty/reports" className="block outline-none">
                            <DashboardCard className="border-l-4 border-l-amber-500">
                                <div className="p-6">
                                    <h3 className="font-extrabold text-lg flex items-center gap-3 text-onyx-900 dark:text-platinum-50 mb-4 tracking-tight">
                                        <FaExclamationTriangle className="text-amber-500 text-xl" /> Critical Status
                                    </h3>
                                    <ul className="space-y-3">
                                        {dashboardData.atRiskStudents.map((student, index) => (
                                            <li key={index} className="flex flex-col gap-1 p-3 rounded-xl bg-platinum-100/50 dark:bg-onyx-900/50 border border-platinum-200 dark:border-onyx-800/50 group-hover:bg-platinum-200/50 dark:group-hover:bg-onyx-800 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-onyx-800 dark:text-platinum-200">{student.name}</span>
                                                    <span className="font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded text-sm">{student.attendance}</span>
                                                </div>
                                                <span className="text-xs font-bold text-onyx-500 uppercase tracking-widest">{student.roll}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </DashboardCard>
                        </Link>

                        {/* Pending Leaves Card */}
                        <Link to="/faculty/leave" className="block outline-none">
                            <DashboardCard className="border-l-4 border-l-dark-teal-500">
                                <div className="p-6 flex flex-col h-full">
                                    <h3 className="font-extrabold text-lg flex items-center gap-3 text-onyx-900 dark:text-platinum-50 mb-4 tracking-tight">
                                        <FaEnvelopeOpenText className="text-dark-teal-500 text-xl" /> Action Required
                                    </h3>
                                    <ul className="space-y-3 flex-grow mb-4">
                                        {dashboardData.pendingLeaves.map((leave, index) => (
                                            <li key={index} className="flex flex-col gap-1 p-3 rounded-xl bg-platinum-100/50 dark:bg-onyx-900/50 border border-platinum-200 dark:border-onyx-800/50 group-hover:bg-platinum-200/50 dark:group-hover:bg-onyx-800 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-onyx-800 dark:text-platinum-200 truncate pr-2">{leave.studentName}</span>
                                                    <span className="shrink-0 text-[10px] font-black uppercase tracking-widest bg-dark-teal-50 dark:bg-dark-teal-900/40 text-dark-teal-700 dark:text-dark-teal-400 px-2 py-1 rounded">Leave Req</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs font-semibold text-onyx-500">{leave.reason}</span>
                                                    <span className="text-xs font-bold text-onyx-400">{leave.forDates}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto flex items-center justify-end gap-2 text-xs font-black uppercase tracking-widest text-dark-teal-600 dark:text-dark-teal-400 group-hover:text-dark-teal-800 dark:group-hover:text-platinum-200 transition-colors">
                                        Review Inbox <FaArrowRight />
                                    </div>
                                </div>
                            </DashboardCard>
                        </Link>

                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}