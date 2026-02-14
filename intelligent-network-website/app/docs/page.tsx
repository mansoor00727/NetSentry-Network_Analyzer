import React from 'react';
import Link from 'next/link';
import { Book } from 'lucide-react';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
            <Book size={48} className="text-indigo-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md text-center">
                Comprehensive guides and API references are currently being written. Check back soon!
            </p>
            <Link href="/" className="text-indigo-500 hover:text-indigo-400 font-medium">
                ← Return Home
            </Link>
        </div>
    );
}
