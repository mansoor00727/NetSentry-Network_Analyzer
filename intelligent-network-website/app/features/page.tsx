import React from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
                Advanced Features
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md text-center">
                Explore our suite of intelligent network analysis tools, including real-time packet inspection, ML-based anomaly detection, and predictive maintenance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {['Real-Time Monitoring', 'Anomaly Detection', 'Predictive Analysis'].map((feature) => (
                    <div key={feature} className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">{feature}</h3>
                        <p className="text-sm text-slate-500">Coming soon with the v1.0 release.</p>
                    </div>
                ))}
            </div>
            <Link href="/" className="px-6 py-2 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity">
                Back Home
            </Link>
        </div>
    );
}
