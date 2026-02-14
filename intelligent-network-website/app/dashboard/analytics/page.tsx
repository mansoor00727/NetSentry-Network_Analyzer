"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Network, AlertTriangle, Activity } from 'lucide-react';
import useNetworkStore from '@/lib/store/useNetworkStore';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const { token, selectedDevice } = useNetworkStore();
    const [timeRange, setTimeRange] = useState(1);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);
    const [trendData, setTrendData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);
            try {
                // Fetch Summary
                const summaryRes = await fetch(`/api/analytics/summary?days=${timeRange}&device_id=${selectedDevice}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (summaryRes.ok) {
                    const summaryData = await summaryRes.json();
                    setSummary(summaryData);
                }

                // Fetch Trend
                const trendRes = await fetch(`/api/analytics/trend?days=${timeRange}&device_id=${selectedDevice}`, {
                     headers: { 'Authorization': `Bearer ${token}` }
                });
                if (trendRes.ok) {
                    const trendJson = await trendRes.json();
                    setTrendData(trendJson.trend || []);
                }

            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, timeRange, selectedDevice]);

    const formatXAxis = (tickItem: string) => {
        if (!tickItem) return "";
        const date = new Date(tickItem);
        if (timeRange === 1) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVar = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading && !summary) {
        return <div className="p-8 text-center text-slate-400 animate-pulse">Loading Analytics Engine...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Traffic Analytics</h1>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setTimeRange(1)}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${timeRange === 1 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                    >
                        Last 24h
                    </button>
                    <button 
                        onClick={() => setTimeRange(7)}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${timeRange === 7 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                    >
                        Last 7 Days
                    </button>
                    <button 
                        onClick={() => setTimeRange(30)}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${timeRange === 30 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                    >
                        Last 30 Days
                    </button>
                </div>
            </div>

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {/* Summary Cards */}
                <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Traffic Card */}
                    <motion.div variants={itemVar} className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Traffic</h3>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                {summary?.metrics?.total_bytes_sent ? (summary.metrics.total_bytes_sent / 1e9).toFixed(2) : 0} GB Sent
                            </span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {summary?.metrics?.total_bytes_recv ? (summary.metrics.total_bytes_recv / 1e9).toFixed(2) : 0} GB Received
                        </div>
                    </motion.div>

                    {/* Error Rate Card */}
                    <motion.div variants={itemVar} className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Error Rate</h3>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-2xl font-bold text-rose-500 dark:text-rose-400">
                                {summary?.metrics?.error_ratio ? (summary.metrics.error_ratio * 100).toFixed(4) : 0}%
                            </span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Packet Error Ratio
                        </div>
                    </motion.div>

                    {/* Network Health Card */}
                    <motion.div variants={itemVar} className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Network Health</h3>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                                Stable
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Traffic Trend Chart */}
                <motion.div variants={itemVar} className="col-span-1 lg:col-span-3">
                    <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">Traffic Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorSentAnalytic" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorRecvAnalytic" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                    <XAxis dataKey="timestamp" stroke="#94a3b8" tickFormatter={formatXAxis} />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} 
                                        itemStyle={{ color: '#e2e8f0' }}
                                        labelFormatter={(label) => new Date(label).toLocaleString()}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="bytes_sent" stroke="#818cf8" fillOpacity={1} fill="url(#colorSentAnalytic)" name="Bytes Sent" />
                                    <Area type="monotone" dataKey="bytes_recv" stroke="#34d399" fillOpacity={1} fill="url(#colorRecvAnalytic)" name="Bytes Recv" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
