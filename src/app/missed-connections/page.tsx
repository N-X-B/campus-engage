"use client";

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MissedConnectionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isIncognito, setIsIncognito] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then(d => {
        if (d.exists()) {
          setIsIncognito(d.data().incognito === true);
        }
      });
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-indigo-500/30 pb-24">
      <Navigation />

      <main className="max-w-md mx-auto p-4 sm:p-6 mt-4">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{isIncognito ? 'Confessions' : 'Spotted'}</h1>
            <p className="text-zinc-400 mt-1">{isIncognito ? 'Anonymous campus confessions.' : 'Missed connections on campus.'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
           <div className="relative group cursor-default">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
             <div className="relative w-full bg-black/50 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden group-hover:border-white/20 transition-all duration-300 min-h-[300px]">
               <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-[50px] pointer-events-none"></div>
               <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none"></div>
               
               <div className="text-6xl mb-6 relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">🚧</div>
               <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Undergoing Renovations</h3>
               <p className="text-zinc-400 text-base max-w-sm relative z-10 leading-relaxed">
                 The {isIncognito ? 'confessions' : 'spotted'} section is temporarily disabled for a major <span className="text-indigo-400 font-bold">Aura Engine</span> upgrade. We'll be back shortly.
               </p>
             </div>
           </div>
        </div>
      </main>
    </div>
  );
}
