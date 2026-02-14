"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import useNetworkStore from '@/lib/store/useNetworkStore';
import { cn } from '@/lib/utils';

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { token, selectedDevice } = useNetworkStore();

    useEffect(() => {
        const fetchAlerts = async () => {
             if (!token) return;
             try {
                 // Endpoint might be /api/alerts or /api/monitor/alerts depending on backend structure week 4
                 // Let's assume /api/alerts for now based on week 4 verification script
                 const res = await fetch(`/api/alerts?device_id=${selectedDevice}`, {
                     headers: { 'Authorization': `Bearer ${token}` }
                 });
                 if (res.ok) {
                     const data = await res.json();
                     setAlerts(data);
                 }
             } catch (error) {
                 console.error("Error fetching alerts:", error);
             } finally {
                 setLoading(false);
             }
        };

        fetchAlerts();
    }, [token, selectedDevice]);

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high': return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'low': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    if (loading) {
         return <div className="p-8 text-center text-slate-400 animate-pulse">Loading Alert System...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">Security Alerts</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Alerts</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{alerts.length}</div>
                    </CardContent>
                </Card>
                 <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">High Severity</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {alerts.filter(a => a.severity === 'high').length}
                        </div>
                    </CardContent>
                </Card>
                 <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Threats</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {alerts.filter(a => a.status === 'active').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <CheckCircle className="h-12 w-12 text-emerald-500/20 mb-4" />
                            <p>No alerts detected. System is secure.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-500 dark:text-slate-400">Timestamp</TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400">Severity</TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400">Message</TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400">Source IP</TableHead>
                                    <TableHead className="text-slate-500 dark:text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alerts.map((alert, i) => (
                                    <TableRow key={i} className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <TableCell className="font-mono text-slate-600 dark:text-slate-400">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", getSeverityColor(alert.severity))}>
                                                {alert.severity.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-900 dark:text-white">{alert.message}</TableCell>
                                        <TableCell className="font-mono text-slate-600 dark:text-slate-400">{alert.source_ip || 'N/A'}</TableCell>
                                        <TableCell>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">{alert.status}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
