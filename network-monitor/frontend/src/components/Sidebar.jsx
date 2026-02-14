import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bell, History, BarChart, Settings, LogOut, BrainCircuit } from 'lucide-react';
import useNetworkStore from '../store/useNetworkStore';
import clsx from 'clsx';

const Sidebar = () => {
    const logout = useNetworkStore((state) => state.logout);

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Live Stats', exact: true },
        { to: '/analytics', icon: BarChart, label: 'Analytics' },
        { to: '/ml-models', icon: BrainCircuit, label: 'ML Models' },
        { to: '/alerts', icon: Bell, label: 'Alerts' },
        { to: '/history', icon: History, label: 'History' },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 overflow-y-auto z-10">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                    NetSentinel
                </h1>
                <p className="text-xs text-slate-400 mt-1">Intelligent Traffic Analyzer</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) => clsx(
                            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive 
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
