"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Calendar } from 'lucide-react';
import useNetworkStore from '@/lib/store/useNetworkStore';

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token, selectedDevice } = useNetworkStore();

    useEffect(() => {
        const fetchHistory = async () => {
             if (!token) return;
             try {
                 // Endpoint /api/history
                 const res = await fetch(`/api/history?device_id=${selectedDevice}`, {
                     headers: { 'Authorization': `Bearer ${token}` }
                 });
                 if (res.ok) {
                     const data = await res.json();
                     setHistory(data);
                 }
             } catch (error) {
                 console.error("Error fetching history:", error);
             } finally {
                 setLoading(false);
             }
        };

        fetchHistory();
    }, [token, selectedDevice]);

    if (loading) {
         return <div className="p-8 text-center text-slate-400 animate-pulse">Loading History...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Traffic History</h1>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white transition-colors">
                        <Download className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white transition-colors">
                        <Filter className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white transition-colors">
                        <Calendar className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-transparent">
                     <div className="w-1/6">Timestamp</div>
                     <div className="w-1/6">Interface</div>
                     <div className="w-1/6">Bytes Sent</div>
                     <div className="w-1/6">Bytes Recv</div>
                     <div className="w-1/6">Total Packets</div>
                     <div className="w-1/6 text-right">Status</div> {/* Placeholder for status */}
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {history.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">No history available</div>
                    ) : (
                        history.map((record, i) => (
                            <div key={i} className="p-4 flex items-center justify-between text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <div className="w-1/6 text-slate-500">{new Date(record.timestamp).toLocaleString()}</div>
                                <div className="w-1/6 text-slate-900 dark:text-white font-medium">{record.interface_name}</div>
                                <div className="w-1/6 text-slate-500 font-mono text-xs">{(record.bytes_sent / 1024).toFixed(2)} KB</div>
                                <div className="w-1/6 text-slate-500 font-mono text-xs">{(record.bytes_recv / 1024).toFixed(2)} KB</div>
                                <div className="w-1/6 text-slate-900 dark:text-slate-300">{record.packets_sent + record.packets_recv}</div>
                                <div className="w-1/6 text-right">
                                    <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs border border-emerald-500/20">
                                        Active {/* Placeholder for status */}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
