import React from 'react';
import Link from 'next/link';

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
            <h1 className="text-4xl font-bold mb-4">Live Demo</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-center">
                Experience the power of NetSentinel firsthand.
            </p>
            <div className="w-full max-w-4xl aspect-video bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center mb-8 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <span className="text-slate-500 font-mono">Interactive Demo Loading...</span>
            </div>
            <Link href="/dashboard" className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-colors">
                Go to Dashboard
            </Link>
        </div>
    );
}
