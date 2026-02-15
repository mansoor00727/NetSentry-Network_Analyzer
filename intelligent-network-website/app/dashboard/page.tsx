"use client";

import React, { useEffect, useState } from 'react';
import useNetworkStore from '@/lib/store/useNetworkStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import LiveStatsCard from '@/components/dashboard/LiveStatsCard';
import { Activity, ArrowUpCircle, ArrowDownCircle, AlertOctagon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RealTimeChart from '@/components/dashboard/RealTimeChart';
import { motion } from "framer-motion";

import { WS_URL } from '@/lib/config';

export default function DashboardPage() {
    // Connect to WebSocket
    // Use configured WS_URL from lib/config
    const [wsUrl, setWsUrl] = useState<string | null>(null);

    useEffect(() => {
        // Run only on client
        setWsUrl(`${WS_URL}/ws`);
    }, []);

    const { isConnected } = useWebSocket(wsUrl || "");
    const { metrics, selectedDevice } = useNetworkStore();

    // Initial dummy data to avoid flicker if needed, or handled by current check
    const current = metrics && metrics.length > 0 ? metrics[0] : {
        bytes_sent: 0,
        bytes_recv: 0,
        packets_sent: 0,
        packets_recv: 0,
        err_in: 0,
        err_out: 0,
        drop_in: 0,
        drop_out: 0
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Dashboard <span className="text-indigo-500 text-2xl font-normal ml-2">/ {selectedDevice === 'server' ? 'Local Server' : selectedDevice}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time network monitoring and analysis</p>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-md shadow-sm">
                    <span className={`relative flex h-2.5 w-2.5`}>
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    </span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{isConnected ? 'System Online' : 'Offline'}</span>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LiveStatsCard
                    title="Bytes Sent"
                    value={(current.bytes_sent / 1024 / 1024).toFixed(2)}
                    unit="MB"
                    color="indigo"
                    icon={ArrowUpCircle}
                    trend={0}
                    delay={0}
                />
                <LiveStatsCard
                    title="Bytes Received"
                    value={(current.bytes_recv / 1024 / 1024).toFixed(2)}
                    unit="MB"
                    color="emerald"
                    icon={ArrowDownCircle}
                    trend={0}
                    delay={1}
                />
                <LiveStatsCard
                    title="Packets/Sec"
                    value={(current.packets_sent + current.packets_recv).toString()}
                    unit="pps"
                    color="blue"
                    icon={Activity}
                    delay={2}
                />
                <LiveStatsCard
                    title="Errors"
                    value={(current.err_in + current.err_out).toString()}
                    unit="count"
                    color="rose"
                    icon={AlertOctagon}
                    delay={3}
                />
            </motion.div>

            {/* Main Chart Section */}
            <motion.div variants={itemVariants}>
                <Card className="col-span-1 md:col-span-2 lg:col-span-4 shadow-xl border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl relative overflow-hidden group">
                     {/* Pulse Effect */}
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                     <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
                    
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-slate-900 dark:text-slate-200 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-indigo-500 animate-pulse" />
                            Real-time Traffic Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] relative z-10">
                         <RealTimeChart />
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
