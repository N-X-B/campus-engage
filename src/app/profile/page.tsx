"use client";

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { isDemoMode, demoAuth } from '@/lib/demo-backend';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;
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

  const copyInviteLink = () => {
    const link = `https://campusengage.vercel.app/register?ref=${user.uid}`;
    navigator.clipboard.writeText(link);
    alert("Invite link copied to clipboard! Share it with 5 friends to unlock full chat features.");
  };

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-0 font-sans selection:bg-white/20">
      <Navigation />
      
      <main className="max-w-2xl mx-auto p-4 sm:p-6 mt-4">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Profile</h1>
            <p className="text-zinc-500 mt-1 text-lg">Manage your identity.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-rose-500 transition-colors"
          >
            Logout
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden shadow-2xl"
        >
          {/* Subtle gradient behind profile */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-zinc-800 rounded-full border-2 border-white/10 flex items-center justify-center text-4xl grayscale">
               👤
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{user.displayName || "Anonymous Student"}</h2>
              <p className="text-zinc-400 font-medium">{user.email || "No email provided"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-black/50 border border-white/5 p-5 rounded-2xl">
                <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
             </div>
             <div className="bg-black/50 border border-white/5 p-5 rounded-2xl">
                <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Matchability</span>
                <span className="text-white font-bold">Calibrating...</span>
             </div>
          </div>

          <button 
             onClick={copyInviteLink}
             className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
          >
             🔗 Copy Invite Link
          </button>
          <p className="text-center text-xs text-zinc-500 mt-4 font-medium px-4">
             Unlock unlimited messaging by referring 5 friends to the network.
          </p>

        </motion.div>

      </main>
    </div>
  );
}
