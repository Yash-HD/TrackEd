import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaBirthdayCake, FaUser, FaLock, FaIdBadge, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// Shared styled input component
const GlassInput = ({ label, icon: Icon, type = "text", disabled = false, ...props }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[11px] font-black uppercase tracking-[0.15em] text-onyx-600 dark:text-onyx-400 pl-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx-400 dark:text-onyx-500 z-10" />}
            <input 
                type={type} 
                disabled={disabled}
                className={`w-full bg-white/50 dark:bg-onyx-900/50 backdrop-blur-sm border border-platinum-200 dark:border-onyx-700/60 rounded-xl py-3 pr-4 text-sm font-bold text-onyx-900 dark:text-platinum-50 focus:outline-none transition-all shadow-inner
                ${Icon ? 'pl-11' : 'pl-4'}
                ${disabled ? 'opacity-70 cursor-not-allowed text-onyx-500 dark:text-onyx-400' : 'focus:ring-2 focus:ring-dark-teal-500/50 focus:bg-white dark:focus:bg-onyx-800 hover:border-dark-teal-400/50'}`}
                {...props}
            />
        </div>
    </div>
);

export default function FacultyProfilePage() {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            const mockData = {
                first_name: "Anjali",
                middle_name: "",
                last_name: "Sharma",
                employee_id: "FACULTY01",
                date_of_birth: "1985-08-22",
                gender: "female",
                department: "Computer Engineering"
            };
            setUserData(mockData);
            setIsLoading(false);
        }, 800);
    }, []);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        alert("Password update logic to be connected!");
    };

    if (isLoading || !userData) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-onyx-400 dark:text-onyx-500 font-bold uppercase tracking-widest text-sm animate-pulse">
                    <span className="w-10 h-10 border-4 border-onyx-200 dark:border-onyx-800 border-t-dark-teal-500 rounded-full animate-spin"></span>
                    Loading Identity Data...
                </div>
            </div>
        );
    }

    const fullName = `Dr. ${userData.first_name} ${userData.last_name}`;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1bdae4&color=fff&size=256&bold=true`;
    const formattedDob = new Date(userData.date_of_birth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="relative pb-10">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden lg:block">
                <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] bg-dark-teal-400/10 dark:bg-dark-teal-700/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70"></div>
            </div>

            <div className="flex flex-col gap-6 relative z-10 w-full text-onyx-900 dark:text-platinum-50">
                
                {/* Header Profile Identity Row */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring" }}
                    className="bg-gradient-to-r from-dark-teal-700 to-stormy-teal-800 rounded-3xl p-8 shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        {/* Avatar Frame */}
                        <div className="relative group shrink-0">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-50"></div>
                            <img src={avatarUrl} alt="Avatar" className="relative w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl object-cover" />
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-stormy-teal-800 rounded-full"></div>
                        </div>

                        {/* Title Info */}
                        <div className="flex flex-col items-center md:items-start text-white pt-2">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black tracking-tight">{fullName}</h1>
                                <FaCheckCircle className="text-dark-teal-300 text-xl" title="Verified Identity" />
                            </div>
                            <p className="text-platinum-200 font-bold uppercase tracking-widest text-xs mb-4">Sr. Assistant Professor</p>
                            
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                                    <FaBuilding className="text-dark-teal-300" /> {userData.department}
                                </span>
                                <span className="bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                                    <FaIdBadge className="text-dark-teal-300" /> {userData.employee_id}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left: Restricted Data */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        className="bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-6 lg:p-8 shadow-sm flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-3 border-b border-platinum-200 dark:border-onyx-700 pb-4">
                            <FaUser className="text-dark-teal-500 text-xl" />
                            <h3 className="text-xl font-extrabold tracking-tight">Personal Identity Data</h3>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex items-start gap-3">
                            <FaExclamationTriangle className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Personal identity records are locked. Contact the administrative block to initiate a data modification request.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <GlassInput label="First Name" value={userData.first_name} disabled />
                            <GlassInput label="Last Name" value={userData.last_name} disabled />
                            <GlassInput label="Date of Birth" icon={FaBirthdayCake} value={formattedDob} disabled />
                            <GlassInput label="Biological Sex" value={userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)} disabled />
                        </div>
                    </motion.div>

                    {/* Right: Security & Credentials */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-6 lg:p-8 shadow-sm flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-3 border-b border-platinum-200 dark:border-onyx-700 pb-4">
                            <FaLock className="text-indigo-500 text-xl" />
                            <h3 className="text-xl font-extrabold tracking-tight">Security Credentials</h3>
                        </div>

                        <form onSubmit={handlePasswordChange} className="flex flex-col gap-6">
                            <GlassInput label="Current Password" type="password" icon={FaLock} placeholder="••••••••" required />
                            <GlassInput label="New Password" type="password" icon={FaLock} placeholder="Must be at least 8 characters" required />
                            <GlassInput label="Confirm New Password" type="password" icon={FaLock} placeholder="Confirm exact match" required />

                            <button type="submit" className="mt-2 w-full bg-onyx-900 dark:bg-platinum-100 text-white dark:text-onyx-900 font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg hover:bg-dark-teal-600 dark:hover:bg-dark-teal-400 dark:hover:text-white transition-all active:scale-[0.98]">
                                Update Password
                            </button>
                        </form>
                    </motion.div>

                </div>

            </div>
        </div>
    );
}