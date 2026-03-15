import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserGraduate, FaCalendarPlus, FaCheckCircle, FaTimesCircle, FaClock, FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';

// MOCK DATA for Student Leave Requests
const mockStudentRequests = [
    { id: 1, studentName: 'Rahul Kumar', rollNo: '24BCS102', type: 'Medical Leave', days: 3, dates: '10 Oct - 12 Oct', reason: 'Viral Fever, doctor advised rest.', status: 'Pending', avatarMatch: 'RK' },
    { id: 2, studentName: 'Sneha Patel', rollNo: '24BCS089', type: 'Duty Leave', days: 1, dates: '15 Oct', reason: 'Attending Inter- कॉलेज Hackathon at IIT Bombay.', status: 'Pending', avatarMatch: 'SP' },
    { id: 3, studentName: 'Aditya Verma', rollNo: '24BCS144', type: 'Casual Leave', days: 2, dates: '18 Oct - 19 Oct', reason: 'Family gathering in hometown.', status: 'Pending', avatarMatch: 'AV' },
];

// MOCK DATA for Faculty's own leaves
const mockMyHistory = [
    { type: 'Casual Leave (CL)', startDate: '12 Oct, 2024', endDate: '14 Oct, 2024', status: 'Approved' },
    { type: 'Medical Leave (ML)', startDate: '03 Sep, 2024', endDate: '05 Sep, 2024', status: 'Approved' },
];

export default function LeaveManagementPage() {
    const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' or 'apply'
    const [leaveType, setLeaveType] = useState('Casual Leave (CL)');
    const [studentRequests, setStudentRequests] = useState(mockStudentRequests);

    const handleTeacherSubmit = (e) => {
        e.preventDefault();
        alert("Your leave request has been submitted to the HOD.");
    };

    const handleAction = (id, action) => {
        // In real app, this would hit API. For now, filter it out of pending list.
        setStudentRequests(prev => prev.filter(req => req.id !== id));
    };

    // Shared Form Components
    const GlassInput = ({ label, type = "text", ...props }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-onyx-600 dark:text-onyx-400 pl-1">{label}</label>
            <input type={type} className="w-full bg-white/50 dark:bg-onyx-900/50 backdrop-blur-sm border border-platinum-200 dark:border-onyx-700/60 rounded-xl px-4 py-3 text-sm font-bold text-onyx-900 dark:text-platinum-50 focus:outline-none focus:ring-2 focus:ring-dark-teal-500/50 transition-all shadow-inner" {...props} />
        </div>
    );
    const GlassTextarea = ({ label, ...props }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black uppercase tracking-[0.15em] text-onyx-600 dark:text-onyx-400 pl-1">{label}</label>
            <textarea className="w-full bg-white/50 dark:bg-onyx-900/50 backdrop-blur-sm border border-platinum-200 dark:border-onyx-700/60 rounded-xl px-4 py-3 text-sm font-bold text-onyx-900 dark:text-platinum-50 focus:outline-none focus:ring-2 focus:ring-dark-teal-500/50 transition-all shadow-inner resize-none min-h-[120px]" {...props} />
        </div>
    );

    return (
        <div className="relative pb-10">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden lg:block">
                <div className="absolute top-[20%] right-[30%] w-[500px] h-[500px] bg-dark-teal-400/10 dark:bg-dark-teal-700/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70"></div>
            </div>

            <div className="flex flex-col gap-6 relative z-10 w-full text-onyx-900 dark:text-platinum-50">
                
                {/* Header & Master Tab Switcher */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-onyx-800/60 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 shadow-sm rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex items-center gap-4 z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dark-teal-400 to-stormy-teal-600 text-white flex items-center justify-center shadow-lg border border-platinum-200 dark:border-onyx-700">
                            {activeTab === 'approvals' ? <FaCheckCircle className="text-2xl" /> : <FaCalendarPlus className="text-2xl" />}
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-onyx-900 dark:text-platinum-50">Leave Management</h2>
                            <p className="text-xs font-bold text-onyx-500 uppercase tracking-widest mt-1">
                                {activeTab === 'approvals' ? 'Review Student Requests' : 'Apply For Personal Leave'}
                            </p>
                        </div>
                    </div>

                    {/* Highly Styled Segmented Control */}
                    <div className="flex bg-platinum-200/50 dark:bg-onyx-900/50 p-1.5 rounded-[1.25rem] border border-platinum-300/50 dark:border-onyx-800/50 relative z-10 w-full md:w-auto">
                        <button 
                            onClick={() => setActiveTab('approvals')}
                            className={`flex-1 md:w-48 relative px-6 py-3 rounded-xl font-black tracking-wide shrink-0 transition-colors z-10 flex flex-col items-center justify-center gap-1 ${activeTab === 'approvals' ? 'text-white' : 'text-onyx-500 hover:text-onyx-800 dark:text-onyx-400 dark:hover:text-platinum-200'}`}
                        >
                            {activeTab === 'approvals' && (
                                <motion.div layoutId="leaveMasterTab" className="absolute inset-0 bg-onyx-900 dark:bg-dark-teal-600 rounded-xl -z-10 shadow-md" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                            )}
                            Student Approvals
                            {studentRequests.length > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('apply')}
                            className={`flex-1 md:w-48 relative px-6 py-3 rounded-xl font-black tracking-wide shrink-0 transition-colors z-10 flex flex-col items-center justify-center gap-1 ${activeTab === 'apply' ? 'text-white' : 'text-onyx-500 hover:text-onyx-800 dark:text-onyx-400 dark:hover:text-platinum-200'}`}
                        >
                            {activeTab === 'apply' && (
                                <motion.div layoutId="leaveMasterTab" className="absolute inset-0 bg-onyx-900 dark:bg-dark-teal-600 rounded-xl -z-10 shadow-md" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                            )}
                            My Leaves
                        </button>
                    </div>
                </motion.div>

                {/* DYNAMIC CONTENT AREA */}
                <AnimatePresence mode="wait">

                    {/* ============== TAB 1: STUDENT APPROVALS ============== */}
                    {activeTab === 'approvals' && (
                        <motion.div 
                            key="approvals"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="bg-platinum-200/30 dark:bg-onyx-900/30 border border-platinum-200 dark:border-onyx-800/60 rounded-[2rem] p-4 lg:p-6 shadow-inner min-h-[60vh] flex flex-col gap-4"
                        >
                            <div className="flex items-center justify-between px-2 mb-2">
                                <h3 className="font-black text-lg text-onyx-900 dark:text-platinum-50 tracking-tight flex items-center gap-2">
                                    <FaUserGraduate className="text-dark-teal-500" /> Pending Approval Queue
                                </h3>
                                <span className="text-[10px] font-black uppercase tracking-widest text-dark-teal-600 dark:text-dark-teal-400 bg-white dark:bg-onyx-800 px-3 py-1.5 rounded-lg border border-platinum-200 dark:border-onyx-700 shadow-sm">
                                    {studentRequests.length} Requests
                                </span>
                            </div>

                            {studentRequests.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {studentRequests.map((req, index) => (
                                            <motion.div 
                                                key={req.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white/90 dark:bg-onyx-800/90 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700 rounded-2xl p-5 shadow-md flex flex-col relative group"
                                            >
                                                {/* Header / Student Info */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-3 items-center">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-black text-indigo-700 dark:text-indigo-400">
                                                            {req.avatarMatch}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-extrabold text-onyx-900 dark:text-platinum-50 leading-tight">{req.studentName}</h4>
                                                            <p className="text-[11px] font-black uppercase tracking-widest text-onyx-500">{req.rollNo}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Leave Details Box */}
                                                <div className="bg-platinum-50 dark:bg-onyx-900 rounded-xl p-4 border border-platinum-200 dark:border-onyx-800 mb-4 flex-grow">
                                                    <div className="flex justify-between items-center mb-2 border-b border-platinum-200 dark:border-onyx-800 pb-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-dark-teal-600 dark:text-dark-teal-400">{req.type}</span>
                                                        <span className="text-xs font-bold flex items-center gap-1 text-onyx-600 dark:text-onyx-400">
                                                            <FaClock /> {req.days} Day{req.days > 1 ? 's': ''}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-onyx-800 dark:text-onyx-200 mb-2">{req.dates}</p>
                                                    <p className="text-xs text-onyx-600 dark:text-onyx-400 leading-relaxed italic border-l-2 border-dark-teal-400 pl-2">"{req.reason}"</p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                                                    <button 
                                                        onClick={() => handleAction(req.id, 'reject')}
                                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        <FaTimes /> Reject
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(req.id, 'approve')}
                                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-transform active:scale-95"
                                                    >
                                                        <FaCheck /> Approve
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center flex-grow p-10 bg-white/50 dark:bg-onyx-800/30 border border-dashed border-platinum-300 dark:border-onyx-700 rounded-[1.5rem]"
                                >
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 text-emerald-500 text-3xl">
                                        <FaCheckCircle />
                                    </div>
                                    <h3 className="font-extrabold text-xl text-onyx-900 dark:text-platinum-50 mb-1">You're all caught up!</h3>
                                    <p className="font-semibold text-onyx-500 dark:text-onyx-400">There are no pending student leave requests requiring your approval.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ============== TAB 2: MY LEAVES ============== */}
                    {activeTab === 'apply' && (
                        <motion.div 
                            key="apply"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                            {/* Form */}
                            <div className="lg:col-span-2 bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-6 lg:p-8 shadow-sm flex flex-col">
                                <h3 className="text-xl font-extrabold tracking-tight text-onyx-900 dark:text-platinum-50 mb-6">File New Request</h3>
                                <form onSubmit={handleTeacherSubmit} className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-[0.15em] text-onyx-600 dark:text-onyx-400 pl-1">Leave Type</label>
                                        <select 
                                            value={leaveType} onChange={(e) => setLeaveType(e.target.value)}
                                            className="w-full bg-white/50 dark:bg-onyx-900/50 backdrop-blur-sm border border-platinum-200 dark:border-onyx-700/60 rounded-xl px-4 py-3 text-sm font-bold text-onyx-900 dark:text-platinum-50 focus:outline-none focus:ring-2 focus:ring-dark-teal-500/50 transition-all shadow-inner"
                                        >
                                            <option>Casual Leave (CL)</option>
                                            <option>Medical Leave (ML)</option>
                                            <option>Duty Leave (DL)</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <GlassInput label="Start Date" type="date" required />
                                        <GlassInput label="End Date" type="date" required />
                                    </div>
                                    <GlassTextarea label="Reason / Remarks" placeholder="State your reason..." required />
                                    <button type="submit" className="mt-4 w-full bg-gradient-to-r from-dark-teal-500 to-stormy-teal-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_8px_30px_rgba(27,218,228,0.2)] hover:shadow-[0_8px_30px_rgba(27,218,228,0.4)] transition-all active:scale-[0.98]">
                                        Submit Request to HOD
                                    </button>
                                </form>
                            </div>

                            {/* History Timeline */}
                            <div className="lg:col-span-1 bg-platinum-200/30 dark:bg-onyx-900/30 border border-platinum-200 dark:border-onyx-800/60 rounded-[2rem] p-4 shadow-inner">
                                <div className="bg-white dark:bg-onyx-800 border border-platinum-200 dark:border-onyx-700 shadow-sm rounded-xl p-4 mb-4 flex items-center gap-3">
                                    <FaCalendarAlt className="text-indigo-500" />
                                    <h3 className="font-black text-sm uppercase tracking-widest text-onyx-900 dark:text-platinum-50">My History</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {mockMyHistory.map((req, i) => (
                                        <div key={i} className="bg-white dark:bg-onyx-800 border-l-4 border-emerald-500 rounded-xl p-3 shadow-sm">
                                            <p className="font-extrabold text-sm text-onyx-900 dark:text-platinum-50">{req.type}</p>
                                            <p className="text-xs text-onyx-500">{req.startDate} - {req.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}