"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bell, History, BarChart, Settings, LogOut, BrainCircuit, Server } from 'lucide-react';
import clsx from 'clsx';

import useUIStore from '@/lib/store/useUIStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();
    const { isSidebarCollapsed, toggleSidebar } = useUIStore();
    
    // Placeholder login/logout logic
    const logout = () => console.log("Logout clicked");

    const navItems = [
        { to: '/dashboard/', icon: LayoutDashboard, label: 'Live Stats' },
        { to: '/dashboard/analytics/', icon: BarChart, label: 'Analytics' },
        { to: '/dashboard/ml-models/', icon: BrainCircuit, label: 'ML Models' },
        { to: '/dashboard/sources/', icon: Server, label: 'Data Sources' },
        { to: '/dashboard/alerts/', icon: Bell, label: 'Alerts' },
        { to: '/dashboard/history/', icon: History, label: 'History' },
    ];

    return (
        <div 
            className={clsx(
                "h-screen bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-r border-slate-200/50 dark:border-white/10 text-slate-800 dark:text-white flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-all duration-300 shadow-2xl",
                isSidebarCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 border-b border-slate-200/50 dark:border-white/5 relative overflow-hidden flex items-center justify-between">
                <div className={clsx("transition-opacity duration-300", isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100")}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-50" />
                    <h1 className="relative text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 truncate">
                        NetSentry
                    </h1>
                </div>
                
                <button 
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors absolute right-2 top-6"
                    title={isSidebarCollapsed ? "Expand" : "Collapse"}
                >
                    {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>
            
            {!isSidebarCollapsed && (
                 <div className="px-6"> 
                    <p className="relative text-[10px] uppercase text-slate-500 mt-2 font-bold tracking-widest whitespace-nowrap overflow-hidden">Network Intelligence</p>
                    <Link href="/" className="relative text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 mt-6 flex items-center transition-colors group">
                        <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> Return to Website
                    </Link>
                 </div>
            )}

            <nav className="flex-1 p-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            href={item.to}
                            className={clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive 
                                    ? "bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-600/20 dark:to-purple-600/20 text-indigo-700 dark:text-white shadow-lg shadow-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30" 
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent",
                                !isSidebarCollapsed && "hover:pl-5"
                            )}
                            title={isSidebarCollapsed ? item.label : undefined}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-transparent opacity-50 blur-xl" />
                            )}
                            <item.icon size={20} className={clsx("relative z-10 transition-transform duration-300 flex-shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400 scale-110" : "group-hover:scale-110 group-hover:text-indigo-500 dark:group-hover:text-indigo-300")} />
                            {!isSidebarCollapsed && (
                                <span className={clsx("relative z-10 font-medium tracking-wide whitespace-nowrap", isActive ? "text-indigo-900 dark:text-white" : "")}>{item.label}</span>
                            )}
                            {isActive && !isSidebarCollapsed && (
                                <div className="absolute right-3 w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200/50 dark:border-white/5 bg-gradient-to-t from-slate-100/50 dark:from-black/20 to-transparent">
                <button 
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-500/20 justify-center md:justify-start"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    {!isSidebarCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
