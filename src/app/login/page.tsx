"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { getUserOnServer } from '@/app/actions/profile';
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
  const [resetMessage, setResetMessage] = useState('');
  
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');
  const router = useRouter();

    const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your university email first to reset your password.');
      setResetMessage('');
      return;
    }
    if (isDemoMode) {
      setError('Cannot reset passwords in Demo Mode.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset link sent! Check your email inbox to create a new password.');
      setError('');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
      setResetMessage('');
    }
  };

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
      let dbFailed = false;
      try {
        console.log("[LOGIN] Fetching user doc via Server Action...");
        const result = await getUserOnServer(userCredential.user.uid);
        if (result.success) {
          userData = result.data;
        } else {
          throw new Error(result.error);
        }
      } catch (dbErr) {
        console.warn("[LOGIN] Server Action failed. Network blocked? Proceeding to feed as fallback.", dbErr);
        dbFailed = true;
      }
      
      setLoginState('success');
      setTimeout(() => {
        // If DB fails, assume they are returning user to avoid forcing onboarding loop
        if (dbFailed || (userData && (userData as any).onboarded)) {
          window.location.href = '/feed';
        } else {
          window.location.href = '/onboarding';
        }
      }, 500);
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
            className="w-full max-w-md bg-black/50 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 p-8 z-10"
          >
            <div className="text-center mb-8">
              <Link href="/" className="text-xl font-bold tracking-tight text-white mb-2 inline-block">
                CampusEngage.
              </Link>
              <h1 className="text-2xl font-semibold text-white mt-4">Welcome back</h1>
              <p className="text-sm text-zinc-400 mt-2">Sign in to your account to continue</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 p-3 bg-red-500/10 text-rose-400 text-sm rounded-lg border border-red-500/20 backdrop-blur-md">
                {error}
              </motion.div>
            )}
            {resetMessage && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4 p-3 bg-emerald-500/10 text-emerald-400 text-sm rounded-lg border border-emerald-500/20 backdrop-blur-md">
                {resetMessage}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="email">
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
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 backdrop-blur-md transition-all disabled:opacity-50"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-zinc-300" htmlFor="password">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={handleResetPassword}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginState === 'loading'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 backdrop-blur-md transition-all disabled:opacity-50"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loginState === 'loading'} 
                className="w-full bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] h-14 text-lg font-medium rounded-xl mt-6 shadow-md transition-all active:scale-95 flex items-center justify-center overflow-hidden relative"
              >
                {loginState === 'loading' ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : 'Sign In'}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black z-50"
          >
             <motion.div 
               initial={{ scale: 0.8 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 200, damping: 20 }}
               className="flex font-extrabold text-5xl md:text-7xl tracking-tighter text-white items-center"
             >
               <span className="relative z-10">C</span>
               <motion.span 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "auto", opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 className="overflow-hidden whitespace-nowrap block text-zinc-500 pr-2"
               >
                 ampus
               </motion.span>
               <span className="relative z-10">E</span>
               <motion.span 
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: "auto", opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 className="overflow-hidden whitespace-nowrap block text-zinc-500 pr-2"
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
