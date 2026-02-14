"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useNetworkStore from '@/lib/store/useNetworkStore';

const RealTimeChart = () => {
    // In a real app we would use the history from the store.
    // For now, let's mock it or use the metrics if the store supports history.
    // The simplified store I created only has `metrics` array (which acts as history).
    const metrics = useNetworkStore((state) => state.metrics);

    // Transform data for chart
    // Reverses metrics because `addMetric` prepends new ones (LIFO), but chart needs chronological (FIFO) usually?
    // Actually charts usually go Left->Right (Old->New). 
    // If metrics[0] is newest, we should reverse it.
    const data = [...metrics].reverse().map((m, idx) => ({
        name: idx, // or timestamp
        sent: m.bytes_sent / 1024, // KB
        recv: m.bytes_recv / 1024, // KB
    }));

    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-slate-400">Waiting for data...</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/> {/* indigo-400 */}
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRecv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/> {/* emerald-400 */}
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.1} vertical={false} />
                <XAxis 
                    dataKey="name" 
                    hide 
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    mirror={true}
                />
                <Tooltip 
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 p-3 rounded-lg shadow-xl">
                                    <p className="text-slate-400 text-xs mb-2">Timestamp: {label}</p>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                            <span className="text-slate-300 text-xs">Sent:</span>
                                            <span className="text-white font-mono font-bold text-xs">{payload[0].value?.toFixed(2)} KB</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span className="text-slate-300 text-xs">Recv:</span>
                                            <span className="text-white font-mono font-bold text-xs">{payload[1].value?.toFixed(2)} KB</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="sent" 
                    stroke="#818cf8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSent)" 
                />
                <Area 
                    type="monotone" 
                    dataKey="recv" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRecv)" 
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default RealTimeChart;
