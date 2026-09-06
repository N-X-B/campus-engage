"use client";

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { isDemoMode, demoAuth } from '@/lib/demo-backend';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    if (isDemoMode) {
      demoAuth.logout();
      window.location.href = '/';
      return;
    }
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="max-w-2xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500">
              {user.displayName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.displayName || 'Unknown User'}</h1>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-1">Account Status</h3>
              <p className="text-sm text-slate-600">Active - Registered with University Email</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-1">Referral Unlocks</h3>
              <p className="text-sm text-slate-600">0 / 5 students referred. Invite 5 friends to unlock Direct Messaging!</p>
              <Button variant="outline" className="mt-3 w-full border-slate-300 text-slate-700">Copy Invite Link</Button>
            </div>

            <Button onClick={() => router.push('/onboarding')} className="w-full bg-slate-900 text-white hover:bg-slate-800">
              Edit Profile Details
            </Button>
            
            <Button onClick={handleLogout} variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
