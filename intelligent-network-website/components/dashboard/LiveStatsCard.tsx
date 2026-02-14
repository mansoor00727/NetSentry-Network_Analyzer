"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LiveStatsCardProps {
    title: string;
    value: string;
    unit: string;
    color: string;
    icon: LucideIcon;
    trend?: number;
    delay?: number;
}

const LiveStatsCard: React.FC<LiveStatsCardProps> = ({ title, value, unit, color, icon: Icon, trend, delay = 0 }) => {
    
    const colorMap: Record<string, { bg: string, text: string, border: string, iconBg: string }> = {
        indigo: { bg: "from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/10 dark:to-indigo-500/5", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/20", iconBg: "bg-indigo-500/10" },
        emerald: { bg: "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/10 dark:to-emerald-500/5", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", iconBg: "bg-emerald-500/10" },
        blue: { bg: "from-blue-500/10 to-blue-500/5 dark:from-blue-500/10 dark:to-blue-500/5", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20", iconBg: "bg-blue-500/10" },
        rose: { bg: "from-rose-500/10 to-rose-500/5 dark:from-rose-500/10 dark:to-rose-500/5", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20", iconBg: "bg-rose-500/10" },
    };

    const theme = colorMap[color] || colorMap.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay * 0.1, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <Card className={cn(
                "relative overflow-hidden bg-white/80 dark:bg-slate-950/40 backdrop-blur-xl border-slate-200 dark:border-white/5 shadow-xl transition-all duration-300 group",
                "hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/10 hover:border-slate-300 dark:hover:border-white/10"
            )}>
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", theme.bg)} />
                
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        {title}
                    </CardTitle>
                    <div className={cn("p-2 rounded-lg border border-transparent transition-all duration-300", theme.iconBg, theme.text, "group-hover:scale-110")}>
                        <Icon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {value} <span className="text-sm font-medium text-slate-500 ml-1">{unit}</span>
                    </div>
                    {trend !== undefined && (
                        <div className="flex items-center mt-2 space-x-2">
                             <div className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold border", trend > 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20")}>
                                {trend > 0 ? "+" : ""}{trend}%
                            </div>
                            <span className="text-xs text-slate-500">vs last hour</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default LiveStatsCard;
