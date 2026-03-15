import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FaUserCheck, FaUserSlash, FaTimes, FaVideo, FaWifi, FaUserMinus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const initialStudents = [
    { id: 'S01', name: 'Rohan Kumar' }, { id: 'S02', name: 'Priya Singh' }, { id: 'S03', name: 'Amit Kumar' }, 
    { id: 'S04', name: 'Anjali Gupta' },{ id: 'S05', name: 'Suresh Patel' }, { id: 'S06', name: 'Meena Reddy' },
    { id: 'S07', name: 'Vikram Sharma' },{ id: 'S08', name: 'Sneha Joshi' },{ id: 'S09', name: 'Rajesh Verma' },
    { id: 'S10', name: 'Pooja Desai' },{ id: 'S11', name: 'Arjun Mehta' },{ id: 'S12', name: 'Kavita Iyer' },
    { id: 'S13', name: 'Manoj Nair' },{ id: 'S14', name: 'Sunita Rao' },{ id: 'S15', name: 'Deepak Choudhary' },
    { id: 'S16', name: 'Neha Agarwal' },{ id: 'S17', name: 'Sanjay Krishnan' },{ id: 'S18', name: 'Geeta Patil' },
    { id: 'S19', name: 'Harish Reddy' },{ id: 'S20', name: 'Lata Menon' }
];

export default function LiveSessionPage() {
    const { classId } = useParams(); 
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [qrToken, setQrToken] = useState('generating...');
    const [presentStudents, setPresentStudents] = useState([]);
    const [absentStudents, setAbsentStudents] = useState([]);
    const simulationStudentQueue = useRef([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setAbsentStudents(initialStudents);
            simulationStudentQueue.current = [...initialStudents]; 
            setQrToken(Math.random().toString(36).substring(2));
            setIsLoading(false);
        };
        fetchInitialData();
        const qrRefreshInterval = setInterval(() => {
            setQrToken(Math.random().toString(36).substring(2));
        }, 15000);
        return () => clearInterval(qrRefreshInterval);
    }, [classId]);

    useEffect(() => {
        const simulationInterval = setInterval(() => {
            if (simulationStudentQueue.current.length > 0) {
                // Determine batch size (1 to 3 students joining at once)
                const batchSize = Math.floor(Math.random() * 3) + 1;
                const newStudents = [];
                for(let i=0; i<batchSize && simulationStudentQueue.current.length > 0; i++) {
                    newStudents.push(simulationStudentQueue.current.shift());
                }
                
                setPresentStudents(prev => [...newStudents, ...prev]);
                setAbsentStudents(prev => {
                    const newIds = newStudents.map(s => s.id);
                    return prev.filter(s => !newIds.includes(s.id));
                });
            } else {
                clearInterval(simulationInterval);
            }
        }, 3000); // Shorter interval for testing
        return () => clearInterval(simulationInterval);
    }, []);

    const handleManualMarkPresent = (studentToMark) => {
        simulationStudentQueue.current = simulationStudentQueue.current.filter(s => s.id !== studentToMark.id);
        setAbsentStudents(current => current.filter(s => s.id !== studentToMark.id));
        setPresentStudents(current => [studentToMark, ...current]);
    };
    
    const handleManualMarkAbsent = (studentToMark) => {
        setPresentStudents(current => current.filter(s => s.id !== studentToMark.id));
        setAbsentStudents(current => [studentToMark, ...current]);
    };

    const handleEndSession = () => {
        if(window.confirm("Are you sure you want to end this live session? All attendance changes will be finalized.")) {
            alert(`Session Ended. Final Attendance: ${presentStudents.length}/${initialStudents.length}`);
            navigate('/faculty/dashboard');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[70vh] items-center justify-center gap-4 text-onyx-400 font-bold uppercase tracking-widest text-sm animate-pulse">
                <span className="w-10 h-10 border-4 border-onyx-200 border-t-dark-teal-500 rounded-full animate-spin"></span>
                Creating Secure Room...
            </div>
        );
    }
    
    const totalStudents = initialStudents.length;
    const attendancePercentage = presentStudents.length === 0 ? 0 : Math.round((presentStudents.length / totalStudents) * 100);

    return (
        <div className="relative pb-10">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden lg:block">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-red-400/10 dark:bg-red-700/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: '6s' }}></div>
            </div>

            <div className="flex flex-col gap-6 relative z-10 w-full text-onyx-900 dark:text-platinum-50">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/10 backdrop-blur-xl border border-red-200 dark:border-red-900/30 shadow-sm rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="flex items-center gap-4 z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-onyx-900 flex items-center justify-center shadow-inner border border-red-200 dark:border-red-900/50">
                            <FaVideo className="text-red-500 text-2xl animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">Live Recording</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-onyx-900 dark:text-platinum-50 leading-none">Session: {classId}</h2>
                        </div>
                    </div>

                    <button 
                        onClick={handleEndSession}
                        className="w-full md:w-auto z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3.5 rounded-xl font-extrabold uppercase tracking-wide shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
                    >
                        <FaTimes className="text-lg" /> End Session
                    </button>
                </motion.div>

                {/* Primary Grid Layout - Made Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN: QR & Metrics */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        className="lg:col-span-1 flex flex-col gap-6 h-full"
                    >
                        {/* Dynamic QR Card */}
                        <div className="bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-6 md:p-8 shadow-sm text-center flex flex-col items-center">
                            <div className="mb-4 flex flex-col items-center">
                                <FaWifi className="text-dark-teal-500 text-2xl mb-2 animate-pulse" />
                                <h3 className="text-xl font-black text-onyx-900 dark:text-platinum-50 tracking-tight">Active Scan Beacon</h3>
                                <p className="text-xs font-bold text-onyx-500 uppercase tracking-widest mt-1">Code rotates every 15s</p>
                            </div>
                            
                            <div className="p-4 bg-white/90 border border-platinum-200 dark:border-onyx-800 rounded-2xl shadow-inner mt-2 mb-4 inline-block relative group">
                                <div className="absolute inset-0 border-2 border-dark-teal-500/30 rounded-2xl animate-ping opacity-20 hidden md:block group-hover:block"></div>
                                <QRCodeSVG value={qrToken} size={180} className="relative z-10" />
                            </div>
                        </div>

                        {/* Live Metrics Card */}
                        <div className="bg-gradient-to-br from-dark-teal-600 to-stormy-teal-800 text-white rounded-[2rem] p-6 md:p-8 shadow-lg relative overflow-hidden flex-grow flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-extrabold text-lg tracking-tight mb-2 opacity-90">Live Presence</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-6xl md:text-7xl font-black">{presentStudents.length}</span>
                                <span className="text-2xl font-bold opacity-60">/ {totalStudents}</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-black/20 rounded-full h-2 mt-4 overflow-hidden border border-white/10">
                                <div 
                                    className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${attendancePercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Student Lists */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="lg:col-span-2 flex flex-col gap-6 h-full"
                    >
                        {/* Split List Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            
                            {/* Present List */}
                            <div className="bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-4 lg:p-6 shadow-sm flex flex-col h-[500px] lg:h-auto">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                        <FaUserCheck /> Verified ({presentStudents.length})
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                                    <AnimatePresence>
                                        {presentStudents.map((student) => (
                                            <motion.div 
                                                key={student.id}
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center justify-between bg-white dark:bg-onyx-900 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-xl shadow-sm group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center text-xs">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-onyx-900 dark:text-platinum-50">{student.name}</p>
                                                        <p className="text-[10px] font-black text-onyx-400 uppercase">{student.id}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleManualMarkAbsent(student)}
                                                    className="opacity-0 group-hover:opacity-100 md:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Mark Absent"
                                                >
                                                    <FaUserMinus className="text-sm" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Absent List */}
                            <div className="bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-4 lg:p-6 shadow-sm flex flex-col h-[500px] lg:h-auto">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <FaUserSlash /> Pending ({absentStudents.length})
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                                    <AnimatePresence>
                                        {absentStudents.map((student) => (
                                            <motion.div 
                                                key={student.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center justify-between bg-white dark:bg-onyx-900 border border-red-100 dark:border-red-900/30 p-3 rounded-xl shadow-sm group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-black flex items-center justify-center text-xs">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-onyx-900 dark:text-platinum-50 opacity-70">{student.name}</p>
                                                        <p className="text-[10px] font-black text-onyx-400 uppercase">{student.id}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleManualMarkPresent(student)}
                                                    className="opacity-0 group-hover:opacity-100 md:opacity-100 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all border border-emerald-200 dark:border-emerald-800/50"
                                                >
                                                    Mark Present
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}