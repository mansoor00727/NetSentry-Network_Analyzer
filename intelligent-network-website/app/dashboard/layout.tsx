"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/dashboard/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle"; 
import useNetworkStore from '@/lib/store/useNetworkStore';

import useUIStore from '@/lib/store/useUIStore';
import clsx from 'clsx';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const token = useNetworkStore((state) => state.token);
  const { isSidebarCollapsed } = useUIStore();

  useEffect(() => {
    // Simple auth check
    if (!token) {
       router.push('/login');
    }
  }, [token, router]);

  if (!token) {
      return null; // Or a loading spinner
  }

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Sidebar />
      <main className={clsx(
        "flex-1 p-8 transition-all duration-300",
        isSidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="flex justify-end mb-6">
            <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}

