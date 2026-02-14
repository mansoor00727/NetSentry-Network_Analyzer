import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
            <div className="p-4 bg-indigo-500/10 rounded-full mb-6">
                 <Mail size={32} className="text-indigo-500" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-sm">
                Have questions or need support? Reach out to our team.
            </p>
            
            <form className="w-full max-w-sm space-y-4 mb-8">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" placeholder="you@example.com" className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea placeholder="How can we help?" rows={4} className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button type="button" className="w-full py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium">
                    Send Message
                </button>
            </form>

            <Link href="/" className="text-sm text-slate-500 hover:text-indigo-500">
                Back to Home
            </Link>
        </div>
    );
}
