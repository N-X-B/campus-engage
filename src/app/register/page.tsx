"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update display name
      await updateProfile(user, { displayName: name });

      // 3. Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
        onboarded: false,
        referralCount: 0,
      });

      // 4. Redirect to onboarding
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 mb-2 inline-block">
            CampusEngage.
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 mt-4">Create an account</h1>
          <p className="text-sm text-slate-500 mt-2">Join your campus network</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
            />
          </div>

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
              placeholder="you@university.edu"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
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
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-lg mt-6">
            {loading ? 'Creating...' : 'Continue to Profile Setup'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-slate-900 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
