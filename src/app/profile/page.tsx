"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { isDemoMode, demoAuth } from '@/lib/demo-backend';
import { auth } from '@/lib/firebase';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteUserEmbedding } from '@/app/actions/matchmaking';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user && !isDemoMode) {
      getDoc(doc(db, 'users', user.uid)).then(d => {
        if (d.exists()) setUserData(d.data());
      });
    }
  }, [user]);
  const router = useRouter();

  if (loading) return <LoadingScreen />;
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

  const handleDeleteAccount = async () => {
    if (isDemoMode) {
      alert("Cannot delete accounts in Demo Mode.");
      return;
    }
    
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to permanently delete your account?\n\nThis will instantly erase your profile, photos, matches, and all data from our servers. This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    try {
      // 1. Delete from AI Vector Database (Fire and forget)
      deleteUserEmbedding(user.uid).catch(e => console.error(e));
      
      // 2. Delete the profile document from Firestore (this also deletes the base64 photos stored inside it)
      await deleteDoc(doc(db, "users", user.uid));
      
      // 3. Delete the user from Firebase Authentication
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      
      alert("Your account and all associated data have been permanently erased.");
      window.location.href = '/';
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("For security reasons, you need to log out and log back in before deleting your account.");
      } else {
        alert("An error occurred while deleting your account: " + error.message);
      }
    }
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
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Network Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Connected
                </span>
             </div>
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Matchability Score</span>
                <span className="text-white font-bold">94%</span>
             </div>
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Discovery Mode</span>
                <span className="text-white font-bold">Campus Only</span>
             </div>
             <div className="bg-black/50 border border-white/5 p-5 rounded-3xl">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Incognito Mode</span>
                <span className="text-zinc-500 font-bold flex items-center gap-2">
                   <div className="w-10 h-6 bg-zinc-800 rounded-full border border-white/10 relative">
                     <div className="w-4 h-4 bg-zinc-600 rounded-full absolute left-1 top-0.5"></div>
                   </div>
                   Off
                </span>
             </div>
          </div>

          
          {/* Referral Progress UI */}
          <div className="bg-black/50 border border-white/5 p-6 rounded-3xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] -z-10" />
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              🏆 Network Expansion
              {((userData?.referredUsers?.length || userData?.referralCount || 0)) >= 5 && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full uppercase tracking-widest font-black ml-auto">UNLOCKED</span>}
            </h3>
            
            <div className="flex gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-3 flex-1 rounded-full transition-all ${i < ((userData?.referredUsers?.length || userData?.referralCount || 0)) ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`} />
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xs font-medium text-zinc-400 mb-6">
              <span>{(userData?.referredUsers?.length || userData?.referralCount || 0)} / 5 Friends Referred</span>
              <span>{((userData?.referredUsers?.length || userData?.referralCount || 0)) >= 5 ? 'Unlimited Messaging Active' : 'Unlock Unlimited Messaging'}</span>
            </div>

            <button 
               onClick={copyInviteLink}
               className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
               🔗 Copy Invite Link
            </button>
          </div>


        </motion.div>
        
        {/* Account Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 mb-8"
        >
          <h3 className="text-white font-bold text-xl mb-6">Account Settings</h3>
          <div className="space-y-4">
             <button className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Edit Profile Answers</span>
                <span className="text-zinc-500">→</span>
             </button>
             <button className="w-full flex justify-between items-center bg-black/50 border border-white/5 p-5 rounded-2xl text-white hover:bg-white/5 transition-colors">
                <span className="font-medium">Manage Photos</span>
                <span className="text-zinc-500">→</span>
             </button>
             <button 
                onClick={handleDeleteAccount}
                className="w-full flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-rose-500 hover:bg-rose-500/20 transition-colors"
             >
                <span className="font-bold">Delete Account</span>
                <span>⚠️</span>
             </button>
          </div>
        </motion.div>

        {/* Support Developers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 -z-10" />
          <div className="text-center">
             <div className="text-4xl mb-4">☕️</div>
             <h3 className="text-white font-bold text-xl mb-2">Support the Developers</h3>
             <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
               CampusEngage is built and maintained by students. If you found your perfect match or just love the vibes, buy us a coffee to keep the servers running!
             </p>
             <a 
               href="https://buymeacoffee.com/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-block w-full bg-[#FFDD00] text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,221,0,0.2)]"
             >
                Buy me a coffee
             </a>
          </div>
        </motion.div>


      </main>
    </div>
  );
}
