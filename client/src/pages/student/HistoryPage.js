import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/student/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { getAttendanceHistory } from '../../api/studentService';
import { FaClock, FaCalendarDay, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const HistoryPage = () => {
    const { subjectId } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Determine limit: 30 for specific subject, 20 for global
                const limit = subjectId ? 30 : 20;
                const data = await getAttendanceHistory(limit, subjectId);
                setHistory(data.history || []);
            } catch (err) {
                setError(err.message || 'Failed to load history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [subjectId]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
    };

    if (loading) return <MainLayout><div className="flex items-center justify-center p-20 text-onyx-500 font-bold animate-pulse">Loading History...</div></MainLayout>;
    if (error) return <MainLayout><div className="flex items-center justify-center p-20 text-red-500 font-bold">{error}</div></MainLayout>;

    return (
        <MainLayout>
            {/* AMBIENT LIGHTING BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden md:block">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-dark-teal-400/20 dark:bg-dark-teal-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '10s' }}></div>
                <div className="absolute inset-0 bg-platinum-50/80 dark:bg-onyx-950/90 backdrop-blur-3xl"></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10 text-onyx-900 dark:text-platinum-50">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-2">
                        {subjectId && (
                            <Link to="/student/attendance" className="p-3 rounded-full bg-white/60 dark:bg-onyx-800/40 backdrop-blur-md border border-platinum-200 dark:border-onyx-700 shadow-sm hover:bg-white dark:hover:bg-onyx-700 transition">
                                <FaArrowLeft className="text-onyx-600 dark:text-platinum-200" />
                            </Link>
                        )}
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-onyx-900 to-onyx-600 dark:from-platinum-50 dark:to-platinum-300">
                                {subjectId ? 'Subject History' : 'Recent History'}
                            </h2>
                            <p className="text-onyx-500 dark:text-platinum-300 font-medium">
                                {subjectId ? 'Top 30 recent lectures' : 'Top 20 most recently attended lectures'}
                            </p>
                        </div>
                    </div>

                    {/* Timeline / Cards */}
                    {history.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            <AnimatePresence>
                                {history.map((record, idx) => (
                                    <motion.div layout key={record.id} variants={itemVariants} className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl border border-platinum-100 dark:border-onyx-700/50 rounded-2xl shadow-sm hover:shadow-md p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all group overflow-hidden relative">
                                        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-dark-teal-400 to-dark-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        
                                        <div className="flex flex-col pl-2 md:pl-0">
                                            <h3 className="font-extrabold text-lg text-onyx-900 dark:text-platinum-50 tracking-tight flex items-center gap-2">
                                                {record.status === 'PRESENT' ? <FaCheckCircle className="text-green-500" /> : <FaExclamationCircle className="text-amber-500" />}
                                                {record.subjectName} <span className="text-sm font-semibold opacity-60">({record.subjectCode})</span>
                                            </h3>
                                        </div>

                                        <div className="flex items-center flex-wrap gap-3 md:gap-4 text-sm font-semibold text-onyx-600 dark:text-platinum-300">
                                            <div className="flex items-center gap-2 bg-platinum-100/70 dark:bg-onyx-900/70 px-3 py-1.5 rounded-lg border border-platinum-200/50 dark:border-onyx-800/50">
                                                <FaCalendarDay className="opacity-70" /> {record.day}, {record.date}
                                            </div>
                                            <div className="flex items-center gap-2 bg-platinum-100/70 dark:bg-onyx-900/70 px-3 py-1.5 rounded-lg border border-platinum-200/50 dark:border-onyx-800/50">
                                                <FaClock className="opacity-70" /> {record.time}
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-lg border ${record.status === 'PRESENT' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                                                {record.status}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/40 dark:bg-onyx-800/20 backdrop-blur-lg rounded-[2rem] border border-dashed border-platinum-300 dark:border-onyx-700">
                            <p className="text-xl font-bold text-onyx-500 dark:text-onyx-400">No recent history found.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </MainLayout>
    );
};
export default HistoryPage;
