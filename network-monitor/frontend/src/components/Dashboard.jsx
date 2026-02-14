import React from 'react';
import useNetworkStore from '../store/useNetworkStore';
import LiveStatsCard from './LiveStatsCard';
import { Activity, ArrowUpCircle, ArrowDownCircle, AlertOctagon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const metrics = useNetworkStore((state) => state.metrics);
    // metrics is a list of interfaces from the websocket updates.
    // For the summary cards, we might want to aggregate or just pick the first interface 'en0'/'eth0'.
    
    // Fallback if no data
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LiveStatsCard
                    title="Bytes Sent"
                    value={(current.bytes_sent / 1024 / 1024).toFixed(2)}
                    unit="MB"
                    color="indigo"
                    icon={ArrowUpCircle}
                    trend={0} // To implement: calculate trend vs previous
                />
                <LiveStatsCard
                    title="Bytes Received"
                    value={(current.bytes_recv / 1024 / 1024).toFixed(2)}
                    unit="MB"
                    color="emerald"
                    icon={ArrowDownCircle}
                    trend={0}
                />
                <LiveStatsCard
                    title="Packets/Sec"
                    value={(current.packets_sent + current.packets_recv).toString()}
                    unit="pps"
                    color="blue"
                    icon={Activity}
                />
                <LiveStatsCard
                    title="Errors"
                    value={(current.err_in + current.err_out).toString()}
                    unit="count"
                    color="rose"
                    icon={AlertOctagon}
                />
            </div>

            {/* Main Chart Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Real-time Traffic Activity</h3>
                <div className="h-80 w-full">
                     {/* 
                         In a real implementation, we would use the 'history' from the store here.
                         For now, showing a placeholder or connecting to history if available.
                     */}
                    <div className="flex items-center justify-center h-full text-slate-400">
                        Live Chart Visualization Loading...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
