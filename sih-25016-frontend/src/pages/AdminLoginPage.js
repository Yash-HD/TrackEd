import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaIdBadge, FaLock, FaEye, FaEyeSlash, FaSun, FaMoon, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeProvider';
import { motion } from 'framer-motion';

const AdminLoginPage = () => {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (adminId === 'ADMIN01' && password === 'password123') {
                alert('Login successful! Admin Dashboard Pending...');
            } else {
                throw new Error('Invalid admin ID or password.');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden font-sans selection:bg-dark-teal-500/30 selection:text-onyx-900 dark:selection:text-platinum-50">
            
            {/* HIGH-CONTRAST ARCHITECTURAL BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-20 bg-platinum-50 dark:bg-onyx-950">
                {/* Sharp Diagonal Structural Block */}
                <div className="absolute top-0 right-0 w-[150%] h-[70%] bg-white dark:bg-onyx-900 -rotate-[8deg] translate-x-[15%] -translate-y-[20%] shadow-[0_20px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_100px_rgba(0,0,0,0.6)] border-b border-platinum-200 dark:border-onyx-800"></div>
                
                {/* Engineering Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
                
                {/* Bold Monochromatic Abstract Spheres */}
                <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-platinum-200/50 dark:bg-onyx-800/50 blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
                <div className="absolute bottom-[-15%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-platinum-300/30 dark:bg-onyx-900/80 blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '18s' }}></div>
            </div>

            {/* Back Button & Theme Toggle */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-6 left-6 lg:top-8 lg:left-8 z-50 flex items-center gap-4 text-onyx-900 dark:text-platinum-50"
            >
                <Link to="/" className="inline-flex items-center gap-2 font-bold hover:text-dark-teal-600 dark:hover:text-dark-teal-400 transition-colors">
                    <FaArrowLeft /> Back to Roles
                </Link>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50"
            >
                <button
                    className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-onyx-800 text-onyx-700 dark:text-platinum-200 shadow-lg border border-platinum-200 dark:border-onyx-700 hover:bg-onyx-900 hover:text-white dark:hover:bg-platinum-100 dark:hover:text-onyx-900 transition-all hover:scale-110 active:scale-95 duration-300"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
                </button>
            </motion.div>

            {/* Login Card */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.2 }}
                className="relative z-10 w-full max-w-md bg-white/90 dark:bg-onyx-800/90 backdrop-blur-xl rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.4)] p-8 md:p-10 border-2 border-white dark:border-onyx-700 group transition-all duration-500 hover:shadow-[0_32px_60px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_60px_rgba(0,0,0,0.5)] hover:border-dark-teal-200 dark:hover:border-onyx-600"
            >
                <div className="absolute top-0 right-0 p-6 pointer-events-none">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-platinum-400 dark:text-onyx-500">
                        SYS_ROOT
                    </span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-platinum-100 dark:bg-onyx-900 flex items-center justify-center text-dark-teal-700 dark:text-platinum-300 text-3xl mb-8 shadow-inner border border-platinum-200 dark:border-onyx-800 group-hover:bg-onyx-900 group-hover:text-white dark:group-hover:bg-platinum-100 dark:group-hover:text-onyx-900 transition-colors duration-500">
                    <FaUserShield />
                </div>
                
                <h2 className="text-3xl font-extrabold text-onyx-900 dark:text-platinum-50 tracking-tight mb-2 group-hover:text-dark-teal-700 dark:group-hover:text-white transition-colors">Admin Access</h2>
                <p className="text-sm font-semibold text-onyx-500 dark:text-onyx-400 mb-6">System configurations & wide controls</p>
                
                {/* Mock Credentials Card */}
                <div className="mb-8 p-3 bg-dark-teal-50 dark:bg-dark-teal-900/30 border border-dark-teal-200 dark:border-dark-teal-800/50 rounded-xl flex flex-col gap-1 items-center text-center relative z-20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-dark-teal-700 dark:text-dark-teal-400">Demo Credentials</span>
                    <div className="flex gap-4 text-sm font-black text-onyx-800 dark:text-platinum-200">
                        <span>ID: <code className="font-mono bg-white/60 dark:bg-black/30 px-1.5 py-0.5 rounded text-dark-teal-600 dark:text-dark-teal-400">ADMIN01</code></span>
                        <span>PWD: <code className="font-mono bg-white/60 dark:bg-black/30 px-1.5 py-0.5 rounded text-dark-teal-600 dark:text-dark-teal-400">password123</code></span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
                    <div>
                        <label htmlFor="adminId" className="block text-xs font-bold uppercase tracking-widest text-onyx-500 dark:text-onyx-400 mb-2 pl-1">
                            Admin ID
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-onyx-400 dark:text-onyx-500">
                                <FaIdBadge />
                            </span>
                            <input
                                type="text"
                                id="adminId"
                                name="adminId"
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-platinum-200 dark:border-onyx-700 bg-white/50 dark:bg-onyx-900/50 backdrop-blur-sm text-onyx-900 dark:text-platinum-50 font-bold placeholder-onyx-400 focus:outline-none focus:ring-2 focus:ring-dark-teal-500 focus:bg-white dark:focus:bg-onyx-900 transition-all shadow-sm"
                                placeholder="Enter admin root ID"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-onyx-500 dark:text-onyx-400 mb-2 pl-1">
                            Root Password
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-onyx-400 dark:text-onyx-500">
                                <FaLock />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 rounded-xl border border-platinum-200 dark:border-onyx-700 bg-white/50 dark:bg-onyx-900/50 backdrop-blur-sm text-onyx-900 dark:text-platinum-50 font-bold placeholder-onyx-400 focus:outline-none focus:ring-2 focus:ring-dark-teal-500 focus:bg-white dark:focus:bg-onyx-900 transition-all shadow-sm"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-3.5 text-onyx-400 hover:text-dark-teal-600 dark:hover:text-platinum-300 transition-colors"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer group/label">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 rounded border-2 border-platinum-300 dark:border-onyx-600 peer-checked:bg-dark-teal-600 peer-checked:border-dark-teal-600 transition-all flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-onyx-600 dark:text-onyx-400 group-hover/label:text-onyx-900 dark:group-hover/label:text-platinum-200 transition-colors">
                                Trust Device
                            </span>
                        </label>
                        <a href="/forgot" onClick={(e) => e.preventDefault()} className="text-sm font-bold text-dark-teal-600 dark:text-dark-teal-400 hover:underline">
                            Override keys
                        </a>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-sm font-bold text-red-600 dark:text-red-400 text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-onyx-900 dark:bg-platinum-100 text-white dark:text-onyx-900 font-extrabold tracking-wide uppercase shadow-lg shadow-onyx-900/20 dark:shadow-platinum-100/10 hover:shadow-xl hover:bg-dark-teal-700 dark:hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-onyx-900 dark:focus:ring-offset-onyx-900 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                        {isLoading ? (
                            <>
                                <span className="mr-3 w-5 h-5 border-2 border-white/30 dark:border-onyx-900/30 border-t-white dark:border-t-onyx-900 rounded-full animate-spin"></span>
                                Elevating...
                            </>
                        ) : (
                            'Initialize Session'
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;