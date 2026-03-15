import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/student/MainLayout';
import { FaClock, FaCalendarDay } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function TimetablePage() {
    const [timetable, setTimetable] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(new Date().toLocaleString('en-US', { weekday: 'long' }));

    useEffect(() => {
        // --- DATA FETCHING & PROCESSING (Simulated from localStorage) ---
        const timetableDataString = '{"timetable":[{"timetable_id":1,"teacher_id":"1","subject_id":7,"day_of_week":"Friday","start_time":"10:00:00","end_time":"11:00:00"},{"timetable_id":1,"teacher_id":"2","subject_id":3,"day_of_week":"Friday","start_time":"11:00:00","end_time":"12:00:00"},{"timetable_id":1,"teacher_id":"3","subject_id":4,"day_of_week":"Friday","start_time":"12:00:00","end_time":"13:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":8,"day_of_week":"Friday","start_time":"14:00:00","end_time":"16:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":1,"day_of_week":"Monday","start_time":"09:00:00","end_time":"10:00:00"},{"timetable_id":1,"teacher_id":"2","subject_id":2,"day_of_week":"Monday","start_time":"10:00:00","end_time":"11:00:00"},{"timetable_id":1,"teacher_id":"3","subject_id":3,"day_of_week":"Monday","start_time":"11:00:00","end_time":"12:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":4,"day_of_week":"Monday","start_time":"12:00:00","end_time":"13:00:00"},{"timetable_id":1,"teacher_id":"2","subject_id":5,"day_of_week":"Monday","start_time":"14:00:00","end_time":"15:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":7,"day_of_week":"Thursday","start_time":"09:00:00","end_time":"10:00:00"},{"timetable_id":1,"teacher_id":"2","subject_id":6,"day_of_week":"Thursday","start_time":"10:00:00","end_time":"11:00:00"},{"timetable_id":1,"teacher_id":"3","subject_id":10,"day_of_week":"Thursday","start_time":"11:00:00","end_time":"13:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":7,"day_of_week":"Tuesday","start_time":"09:00:00","end_time":"10:00:00"},{"timetable_id":1,"teacher_id":"2","subject_id":6,"day_of_week":"Tuesday","start_time":"10:00:00","end_time":"11:00:00"},{"timetable_id":1,"teacher_id":"3","subject_id":11,"day_of_week":"Tuesday","start_time":"11:00:00","end_time":"13:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":5,"day_of_week":"Tuesday","start_time":"14:00:00","end_time":"15:00:00"},{"timetable_id":1,"teacher_id":"2","subject_id":9,"day_of_week":"Wednesday","start_time":"09:00:00","end_time":"11:00:00"},{"timetable_id":1,"teacher_id":"3","subject_id":4,"day_of_week":"Wednesday","start_time":"11:00:00","end_time":"12:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":3,"day_of_week":"Wednesday","start_time":"12:00:00","end_time":"13:00:00"},{"timetable_id":1,"teacher_id":"2","subject_id":6,"day_of_week":"Wednesday","start_time":"14:00:00","end_time":"15:00:00"},{"timetable_id":1,"teacher_id":"3","subject_id":5,"day_of_week":"Wednesday","start_time":"15:00:00","end_time":"16:00:00"}]}';
        const subjectsDataString = '{"subjects":[{"subject_id":1,"subject_name":"LLC"},{"subject_id":2,"subject_name":"PDS"},{"subject_id":3,"subject_name":"COA"},{"subject_id":4,"subject_name":"DBMS"},{"subject_id":5,"subject_name":"MS"},{"subject_id":6,"subject_name":"DS"},{"subject_id":7,"subject_name":"DSGT"},{"subject_id":8,"subject_name":"DBMS-Lab"},{"subject_id":9,"subject_name":"DS-Lab"},{"subject_id":10,"subject_name":"COA-Lab"},{"subject_id":11,"subject_name":"PDS-Lab"}]}';
        const teachersDataString = '{"teachers":[{"teacher_id":"1","teacher_name":"Dr. A. Sharma"},{"teacher_id":"2","teacher_name":"Prof. R. Verma"},{"teacher_id":"3","teacher_name":"Dr. S. Gupta"}]}';
        
        const rawTimetable = JSON.parse(timetableDataString).timetable;
        const subjects = JSON.parse(subjectsDataString).subjects;
        const teachers = JSON.parse(teachersDataString).teachers;
        const subjectMap = subjects.reduce((acc, subj) => ({ ...acc, [subj.subject_id]: subj.subject_name }), {});
        const teacherMap = teachers.reduce((acc, t) => ({ ...acc, [t.teacher_id]: t.teacher_name }), {});
        const processedTimetable = rawTimetable.reduce((acc, entry) => {
            const day = entry.day_of_week;
            if (!acc[day]) acc[day] = [];
            acc[day].push({ ...entry, subject_name: subjectMap[entry.subject_id] || 'N/A', teacher_name: teacherMap[entry.teacher_id] || 'N/A' });
            return acc;
        }, {});
        for (const day in processedTimetable) {
            processedTimetable[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
        }
        setTimetable(processedTimetable);
        setIsLoading(false);
    }, []);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const formatTime = (time) => new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center p-20 text-onyx-500 font-bold animate-pulse">Loading Timetable...</div>
            </MainLayout>
        );
    }

    // Determine current active day safely
    const currentActiveDay = daysOfWeek.includes(activeDay) ? activeDay : "Monday";

    return (
        <MainLayout>
            {/* AMBIENT LIGHTING BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden md:block">
                <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-dark-teal-400/20 dark:bg-dark-teal-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '12s' }}></div>
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-stormy-teal-300/30 dark:bg-stormy-teal-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50"></div>
                <div className="absolute inset-0 bg-platinum-50/80 dark:bg-onyx-950/90 backdrop-blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10 text-onyx-900 dark:text-platinum-50">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
                    
                    {/* Header Card */}
                    <motion.div variants={itemVariants} className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl rounded-[2rem] border border-platinum-100 dark:border-onyx-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 md:p-8 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-dark-teal-300/30 to-transparent dark:from-dark-teal-600/20 rounded-full filter blur-3xl opacity-50 pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-onyx-900 to-onyx-600 dark:from-platinum-50 dark:to-platinum-300 mb-2 flex items-center gap-3">
                                <FaCalendarDay className="text-dark-teal-600 dark:text-stormy-teal-400" />
                                My Timetable
                            </h2>
                            <p className="text-onyx-500 dark:text-platinum-300 font-medium">Your weekly academic schedule.</p>
                        </div>
                    </motion.div>
                
                    {/* Mobile Tab View */}
                    <motion.div variants={itemVariants} className="lg:hidden bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl border border-platinum-100 dark:border-onyx-700/50 rounded-3xl shadow-sm dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] p-4 relative overflow-hidden">
                        {/* Tab Switcher */}
                        <div className="border-b border-platinum-200 dark:border-onyx-700/50 pb-2 mb-4">
                            <nav className="-mb-[2px] flex gap-2 overflow-x-auto no-scrollbar" aria-label="Tabs">
                                {daysOfWeek.map(day => (
                                    <button key={day} onClick={() => setActiveDay(day)}
                                        className={`px-4 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap shrink-0 ${activeDay === day ? 'bg-dark-teal-600 text-white shadow-md' : 'text-onyx-500 dark:text-onyx-300 hover:bg-platinum-100 dark:hover:bg-onyx-700'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Mobile Classes Content */}
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {timetable[currentActiveDay]?.length > 0 ? timetable[currentActiveDay].map((entry, index) => (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        key={`${currentActiveDay}-${index}`} 
                                        className="group relative p-5 bg-white/80 dark:bg-onyx-900/60 backdrop-blur-md border border-platinum-100 dark:border-onyx-700/50 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                                    >
                                        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-dark-teal-400 to-dark-teal-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex justify-between items-start mb-2 pl-3">
                                            <p className="font-extrabold text-lg text-onyx-900 dark:text-platinum-50 tracking-tight">{entry.subject_name}</p>
                                        </div>
                                        <div className="pl-3 space-y-1.5">
                                            <p className="text-sm font-semibold text-onyx-600 dark:text-platinum-300 flex items-center gap-2">
                                                <span className="w-5 h-5 rounded bg-platinum-100 dark:bg-onyx-800 flex items-center justify-center text-[10px] text-onyx-500">Dr</span>
                                                {entry.teacher_name}
                                            </p>
                                            <p className="text-sm font-bold text-dark-teal-700 dark:text-stormy-teal-400 flex items-center gap-2 bg-dark-teal-50 dark:bg-stormy-teal-900/30 w-max px-2.5 py-1 rounded-md">
                                                <FaClock /> {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                                            </p>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 text-onyx-500 dark:text-onyx-400 font-bold border border-dashed border-platinum-300 dark:border-onyx-700 rounded-2xl">
                                        No classes scheduled for {currentActiveDay}.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Desktop Grid View (Massive Glassmorphism Table) */}
                    <motion.div variants={itemVariants} className="hidden lg:block bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl border border-platinum-100 dark:border-onyx-700/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-x-auto relative custom-scrollbar">
                        <div className="min-w-[900px]">
                            <div className="grid grid-cols-5 bg-platinum-100/50 dark:bg-onyx-900/50 backdrop-blur-md border-b border-platinum-200 dark:border-onyx-700/50">
                                {daysOfWeek.map(day => (
                                    <div key={day} className="text-center font-extrabold tracking-wide py-4 text-onyx-900 dark:text-platinum-50 border-r border-platinum-200 dark:border-onyx-700/50 last:border-r-0 uppercase text-sm">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-5 h-[65vh] overflow-hidden">
                                {daysOfWeek.map((day, colIdx) => (
                                    <div key={day} className="border-r border-platinum-200/50 dark:border-onyx-700/30 last:border-r-0 p-3 space-y-3 overflow-y-auto custom-scrollbar pb-10 bg-white/20 dark:bg-white/[0.02]">
                                        {timetable[day]?.map((entry, index) => (
                                            <motion.div 
                                                whileHover={{ scale: 1.03, zIndex: 10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)" }}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * colIdx + 0.05 * index }}
                                                key={index} 
                                                className="group relative p-4 bg-white/80 dark:bg-onyx-900/80 backdrop-blur-xl border border-platinum-100 dark:border-onyx-700/60 rounded-xl shadow-sm transition-all cursor-default"
                                            >
                                                {/* Glowing indicator line */}
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dark-teal-400 to-stormy-teal-600 opacity-80 rounded-t-xl group-hover:h-1.5 transition-all"></div>
                                                
                                                <p className="font-extrabold text-sm text-onyx-900 dark:text-platinum-50 pt-1 tracking-tight">{entry.subject_name}</p>
                                                <p className="text-xs font-semibold text-onyx-500 dark:text-onyx-400 mt-1 line-clamp-1">{entry.teacher_name}</p>
                                                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-dark-teal-700 dark:text-stormy-teal-300 bg-dark-teal-50 dark:bg-dark-teal-900/30 px-2 py-1 rounded-md">
                                                    <FaClock className="text-dark-teal-500 dark:text-stormy-teal-400 shrink-0" />
                                                    <span className="truncate">{formatTime(entry.start_time).replace(':00 ', ' ')} - {formatTime(entry.end_time).replace(':00 ', ' ')}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {(!timetable[day] || timetable[day].length === 0) && (
                                            <div className="h-full flex items-center justify-center opacity-30">
                                                <span className="text-sm font-bold text-onyx-400 -rotate-90 whitespace-nowrap">Free Day</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </MainLayout>
    );
}