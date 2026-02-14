import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useNetworkStore from '../store/useNetworkStore';
import { Wifi, WifiOff, Moon, Sun } from 'lucide-react';

const MainLayout = () => {
    const isConnected = useNetworkStore((state) => state.isConnected);
    const darkMode = useNetworkStore((state) => state.darkMode);
    const toggleDarkMode = useNetworkStore((state) => state.toggleDarkMode);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            <Sidebar />
            
            <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                {/* Header / Top Bar */}
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 z-10">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white capitalize">
                        {/* We could use location.pathname to show title, or leave blank/breadcrumbs */}
                        Network Monitor
                    </h2>

                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                            isConnected 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                            {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                        </div>

                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
