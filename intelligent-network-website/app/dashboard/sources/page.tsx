"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Laptop, Smartphone, Terminal, Check, Copy, Wifi } from 'lucide-react';
import useNetworkStore from '@/lib/store/useNetworkStore';

export default function DataSourcesPage() {
    const { devices, selectedDevice, selectDevice } = useNetworkStore();
    const [copied, setCopied] = useState(false);
    
    // In a real app, we would fetch a new key from API
    const demoKey = "netsentry-demo-key-123";
    const installCommand = `curl -sL https://raw.githubusercontent.com/mansoor00727/NetSentry-Network_Analyzer/main/client-probe/probe.py | python3 - --url http://<YOUR_SERVER_IP>:8000/api/v1/ingest --key ${demoKey}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Data Sources</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage connected devices and remote probes.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Device List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
                        <Wifi className="mr-2 text-indigo-500" /> Connected Devices
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {devices.map((device) => (
                            <motion.div
                                key={device}
                                layoutId={device}
                                onClick={() => selectDevice(device)}
                                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden group ${
                                    selectedDevice === device
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${selectedDevice === device ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                        {device === 'server' ? <Server size={24} /> : <Laptop size={24} />}
                                    </div>
                                    {selectedDevice === device && (
                                        <span className="px-2 py-1 text-xs font-bold bg-white/20 rounded-full flex items-center">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                                            Active View
                                        </span>
                                    )}
                                </div>
                                <h3 className={`text-lg font-bold mb-1 ${selectedDevice === device ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                    {device === 'server' ? 'Local Server' : device}
                                </h3>
                                <p className={`text-sm ${selectedDevice === device ? 'text-indigo-100' : 'text-slate-500'}`}>
                                    {device === 'server' ? 'Primary Monitoring Node' : 'Remote Probe'}
                                </p>
                                
                                <div className={`absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity ${selectedDevice === device ? 'text-white' : 'text-indigo-500'}`}>
                                    Click to View Stats →
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Add New Source */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
                        <Terminal className="mr-2 text-emerald-500" /> Add New Probe
                    </h2>
                    
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Terminal size={120} />
                        </div>
                        
                        <h3 className="text-white font-bold mb-2 relative z-10">One-Line Installation</h3>
                        <p className="text-slate-400 text-sm mb-4 relative z-10">
                            Run this command on any Linux/macOS machine to start streaming data instantly.
                        </p>
                        
                        <div className="bg-black/50 rounded-lg p-3 font-mono text-xs text-emerald-400 break-all mb-4 border border-white/5 relative group">
                            {installCommand}
                        </div>
                        
                        <button 
                            onClick={copyToClipboard}
                            className="w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            <span>{copied ? 'Copied to Clipboard' : 'Copy Command'}</span>
                        </button>
                        
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h4 className="text-white text-sm font-semibold mb-2">Requirements</h4>
                            <ul className="text-slate-500 text-xs space-y-1 list-disc list-inside">
                                <li>Python 3.7+</li>
                                <li>Internet connection</li>
                                <li>Root/Admin privileges (optional)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
