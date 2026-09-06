"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to feed/dashboard (we'll just use root for now or a feed page)
      router.push('/feed');
    } catch (err: any) {
      setError('Invalid email or password.');
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
          <h1 className="text-2xl font-semibold text-slate-900 mt-4">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-2">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <Link href="#" className="text-slate-900 font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-lg mt-6">
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-slate-900 font-medium hover:underline">
            Join now
          </Link>
        </div>
      </div>
    </div>
  );
}
