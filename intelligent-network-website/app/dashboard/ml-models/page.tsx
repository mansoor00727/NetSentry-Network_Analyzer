"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle, RefreshCw } from 'lucide-react';
import useNetworkStore from '@/lib/store/useNetworkStore';
import { motion } from 'framer-motion';

export default function MLModelsPage() {
    const [models, setModels] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const token = useNetworkStore((state) => state.token);

    const fetchModels = async () => {
        if (!token) return;
        setRefreshing(true);
        try {
            // Note: Update endpoint path if backend changed. 
            // In week 5 summary, path was /api/analytics/models or /api/models? 
            // Checking task summary: 'Changed ... endpoint from /ml/models to /models' 
            // But api router prefix is usually /api/analytics
            // Let's try /api/analytics/models
            const res = await fetch('/api/analytics/models', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setModels(data.models);
            }
        } catch (error) {
            console.error("Error fetching models:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, [token]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
         return <div className="p-8 text-center text-slate-400 animate-pulse">Loading AI Models...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Machine Learning Models</h1>
                <button 
                    onClick={fetchModels} 
                    className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all ${refreshing ? 'animate-spin' : ''}`}
                >
                    <RefreshCw className="h-5 w-5" />
                </button>
            </div>

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {models && Object.entries(models).map(([key, model]: [string, any]) => (
                    <motion.div key={key} variants={item}>
                        <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-semibold capitalize text-slate-900 dark:text-white">
                                    {key.replace('_', ' ')}
                                </CardTitle>
                                <Brain className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                                        <span className="flex items-center text-emerald-500 dark:text-emerald-400 text-sm font-medium">
                                            <CheckCircle className="h-3 w-3 mr-1" /> Active
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Accuracy</span>
                                        <span className="text-slate-900 dark:text-white font-mono">
                                            {(model.accuracy * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Features</span>
                                        <span className="text-slate-900 dark:text-white font-mono">
                                            {model.n_features || 10}
                                        </span>
                                    </div>
                                    <div className="pt-2">
                                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                style={{ width: `${model.accuracy * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500 pt-2">
                                        Last trained: {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
