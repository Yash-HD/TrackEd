import React from 'react';
import MainLayout from '../../components/student/MainLayout';
import { motion } from 'framer-motion';

const LeavePage = () => {
	return (
		<MainLayout>
            {/* AMBIENT LIGHTING BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden md:block">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-dark-teal-400/20 dark:bg-dark-teal-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-60"></div>
                <div className="absolute inset-0 bg-platinum-50/80 dark:bg-onyx-950/90 backdrop-blur-3xl"></div>
            </div>

			<div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
				<motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/60 dark:bg-onyx-800/40 backdrop-blur-2xl rounded-[2rem] border border-platinum-100 dark:border-onyx-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-12 text-center"
                >
					<h2 className="text-2xl font-extrabold text-onyx-900 dark:text-platinum-50 mb-4 tracking-tight">Leave Application</h2>
                    <p className="text-lg font-medium text-onyx-500 dark:text-platinum-300">Apply for leave and review status here.</p>
                    
                    <div className="mt-8 mx-auto max-w-md p-6 border-2 border-dashed border-platinum-300 dark:border-onyx-700 rounded-2xl bg-white/40 dark:bg-onyx-900/30">
                        <span className="text-sm font-bold uppercase tracking-widest text-dark-teal-600 dark:text-stormy-teal-400">Under Construction</span>
                    </div>
				</motion.div>
			</div>
		</MainLayout>
	);
};

export default LeavePage;