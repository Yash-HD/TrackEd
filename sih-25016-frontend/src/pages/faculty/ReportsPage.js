import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, 
    Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { FaChartPie, FaArrowUp, FaArrowDown, FaUsers, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// MOCK DATA GENERATION (Using standard distributions)
const attendanceTrends = [
    { week: 'Week 1', attendance: 85, target: 75 },
    { week: 'Week 2', attendance: 88, target: 75 },
    { week: 'Week 3', attendance: 82, target: 75 },
    { week: 'Week 4', attendance: 89, target: 75 },
    { week: 'Week 5', attendance: 91, target: 75 },
    { week: 'Week 6', attendance: 86, target: 75 },
    { week: 'Week 7', attendance: 94, target: 75 },
];

const subjectPerformance = [
    { name: 'Data Structures', passRate: 92, avgScore: 81 },
    { name: 'Linear Algebra', passRate: 78, avgScore: 65 },
    { name: 'Computer Arch', passRate: 85, avgScore: 72 },
    { name: 'Database Systems', passRate: 88, avgScore: 79 },
    { name: 'Mgmt Science', passRate: 98, avgScore: 88 },
];

const studentRiskDistribution = [
    { name: 'Safe (>75%)', value: 185, color: '#10b981' }, // Green
    { name: 'Warning (65-75%)', value: 34, color: '#f59e0b' }, // Amber
    { name: 'Critical (<65%)', value: 12, color: '#ef4444' }, // Red
];

// Reusable animated KPI Card
const KPICard = ({ title, value, trend, trendLabel, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 100, damping: 15 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/2 ${colorClass}`}></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner border border-platinum-200 dark:border-onyx-700 bg-platinum-100 dark:bg-onyx-900 ${colorClass}`}>
                <Icon className="text-xl opacity-80" />
            </div>
            {trend !== 0 && (
                <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest px-2 py-1 rounded-md border ${trend > 0 ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-800' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800'}`}>
                    {trend > 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(trend)}%
                </div>
            )}
        </div>
        
        <h3 className="text-[13px] font-black uppercase tracking-[0.15em] text-onyx-500 dark:text-onyx-400 mb-1 relative z-10">{title}</h3>
        <p className="text-3xl font-black text-onyx-900 dark:text-platinum-50 tracking-tight leading-none mb-1 relative z-10">{value}</p>
        <p className="text-xs font-bold text-onyx-400 dark:text-onyx-500 relative z-10">{trendLabel}</p>
    </motion.div>
);

export default function ReportsPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate chart rendering delay
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-onyx-400 dark:text-onyx-500 font-bold uppercase tracking-widest text-sm animate-pulse">
                    <span className="w-10 h-10 border-4 border-onyx-200 dark:border-onyx-800 border-t-dark-teal-500 rounded-full animate-spin"></span>
                    Aggregating Analytics...
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden hidden lg:block">
                <div className="absolute top-[5%] right-[15%] w-[600px] h-[600px] bg-dark-teal-400/10 dark:bg-dark-teal-700/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: '14s' }}></div>
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-stormy-teal-300/20 dark:bg-stormy-teal-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-50"></div>
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
                            <FaChartPie className="text-dark-teal-600 dark:text-dark-teal-400 text-2xl" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-onyx-900 dark:text-platinum-50">Analytics Engine</h2>
                    </div>
                    <p className="text-onyx-600 dark:text-onyx-400 font-bold pl-16">Real-time macro insights and performance metrics across your assigned cohorts.</p>
                </motion.div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard 
                        title="Cohort Avg Attendance" 
                        value="87.4%" 
                        trend={4.2} 
                        trendLabel="vs last month"
                        icon={FaUsers}
                        colorClass="bg-dark-teal-500 text-dark-teal-500"
                        delay={0.1}
                    />
                    <KPICard 
                        title="At-Risk Population" 
                        value="12" 
                        trend={-2} 
                        trendLabel="Total students < 65%"
                        icon={FaExclamationTriangle}
                        colorClass="bg-amber-500 text-amber-500"
                        delay={0.2}
                    />
                    <KPICard 
                        title="Mean Assessment Score" 
                        value="77.2" 
                        trend={1.5} 
                        trendLabel="Across 5 active modules"
                        icon={FaCheckCircle}
                        colorClass="bg-emerald-500 text-emerald-500"
                        delay={0.3}
                    />
                    <KPICard 
                        title="Classes Executed" 
                        value="142" 
                        trend={0} 
                        trendLabel="Total sessions this term"
                        icon={FaChartPie}
                        colorClass="bg-indigo-500 text-indigo-500"
                        delay={0.4}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Trend Line Chart */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="lg:col-span-2 bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-6 shadow-sm overflow-hidden flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold tracking-tight text-onyx-900 dark:text-platinum-50">Attendance Trajectory</h3>
                                <p className="text-xs font-bold text-onyx-500 uppercase tracking-widest">7 Week Rolling Average</p>
                            </div>
                        </div>
                        <div className="h-72 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={attendanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1bdae4" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#1bdae4" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-platinum-200 dark:text-onyx-700 opacity-50" />
                                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} stroke="currentColor" className="text-onyx-400" dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} stroke="currentColor" className="text-onyx-400" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(24, 22, 29, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#1bdae4' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', bottom: -10 }} />
                                    <Area type="monotone" dataKey="attendance" name="Actual %" stroke="#1bdae4" strokeWidth={4} fillOpacity={1} fill="url(#colorAvg)" />
                                    <Line type="step" dataKey="target" name="Minimum Target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Risk Distribution Pie Chart */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                        className="lg:col-span-1 bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-6 shadow-sm overflow-hidden flex flex-col"
                    >
                        <div className="mb-2 text-center">
                            <h3 className="text-xl font-extrabold tracking-tight text-onyx-900 dark:text-platinum-50">Risk Distribution</h3>
                            <p className="text-xs font-bold text-onyx-500 uppercase tracking-widest">Global Cohort (n=231)</p>
                        </div>
                        <div className="h-56 w-full flex-grow relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={studentRiskDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {studentRiskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 4px 6px ${entry.color}40)` }} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(24, 22, 29, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Statistic */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                                <span className="text-3xl font-black text-amber-500">46</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-onyx-500">At Risk</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-2">
                            {studentRiskDistribution.map(item => (
                                <div key={item.name} className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-[10px] font-bold text-onyx-600 dark:text-onyx-400">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Subject Performance Bar Chart */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, type: "spring" }}
                        className="lg:col-span-3 bg-white/70 dark:bg-onyx-800/50 backdrop-blur-xl border border-platinum-200 dark:border-onyx-700/60 rounded-[2rem] p-6 shadow-sm overflow-hidden"
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-extrabold tracking-tight text-onyx-900 dark:text-platinum-50">Module Efficacy</h3>
                            <p className="text-xs font-bold text-onyx-500 uppercase tracking-widest">Comparison of Pass Rates vs Average Assessment Scores</p>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectPerformance} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-platinum-200 dark:text-onyx-700 opacity-50" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} stroke="currentColor" className="text-onyx-500" dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} stroke="currentColor" className="text-onyx-400" />
                                    <Tooltip 
                                        cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                        contentStyle={{ backgroundColor: 'rgba(24, 22, 29, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                                    <Bar dataKey="passRate" name="Pass Rate (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="avgScore" name="Avg Score (/100)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}