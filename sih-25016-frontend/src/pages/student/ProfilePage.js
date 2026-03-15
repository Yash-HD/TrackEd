import React, { useState, useEffect } from 'react';
import { FaBuilding, FaBirthdayCake, FaUser, FaLock, FaIdCard, FaCog } from 'react-icons/fa';
import MainLayout from '../../components/student/MainLayout';
import { motion } from 'framer-motion';

const InfoField = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-4 border-b border-platinum-100 dark:border-onyx-700/50 last:border-b-0 group">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-platinum-100 dark:bg-onyx-800 flex items-center justify-center text-dark-teal-600 dark:text-stormy-teal-400 shadow-sm border border-platinum-200 dark:border-onyx-700 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <p className="text-sm font-bold text-onyx-500 dark:text-onyx-400 tracking-wide uppercase">{label}</p>
        </div>
        <p className="font-extrabold text-lg text-onyx-900 dark:text-platinum-50 text-right">{value}</p>
    </div>
);

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = () => {
            setTimeout(() => {
                const mockData = {
                    first_name: "Rohan",
                    middle_name: "",
                    last_name: "Kumar",
                    roll_number: "202430063",
                    date_of_birth: "2002-05-15",
                    gender: "male",
                    department: "Computer Engineering",
                    email: "rohan.kumar@student.edu"
                };
                setUserData(mockData);
                setIsLoading(false);
            }, 800);
        };
        fetchProfileData();
    }, []);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        alert("Password update logic to be implemented!");
    };

    if (isLoading || !userData) {
        return <MainLayout><div className="flex items-center justify-center p-20 text-onyx-500 font-bold animate-pulse">Loading profile securely...</div></MainLayout>;
    }

    const fullName = `${userData.first_name} ${userData.middle_name || ''} ${userData.last_name}`;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=108389&color=fff&size=256&bold=true`;
    
    const formattedDob = new Date(userData.date_of_birth).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
    };

    return (
        <MainLayout>
            {/* AMBIENT LIGHTING BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden md:block">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-dark-teal-400/20 dark:bg-dark-teal-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '9s' }}></div>
                <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-stormy-teal-300/30 dark:bg-stormy-teal-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40"></div>
                <div className="absolute inset-0 bg-platinum-50/80 dark:bg-onyx-950/90 backdrop-blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10 text-onyx-900 dark:text-platinum-50 p-2 sm:p-4 lg:p-6">
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 lg:gap-8">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* 1. Main Profile Identity Card */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-6">
                            
                            {/* Profile Header Block */}
                            <div className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl rounded-[2rem] border border-platinum-100 dark:border-onyx-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-stretch gap-6 p-8">
                                {/* Decorative Gradient Graphic */}
                                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-dark-teal-300/30 to-transparent dark:from-dark-teal-600/20 pointer-events-none"></div>

                                {/* Avatar */}
                                <div className="relative group shrink-0">
                                    <div className="absolute inset-0 bg-dark-teal-500 rounded-full filter blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                    <img src={avatarUrl} alt="Profile Avatar" className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-onyx-800 shadow-xl object-cover" />
                                </div>
                                
                                {/* Identity Info */}
                                <div className="flex flex-col justify-center text-center sm:text-left z-10">
                                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-onyx-900 dark:text-platinum-50">{fullName}</h2>
                                    <p className="text-lg font-bold text-dark-teal-700 dark:text-stormy-teal-400 mt-1">{userData.department}</p>
                                    
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-platinum-100 dark:bg-onyx-900/80 border border-platinum-200 dark:border-onyx-700 shadow-inner">
                                            <FaIdCard className="text-onyx-500" />
                                            <span className="text-sm font-bold text-onyx-700 dark:text-platinum-200 tracking-widest">{userData.roll_number}</span>
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-platinum-100 dark:bg-onyx-900/80 border border-platinum-200 dark:border-onyx-700 shadow-inner">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="text-sm font-bold text-onyx-700 dark:text-platinum-200 uppercase">Active Core</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Info List */}
                            <div className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl rounded-[2rem] border border-platinum-100 dark:border-onyx-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-6 md:p-8">
                                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-onyx-900 to-onyx-600 dark:from-platinum-50 dark:to-platinum-300 mb-6 flex items-center gap-3">
                                    <FaUser className="text-dark-teal-600 dark:text-dark-teal-400" /> Personal Details
                                </h3>
                                <div className="flex flex-col">
                                    <InfoField icon={<FaBuilding />} label="Academic Unit" value={userData.department} />
                                    <InfoField icon={<FaBirthdayCake />} label="Date of Birth" value={formattedDob} />
                                    <InfoField icon={<FaUser />} label="Gender" value={userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)} />
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Security / Settings Sidebar */}
                        <motion.div variants={itemVariants} className="lg:col-span-1 flex flex-col gap-6">
                            <div className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl rounded-[2rem] border border-platinum-100 dark:border-onyx-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-6 md:p-8">
                                <h3 className="text-xl font-bold text-onyx-900 dark:text-platinum-50 mb-6 flex items-center gap-3">
                                    <FaLock className="text-dark-teal-600 dark:text-dark-teal-400" /> Security
                                </h3>
                                
                                <form onSubmit={handlePasswordChange} className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-onyx-500 dark:text-onyx-400 uppercase tracking-widest pl-1 mb-1 block">Current Password</label>
                                        <div className="relative">
                                            <input type="password" required className="w-full pl-4 pr-3 py-3 rounded-xl border border-platinum-200 dark:border-onyx-700 bg-white/80 dark:bg-onyx-900/80 backdrop-blur-md font-medium text-onyx-800 dark:text-platinum-100 focus:outline-none focus:ring-2 focus:ring-dark-teal-500 focus:border-transparent transition-all shadow-sm" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-onyx-500 dark:text-onyx-400 uppercase tracking-widest pl-1 mb-1 block">New Password</label>
                                        <div className="relative">
                                            <input type="password" required className="w-full pl-4 pr-3 py-3 rounded-xl border border-platinum-200 dark:border-onyx-700 bg-white/80 dark:bg-onyx-900/80 backdrop-blur-md font-medium text-onyx-800 dark:text-platinum-100 focus:outline-none focus:ring-2 focus:ring-dark-teal-500 focus:border-transparent transition-all shadow-sm" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-onyx-500 dark:text-onyx-400 uppercase tracking-widest pl-1 mb-1 block">Confirm Password</label>
                                        <div className="relative">
                                            <input type="password" required className="w-full pl-4 pr-3 py-3 rounded-xl border border-platinum-200 dark:border-onyx-700 bg-white/80 dark:bg-onyx-900/80 backdrop-blur-md font-medium text-onyx-800 dark:text-platinum-100 focus:outline-none focus:ring-2 focus:ring-dark-teal-500 focus:border-transparent transition-all shadow-sm" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.02, boxShadow: "0 4px 15px -3px rgba(16, 131, 137, 0.4)" }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit" 
                                        className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-dark-teal-600 to-dark-teal-800 dark:from-dark-teal-500 dark:to-stormy-teal-700 text-white font-extrabold tracking-wide shadow-md transition-all"
                                    >
                                        Update Password
                                    </motion.button>
                                </form>
                            </div>

                            {/* Preference Settings Stub */}
                            <div className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-xl rounded-[2rem] border border-platinum-100 dark:border-onyx-700/50 shadow-sm p-6 md:p-8 opacity-70">
                                <h3 className="text-lg font-bold text-onyx-900 dark:text-platinum-50 mb-4 flex items-center gap-3">
                                    <FaCog className="text-onyx-500" /> Preferences
                                </h3>
                                <p className="text-sm font-medium text-onyx-500">Global account preference configuration will be available in standard settings update.</p>
                            </div>
                        </motion.div>
                        
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}