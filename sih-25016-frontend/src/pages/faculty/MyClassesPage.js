import React, { useState, useEffect } from 'react';
import { FaClock, FaCalendarDay, FaUserGraduate, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ClassCard = ({ entry, index }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, type: "spring", stiffness: 100, damping: 15 }}
            whileHover={{ y: -2, scale: 1.01 }}
            className="group relative flex flex-col p-4 sm:p-5 bg-white dark:bg-onyx-800 border border-platinum-200 dark:border-onyx-700 rounded-2xl shadow-sm hover:shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all w-full"
        >
            {/* Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dark-teal-400 to-stormy-teal-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1 pr-3">
                    <h4 className="font-extrabold text-[15px] sm:text-base tracking-tight text-onyx-900 dark:text-platinum-50 group-hover:text-dark-teal-700 dark:group-hover:text-platinum-200 transition-colors leading-snug">{entry.subject_name}</h4>
                    <span className="text-[10px] font-black text-onyx-600 dark:text-onyx-400 uppercase tracking-widest bg-platinum-100 dark:bg-onyx-900 px-2.5 py-1 rounded-md border border-platinum-200 dark:border-onyx-800 w-max shrink-0">Div {entry.division}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-platinum-50 dark:bg-onyx-900 flex items-center justify-center border border-platinum-200 dark:border-onyx-700 shrink-0">
                    <FaUserGraduate className="text-dark-teal-600 dark:text-dark-teal-400 text-base" />
                </div>
            </div>
            
            <div className="mt-auto pt-3 border-t border-platinum-100 dark:border-onyx-700/60 flex items-center justify-between">
                <p className="text-[13px] font-bold text-onyx-500 dark:text-onyx-400 flex items-center gap-1.5">
                    <FaClock className="text-dark-teal-500" /> 
                    {entry.start_time.substring(0,5)} - {entry.end_time.substring(0,5)}
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-dark-teal-600 dark:text-dark-teal-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all flex items-center gap-1">
                    Details <FaChevronRight />
                </button>
            </div>
        </motion.div>
    );
};

export default function MyClassesPage() {
    const [timetable, setTimetable] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(new Date().toLocaleString('en-US', { weekday: 'long' }));

    useEffect(() => {
        // --- DATA FETCHING & PROCESSING (Simulated) ---
        setTimeout(() => {
            const loggedInTeacherDataString = '{"first_name":"Anjali","middle_name":"","last_name":"Sharma","teacher_id":"1","date_of_birth":"1985-08-22","gender":"female","department":"Computer Engineering"}';
            const timetableDataString = '{"timetable":[{"timetable_id":1,"teacher_id":"1","subject_id":7,"day_of_week":"Friday","start_time":"10:00:00","end_time":"11:00:00"},{"timetable_id":2,"teacher_id":"2","subject_id":3,"day_of_week":"Friday","start_time":"11:00:00","end_time":"12:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":8,"day_of_week":"Friday","start_time":"14:00:00","end_time":"16:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":1,"day_of_week":"Monday","start_time":"09:00:00","end_time":"10:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":4,"day_of_week":"Monday","start_time":"12:00:00","end_time":"13:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":7,"day_of_week":"Thursday","start_time":"09:00:00","end_time":"10:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":7,"day_of_week":"Tuesday","start_time":"09:00:00","end_time":"10:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":5,"day_of_week":"Tuesday","start_time":"14:00:00","end_time":"15:00:00"},{"timetable_id":1,"teacher_id":"1","subject_id":3,"day_of_week":"Wednesday","start_time":"12:00:00","end_time":"13:00:00"}]}';
            const subjectsDataString = '{"subjects":[{"subject_id":1,"subject_name":"Linear Algebra"},{"subject_id":2,"subject_name":"PDS"},{"subject_id":3,"subject_name":"Computer Architecture"},{"subject_id":4,"subject_name":"Database Systems"},{"subject_id":5,"subject_name":"Management Science"},{"subject_id":6,"subject_name":"DS"},{"subject_id":7,"subject_name":"Data Structures"},{"subject_id":8,"subject_name":"Database Lab"},{"subject_id":9,"subject_name":"DS-Lab"},{"subject_id":10,"subject_name":"COA-Lab"},{"subject_id":11,"subject_name":"PDS-Lab"}]}';
            const divisionsMock = { 1: 'A', 2: 'B', 3: 'C' };

            const loggedInTeacher = JSON.parse(loggedInTeacherDataString);
            const currentTeacherId = loggedInTeacher.teacher_id;
            const rawTimetable = JSON.parse(timetableDataString).timetable;
            const subjects = JSON.parse(subjectsDataString).subjects;

            const filteredTimetable = rawTimetable.filter(entry => entry.teacher_id === currentTeacherId);
            const subjectMap = subjects.reduce((acc, subj) => ({ ...acc, [subj.subject_id]: subj.subject_name }), {});
            
            const processedTimetable = filteredTimetable.reduce((acc, entry) => {
                const day = entry.day_of_week;
                if (!acc[day]) acc[day] = [];
                acc[day].push({ ...entry, subject_name: subjectMap[entry.subject_id] || 'N/A', division: divisionsMock[entry.timetable_id] || 'N/A' });
                return acc;
            }, {});

            for (const day in processedTimetable) {
                processedTimetable[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
            }

            // Ensure all days exist
            const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            week.forEach(d => { if(!processedTimetable[d]) processedTimetable[d] = []; });

            setTimetable(processedTimetable);
            setIsLoading(false);
        }, 500);
    }, []);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-onyx-400 dark:text-onyx-500 font-bold uppercase tracking-widest text-sm animate-pulse">
                    <span className="w-10 h-10 border-4 border-onyx-200 dark:border-onyx-800 border-t-dark-teal-500 rounded-full animate-spin"></span>
                    Loading Timetable...
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* SUBTLE AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden lg:block">
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-dark-teal-400/10 dark:bg-dark-teal-700/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-stormy-teal-300/20 dark:bg-stormy-teal-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50"></div>
            </div>

            <div className="flex flex-col gap-6 relative z-10 w-full text-onyx-900 dark:text-platinum-50">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-onyx-800/60 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 shadow-sm rounded-3xl p-6 md:p-8"
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-platinum-100 dark:bg-onyx-900 flex items-center justify-center border border-platinum-200 dark:border-onyx-700">
                            <FaCalendarDay className="text-dark-teal-600 dark:text-dark-teal-400 text-2xl" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-onyx-900 dark:text-platinum-50">Master Routine</h2>
                    </div>
                </motion.div>

                {/* Mobile/Tablet Segmented Control & Grid */}
                <div className="lg:hidden flex flex-col gap-6">
                    {/* Navigation Container */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-2 p-1.5 bg-platinum-200/50 dark:bg-onyx-900/50 rounded-2xl border border-platinum-300/50 dark:border-onyx-800/50">
                        {daysOfWeek.map(day => (
                            <button 
                                key={day} 
                                onClick={() => setActiveDay(day)}
                                className={`relative px-6 py-3 rounded-xl font-bold tracking-wide shrink-0 transition-colors z-10 snap-center ${activeDay === day ? 'text-white' : 'text-onyx-600 dark:text-onyx-400 hover:text-onyx-900 dark:hover:text-platinum-200'}`}
                            >
                                {activeDay === day && (
                                    <motion.div
                                        layoutId="activeTabletTab"
                                        className="absolute inset-0 bg-onyx-900 dark:bg-dark-teal-600 rounded-xl -z-10 shadow-sm"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                {day}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {timetable[activeDay] && timetable[activeDay].length > 0 ? timetable[activeDay].map((entry, index) => (
                                <ClassCard key={`${activeDay}-${index}`} entry={entry} index={index} />
                            )) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="col-span-full flex flex-col items-center justify-center p-10 bg-white dark:bg-onyx-800 border border-dashed border-platinum-300 dark:border-onyx-700 rounded-3xl"
                                >
                                    <div className="w-14 h-14 rounded-full bg-platinum-100 dark:bg-onyx-900 flex items-center justify-center mb-3 text-onyx-400 text-xl">
                                        <FaCalendarDay />
                                    </div>
                                    <p className="font-bold text-onyx-600 dark:text-onyx-300 text-lg">No classes scheduled</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Laptop First: Highly Structured Container Grid */}
                <div className="hidden lg:block overflow-x-auto relative custom-scrollbar pb-4">
                    <div className="min-w-[1000px] grid grid-cols-5 gap-4">
                        {daysOfWeek.map((day, dayIndex) => (
                            <div key={day} className="flex flex-col bg-platinum-200/30 dark:bg-onyx-900/30 border border-platinum-200 dark:border-onyx-800/60 rounded-[2rem] p-3 shadow-inner min-h-[60vh] max-h-[80vh]">
                                
                                {/* Column Header */}
                                <div className="bg-white dark:bg-onyx-800 border border-platinum-200 dark:border-onyx-700 shadow-sm rounded-[1.25rem] p-4 text-center mb-4 shrink-0 flex flex-col items-center gap-1 relative overflow-hidden">
                                    {timetable[day]?.length > 0 && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dark-teal-400 to-stormy-teal-600"></div>}
                                    <h3 className="font-black text-[17px] text-onyx-900 dark:text-platinum-50 tracking-tight">{day}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-onyx-500 bg-platinum-100 dark:bg-onyx-900/60 px-2 py-0.5 rounded-md">
                                        {timetable[day]?.length || 0} Sessions
                                    </p>
                                </div>
                                
                                {/* Column Content Area */}
                                <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-2 custom-scrollbar flex-grow">
                                    {timetable[day] && timetable[day].length > 0 ? timetable[day].map((entry, index) => (
                                        <ClassCard key={`desktop-${day}-${index}`} entry={entry} index={(dayIndex * 0.5) + index} />
                                    )) : (
                                        <div className="h-full flex flex-col items-center justify-center p-4 text-center opacity-60">
                                            <div className="w-12 h-12 rounded-full bg-platinum-200 dark:bg-onyx-800 flex items-center justify-center mb-2 border border-platinum-300 dark:border-onyx-700">
                                                <FaCalendarDay className="text-onyx-400 dark:text-onyx-500" />
                                            </div>
                                            <p className="text-sm font-bold text-onyx-600 dark:text-onyx-400">Clear</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}