import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Search } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

const AlertTable = ({ alerts }) => {
    const [filter, setFilter] = useState('all');

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'all') return true;
        return alert.severity === filter;
    });

    const severityColor = (severity) => {
        switch(severity?.toLowerCase()) {
            case 'high': return 'bg-rose-100 text-rose-800 border-rose-200';
            case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertCircle className="text-rose-500" />
                    Recent Alerts
                </h3>
                
                <div className="flex gap-2">
                    {['all', 'high', 'medium', 'low'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={clsx(
                                "px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors",
                                filter === f 
                                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" 
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Severity</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Value</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredAlerts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No alerts found matching filter.
                                </td>
                            </tr>
                        ) : (
                            filteredAlerts.map((alert, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {format(new Date(alert.timestamp), 'MMM dd, HH:mm:ss')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx("px-2 py-1 rounded text-xs font-medium border", severityColor(alert.severity))}>
                                            {alert.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                        {alert.message}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                        {alert.value.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center justify-end gap-1 ml-auto">
                                            <CheckCircle size={16} />
                                            Ack
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AlertTable;
