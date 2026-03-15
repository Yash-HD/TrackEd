import React from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaSun, FaMoon, FaArrowRight } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Reusable animated role card component
 */
const RoleCard = ({ icon: Icon, title, description, badge, onClick, index }) => {
	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 90,
				damping: 14,
				delay: index * 0.15
			}
		}
	};

	return (
		<motion.div
			variants={itemVariants}
			whileHover={{ y: -12, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			onClick={onClick}
			className="group relative bg-white/90 dark:bg-onyx-800/90 backdrop-blur-xl rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.4)] p-8 md:p-10 w-full max-w-sm text-left cursor-pointer border-2 border-white dark:border-onyx-700 overflow-hidden transition-all duration-500 hover:shadow-[0_32px_60px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_60px_rgba(0,0,0,0.5)] hover:border-dark-teal-200 dark:hover:border-onyx-600"
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onClick && onClick();
				}
			}}
		>
			<div className="absolute top-0 right-0 p-6 pointer-events-none">
				<span className="text-[10px] uppercase tracking-widest font-extrabold text-platinum-400 dark:text-onyx-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					{badge}
				</span>
			</div>

			<div className="relative z-10 flex flex-col h-full">
				<div className="w-16 h-16 rounded-2xl bg-platinum-100 dark:bg-onyx-900 flex items-center justify-center text-dark-teal-700 dark:text-platinum-300 text-3xl mb-8 shadow-inner border border-platinum-200 dark:border-onyx-800 group-hover:bg-onyx-900 group-hover:text-white dark:group-hover:bg-platinum-100 dark:group-hover:text-onyx-900 transition-colors duration-500">
					{Icon ? <Icon aria-hidden="true" /> : null}
				</div>

				<h3 className="text-2xl md:text-3xl font-extrabold text-onyx-900 dark:text-platinum-50 mb-3 tracking-tight group-hover:text-dark-teal-700 dark:group-hover:text-white transition-colors">{title}</h3>

				<p className="text-sm font-semibold text-onyx-500 dark:text-onyx-400 line-clamp-3 leading-relaxed mb-10 flex-grow">
					{description}
				</p>

				<div className="flex items-center text-sm font-extrabold uppercase tracking-widest text-dark-teal-600 dark:text-onyx-300 group-hover:text-onyx-900 dark:group-hover:text-white transition-colors mt-auto">
					Access Portal
					<div className="ml-3 w-8 h-8 rounded-full bg-platinum-100 dark:bg-onyx-700 flex items-center justify-center -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
						<FaArrowRight />
					</div>
				</div>
			</div>
		</motion.div>
	);
};

const RoleSelectionPage = () => {
	const { theme, toggleTheme } = useTheme();
	const navigate = useNavigate();

	const handleRoleSelection = (role) => {
		switch (role) {
			case 'Student':
				navigate('/login/student');
				break;
			case 'Faculty':
				navigate('/login/faculty');
				break;
			case 'Admin':
				navigate('/login/admin');
				break;
			default:
				break;
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.4
			}
		}
	};

	return (
		<div className="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden font-sans selection:bg-dark-teal-500/30 selection:text-onyx-900 dark:selection:text-platinum-50">

			{/* HIGH-CONTRAST ARCHITECTURAL BACKGROUND */}
			<div className="fixed inset-0 pointer-events-none -z-20 bg-platinum-50 dark:bg-onyx-950">
				{/* Sharp Diagonal Structural Block */}
				<div className="absolute top-0 right-0 w-[150%] h-[70%] bg-white dark:bg-onyx-900 -rotate-[8deg] translate-x-[15%] -translate-y-[20%] shadow-[0_20px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_100px_rgba(0,0,0,0.6)] border-b border-platinum-200 dark:border-onyx-800"></div>

				{/* Engineering Grid Overlay for texture */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>

				{/* Bold Monochromatic Abstract Spheres (No Neon) */}
				<div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-platinum-200/50 dark:bg-onyx-800/50 blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '12s' }}></div>
				<div className="absolute bottom-[-15%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-platinum-300/30 dark:bg-onyx-900/80 blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDuration: '18s' }}></div>
			</div>

			{/* Top-right theme toggle */}
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5, delay: 0.8 }}
				className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50"
			>
				<button
					className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-onyx-800 text-onyx-700 dark:text-platinum-200 shadow-lg border border-platinum-200 dark:border-onyx-700 hover:bg-onyx-900 hover:text-white dark:hover:bg-platinum-100 dark:hover:text-onyx-900 transition-all hover:scale-110 active:scale-95 duration-300"
					onClick={toggleTheme}
					aria-label="Toggle theme"
				>
					{theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
				</button>
			</motion.div>

			{/* Main Content Wrapper */}
			<div className="w-full max-w-7xl relative z-10 flex flex-col items-center">

				{/* Architectural Typography Header */}
				<header className="text-center mb-16 md:mb-24 relative">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-white dark:bg-onyx-900 border border-platinum-200 dark:border-onyx-700 shadow-sm text-xs font-extrabold tracking-[0.2em] uppercase text-onyx-600 dark:text-platinum-300"
					>
						TrackEd Authentication Portal
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
						className="text-5xl md:text-7xl lg:text-8xl font-black text-onyx-900 dark:text-platinum-50 tracking-tighter leading-[1.1] mb-6"
					>
						TrackEd <span className="text-dark-teal-600 dark:text-stormy-teal-500">.</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 0.5 }}
						className="text-lg md:text-xl font-bold text-onyx-500 dark:text-onyx-400 max-w-2xl mx-auto"
					>
						Identify Your Role
					</motion.p>
				</header>

				{/* Heavy Animated Cards Grid */}
				<motion.main
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="grid grid-cols-1 md:grid-cols-3 items-stretch justify-center gap-6 md:gap-8 lg:gap-10 w-full px-4"
				>
					<RoleCard
						index={0}
						icon={FaUserGraduate}
						title="Student"
						badge="SECURE_ID"
						description="Access your personal dashboard. Track real-time attendance, view upcoming schedules, and analyze your academic standing securely."
						onClick={() => handleRoleSelection('Student')}
					/>
					<RoleCard
						index={1}
						icon={FaChalkboardTeacher}
						title="Faculty"
						badge="TCH_AUTH"
						description="Manage course attendance, leverage bulk-scanning tools, and monitor student participation metrics effortlessly."
						onClick={() => handleRoleSelection('Faculty')}
					/>
					<RoleCard
						index={2}
						icon={FaUserShield}
						title="Admin"
						badge="SYS_ROOT"
						description="Oversee institutional configurations, manage user roles, and generate comprehensive compliance reports."
						onClick={() => handleRoleSelection('Admin')}
					/>
				</motion.main>
			</div>
		</div>
	);
};

export default RoleSelectionPage;