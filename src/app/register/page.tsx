"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { isDemoMode, demoAuth } from '@/lib/demo-backend';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { motion } from 'framer-motion';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralId = searchParams.get('ref');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isDemoMode) {
        await demoAuth.register(email, name);
        // We skip referral logic in demo mode for simplicity, as it relies on real backend coordination
        window.location.href = '/onboarding';
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
        referralCount: 0,
        referredBy: referralId || null
      });

      // If they were referred, update the referrer's count
      if (referralId) {
        try {
          const referrerRef = doc(db, 'users', referralId);
          await updateDoc(referrerRef, {
            referralCount: increment(1)
          });
        } catch (err) {
          console.error("Failed to update referral count", err);
        }
      }

      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-900 mb-2 inline-block">
          CampusEngage.
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Initialize Profile</h1>
        <p className="text-zinc-400 mt-2">Create an account to join the network.</p>
        {referralId && (
           <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
             <p className="text-indigo-400 text-sm font-bold">🎉 You were invited by a friend!</p>
           </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="e.g. John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">University Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="student@university.edu"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="••••••••"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-lg font-bold rounded-xl mt-4"
        >
          {loading ? 'Creating Account...' : 'Continue to Vibe Check →'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-zinc-500 text-sm">
          Already on the network?{' '}
          <Link href="/login" className="text-slate-900 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-white/20">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]" />
         <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-rose-600/10 rounded-full blur-[120px]" />
      </div>

      <Suspense fallback={<div className="text-slate-900 text-center">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
