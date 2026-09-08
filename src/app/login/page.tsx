"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { isDemoMode, demoAuth } from '@/lib/demo-backend';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { motion, AnimatePresence } from 'framer-motion';


const timeoutPromise = (ms: number, message: string) => 
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginState('loading');

    try {
      if (isDemoMode) {
        await demoAuth.signIn(email);
        setLoginState('success');
        setTimeout(() => {
          window.location.href = '/feed'; // using router.push instead of window.location for smoother SPA transition
        }, 1200);
        return;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      let userData = null;
      try {
        const userDoc = (await Promise.race([ getDoc(doc(db, 'users', userCredential.user.uid)), timeoutPromise(1500, 'timeout') ])) as any;
        userData = userDoc.data();
      } catch (dbErr) {
        console.warn("[LOGIN] Failed to get user document. Network blocked? Proceeding to onboarding as fallback.", dbErr);
      }
      
      setLoginState('success');
      setTimeout(() => {
        if (userData && userData.onboarded) {
          window.location.href = '/feed';
        } else {
          window.location.href = '/onboarding';
        }
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      setLoginState('idle');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] items-center justify-center p-4 overflow-hidden relative">
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        {loginState !== 'success' ? (
          <motion.div 
            key="login-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-8 z-10"
          >
            <div className="text-center mb-8">
              <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 mb-2 inline-block">
                CampusEngage.
              </Link>
              <h1 className="text-2xl font-semibold text-slate-900 mt-4">Welcome back</h1>
              <p className="text-sm text-slate-500 mt-2">Sign in to your account to continue</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                  University Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginState === 'loading'}
                  placeholder="you@university.edu"
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginState === 'loading'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loginState === 'loading'} 
                className="w-full bg-slate-900 text-white hover:bg-slate-800 h-14 text-lg font-medium rounded-xl mt-6 shadow-md transition-all active:scale-95 flex items-center justify-center overflow-hidden relative"
              >
                {loginState === 'loading' ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Sign In'}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-slate-950 z-50"
          >
             <motion.div 
               initial={{ scale: 0.8 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 200, damping: 20 }}
               className="flex font-extrabold text-5xl md:text-7xl tracking-tighter text-slate-900 items-center"
             >
               <span className="relative z-10">C</span>
               <motion.span 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "auto", opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 className="overflow-hidden whitespace-nowrap block text-slate-800 pr-2"
               >
                 ampus
               </motion.span>
               <span className="relative z-10">E</span>
               <motion.span 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "auto", opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 className="overflow-hidden whitespace-nowrap block text-slate-800 pr-2"
               >
                 ngage.
               </motion.span>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
