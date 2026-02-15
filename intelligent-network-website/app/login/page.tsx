"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useNetworkStore from '@/lib/store/useNetworkStore';

import { getApiUrl } from '@/lib/config';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch(getApiUrl('/api/token'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await res.json();
      
      // Update global store
      useNetworkStore.getState().setToken(data.access_token);

      // Set cookie for middleware
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Strict`;

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert("Login failed: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 p-4"
      >
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-full ring-1 ring-indigo-500/20">
                <ShieldCheck className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the NetSentinel Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input 
                    id="username" 
                    placeholder="admin" 
                    className="pl-9 bg-slate-950/50 border-slate-800 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9 bg-slate-950/50 border-slate-800 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Authenticating...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        Validating Credentials <ArrowRight className="w-4 h-4" />
                    </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
             <p className="text-xs text-slate-500 text-center px-8">
                Protected by military-grade encryption. Unauthorized access is prohibited.
             </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
