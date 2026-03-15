import React, { useMemo, useState } from 'react';
import MainLayout from '../../components/student/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data - In a real app, this would come from an API call
const SAMPLE_RECORDS = [
    { datetime: '2025-09-08T11:00:00', subject: 'Data Structures', status: 'Present' },
    { datetime: '2025-09-08T14:00:00', subject: 'Database Management', status: 'Present' },
    { datetime: '2025-09-09T09:00:00', subject: 'Operating Systems', status: 'Absent' },
    { datetime: '2025-09-10T12:00:00', subject: 'Data Structures', status: 'Present' },
    { datetime: '2025-08-11T11:00:00', subject: 'Operating Systems', status: 'Present' },
    { datetime: '2025-08-12T10:00:00', subject: 'Computer Networks', status: 'Present' },
];
const SAMPLE_SUBJECTS = ['All Subjects', 'Data Structures', 'Operating Systems', 'Database Management', 'Computer Networks'];
const MONTHS = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AttendancePage = () => {
    const [subjectFilter, setSubjectFilter] = useState('All Subjects');
    const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);

    const subjectStats = useMemo(() => {
        const recordsInMonth = monthFilter === 'All Months' 
            ? SAMPLE_RECORDS 
            : SAMPLE_RECORDS.filter(rec => new Date(rec.datetime).getMonth() + 1 === parseInt(monthFilter));
        
        const groupedBySubject = recordsInMonth.reduce((acc, rec) => {
            if (!acc[rec.subject]) acc[rec.subject] = [];
            acc[rec.subject].push(rec);
            return acc;
        }, {});

        let stats = Object.keys(groupedBySubject).map(subjectName => {
            const records = groupedBySubject[subjectName];
            const totalLec = records.length;
            const attendedLec = records.filter(r => r.status === 'Present').length;
            const percentage = totalLec > 0 ? Math.round((attendedLec / totalLec) * 100) : 0;
            return { subjectName, totalLec, attendedLec, percentage };
        });
        
        if (subjectFilter !== 'All Subjects') {
            stats = stats.filter(s => s.subjectName === subjectFilter);
        }

        return stats;
    }, [subjectFilter, monthFilter]);

    const getPercentColor = (pct) => {
        if (pct >= 85) return 'text-green-500 dark:text-green-400';
        if (pct >= 70) return 'text-amber-500 dark:text-amber-400';
        return 'text-red-500 dark:text-red-400';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    return (
        <MainLayout>
            {/* AMBIENT LIGHTING BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden md:block">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-dark-teal-400/20 dark:bg-dark-teal-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '10s' }}></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-stormy-teal-300/30 dark:bg-stormy-teal-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50"></div>
                <div className="absolute inset-0 bg-platinum-50/80 dark:bg-onyx-950/90 backdrop-blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10 text-onyx-900 dark:text-platinum-50">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-6"
                >
                    {/* Header + Filters Card */}
                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl rounded-[2rem] border border-platinum-100 dark:border-onyx-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 md:p-8 flex flex-col items-center md:items-start md:flex-row md:justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-dark-teal-300/30 to-transparent dark:from-dark-teal-600/20 rounded-full filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-onyx-900 to-onyx-600 dark:from-platinum-50 dark:to-platinum-300 mb-2">My Attendance</h2>
                            <p className="text-onyx-500 dark:text-platinum-300 font-medium">View your subject-wise attendance summary.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full md:w-auto relative z-10">
                            <select 
                                value={subjectFilter} 
                                onChange={(e) => setSubjectFilter(e.target.value)} 
                                className="px-4 py-3 rounded-xl border border-platinum-200 dark:border-onyx-700 bg-white/80 dark:bg-onyx-900/80 backdrop-blur-md font-semibold text-onyx-800 dark:text-platinum-100 focus:outline-none focus:ring-2 focus:ring-dark-teal-500 shadow-sm transition-all cursor-pointer appearance-none"
                            >
                                {SAMPLE_SUBJECTS.map((s) => <option key={s} value={s} className="bg-white dark:bg-onyx-900">{s}</option>)}
                            </select>
                            <select 
                                value={monthFilter} 
                                onChange={(e) => setMonthFilter(e.target.value)} 
                                className="px-4 py-3 rounded-xl border border-platinum-200 dark:border-onyx-700 bg-white/80 dark:bg-onyx-900/80 backdrop-blur-md font-semibold text-onyx-800 dark:text-platinum-100 focus:outline-none focus:ring-2 focus:ring-dark-teal-500 shadow-sm transition-all cursor-pointer appearance-none"
                            >
                                {MONTHS.map((m, i) => <option key={m} value={i === 0 ? 'All Months' : i} className="bg-white dark:bg-onyx-900">{m}</option>)}
                            </select>
                        </div>
                    </motion.div>

                    {/* Responsive Tile Grid */}
                    {subjectStats.length > 0 ? (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {subjectStats.map((stat, idx) => (
                                    <motion.div 
                                        layout
                                        variants={itemVariants}
                                        key={stat.subjectName} 
                                        whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                                        className="group bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl border border-platinum-100 dark:border-onyx-700/50 rounded-3xl shadow-sm dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-dark-teal-400 to-dark-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <div className="mb-6">
                                            <h3 className="font-extrabold text-xl text-onyx-900 dark:text-platinum-50 tracking-tight leading-snug pr-8">{stat.subjectName}</h3>
                                        </div>
                                        
                                        <div className="flex items-end justify-between mt-auto">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-bold text-onyx-500 dark:text-onyx-400 uppercase tracking-widest mb-1">Attended</p>
                                                <p className="text-lg font-bold text-onyx-800 dark:text-platinum-200">
                                                    <span className="text-2xl text-onyx-900 dark:text-white">{stat.attendedLec}</span> / {stat.totalLec}
                                                </p>
                                            </div>
                                            <div className={`text-5xl font-black tracking-tighter ${getPercentColor(stat.percentage)}`}>
                                                {stat.percentage}<span className="text-2xl opacity-80">%</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants} className="text-center py-20 bg-white/40 dark:bg-onyx-800/20 backdrop-blur-lg rounded-[2rem] border border-dashed border-platinum-300 dark:border-onyx-700">
                            <p className="text-xl font-bold text-onyx-500 dark:text-onyx-400">No attendance records found for the selected view.</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </MainLayout>
    );
};
export default AttendancePage;