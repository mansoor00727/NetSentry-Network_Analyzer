import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import clsx from 'clsx';

const LiveStatsCard = ({ title, value, unit, trend, icon: Icon, color }) => {
    // Generate color classes based on prop
    const bgClass = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
        amber: 'bg-amber-50 dark:bg-amber-900/20',
        rose: 'bg-rose-50 dark:bg-rose-900/20',
        blue: 'bg-blue-50 dark:bg-blue-900/20',
    }[color] || 'bg-gray-50';

    const textClass = {
        indigo: 'text-indigo-600 dark:text-indigo-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        amber: 'text-amber-600 dark:text-amber-400',
        rose: 'text-rose-600 dark:text-rose-400',
        blue: 'text-blue-600 dark:text-blue-400',
    }[color] || 'text-gray-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider">
                    {title}
                </span>
                <div className={clsx("p-2 rounded-lg", bgClass, textClass)}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="flex items-baseline space-x-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {value}
                </h3>
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {unit}
                </span>
            </div>

            {trend !== undefined && (
                <div className="mt-4 flex items-center space-x-2">
                    <div className={clsx(
                        "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
                        trend >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                        {trend >= 0 ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                        {Math.abs(trend)}%
                    </div>
                    <span className="text-xs text-slate-400">vs last hour</span>
                </div>
            )}
        </motion.div>
    );
};

export default LiveStatsCard;
