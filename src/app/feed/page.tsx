"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import { calculateMatchScore } from '@/lib/matchAlgorithm';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ICEBREAKERS = [
  "What's the most overrated dining hall on campus?",
  "If you had to study in one library forever, which one?",
  "What is your most controversial campus opinion?",
  "Best spot for a late-night food run?",
  "What's the hardest class you've taken so far?"
];

export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [icebreakerModal, setIcebreakerModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [selectedProfileForBrief, setSelectedProfileForBrief] = useState<any | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      try {
        let fetchedProfiles: any[] = [];
        
        if (isDemoMode) {
          fetchedProfiles = await demoDb.getProfiles();
        } else {
          const q = query(collection(db, "users"), where("uid", "!=", user.uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            fetchedProfiles.push({ id: doc.id, ...doc.data() });
          });
        }
        
        const scoredProfiles = fetchedProfiles
          .filter(p => p.onboarded)
          .map(p => ({
            ...p,
            matchScore: calculateMatchScore(user, p)
          }))
          .sort((a, b) => b.matchScore - a.matchScore); 

        setProfiles(scoredProfiles);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfiles();
  }, [user]);

  const openIcebreaker = (targetUser: any) => {
    setSelectedUser(targetUser);
    setSelectedPrompt(ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)]);
    setIcebreakerModal(true);
  };

  const sendIcebreakerMessage = async () => {
    if (!user || !selectedUser) return;
    if (isDemoMode) {
      const convId = `conv-${selectedUser.id}`;
      demoDb.sendMessage(convId, selectedPrompt, user.uid, user.displayName || 'Unknown');
      router.push(`/chat/${convId}`);
      return;
    }
    try {
       router.push(`/chat/${selectedUser.id}`);
    } catch(e) {}
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'bg-rose-500 text-white border-rose-400';
    if (score >= 70) return 'bg-emerald-500 text-white border-emerald-400';
    return 'bg-white/20 text-white border-white/30 backdrop-blur-md';
  };

  if (loading || fetching) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20 md:pb-0 font-sans selection:bg-indigo-500/30">
      <Navigation />
      
      {/* Profile Brief Modal Overlay */}
      <AnimatePresence>
        {selectedProfileForBrief && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
            onClick={() => setSelectedProfileForBrief(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden max-w-md w-full shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <div className="relative aspect-[4/5] w-full shrink-0">
                 {selectedProfileForBrief.photos && selectedProfileForBrief.photos.length > 0 ? (
                   <img src={selectedProfileForBrief.photos[0]} alt="profile" className="object-cover w-full h-full" />
                 ) : (
                   <div className="w-full h-full bg-slate-800" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                 
                 <button onClick={() => setSelectedProfileForBrief(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10">
                   ✕
                 </button>
                 
                 <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 mb-2">
                       <h2 className="text-4xl font-bold text-white tracking-tight">{selectedProfileForBrief.name}</h2>
                    </div>
                    <p className="text-slate-300 font-medium text-lg">{selectedProfileForBrief.branch} • Year {selectedProfileForBrief.year}</p>
                 </div>
              </div>
              
              <div className="p-6 pt-2 bg-slate-900">
                 <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 mb-6">
                   <p className="text-slate-300 italic text-lg leading-relaxed">"{selectedProfileForBrief.bio}"</p>
                 </div>

                 {selectedProfileForBrief.answers && (
                   <div className="space-y-5 mb-8">
                     <div>
                       <h3 className="text-xs font-bold uppercase text-indigo-400 mb-2 tracking-widest">Campus Hot Take</h3>
                       <p className="text-white font-medium text-lg bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">{selectedProfileForBrief.answers.hotTake}</p>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl">{selectedProfileForBrief.answers.studyVibe}</span>
                       <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl">{selectedProfileForBrief.answers.weekendVibe}</span>
                     </div>
                   </div>
                 )}

                 <button onClick={() => { setSelectedProfileForBrief(null); openIcebreaker(selectedProfileForBrief); }} className="w-full bg-white text-black rounded-2xl py-4 font-bold text-lg hover:bg-slate-200 transition shadow-lg hover:-translate-y-1">
                   Break the Ice
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icebreaker & Report Modals remain mostly same, just styled darker */}
      <AnimatePresence>
        {icebreakerModal && selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-lg p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Break the ice</h2>
                   <p className="text-slate-400 mt-1">Sending to {selectedUser.name}</p>
                 </div>
                 <button onClick={() => setIcebreakerModal(false)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl mb-8 relative">
                 <p className="text-indigo-300 font-medium text-xl text-center leading-relaxed">"{selectedPrompt}"</p>
                 <button onClick={() => setSelectedPrompt(ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)])} className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 shadow-xl text-slate-300 text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-700 transition">
                    🎲 Shuffle Prompt
                 </button>
              </div>
              <button onClick={sendIcebreakerMessage} className="w-full bg-white text-black rounded-xl py-4 font-bold text-lg hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Send & Open Chat
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-md mx-auto p-4 sm:p-6 mt-4">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Discover</h1>
            <p className="text-slate-400 mt-1">Immersive matchability.</p>
          </div>
          {isDemoMode && <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold border border-orange-500/30">DEMO MODE</span>}
        </div>
        
        {profiles.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-xl font-bold text-white">No profiles left.</h3>
            <p className="text-slate-500 mt-2">Check back later for new people.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {profiles.map((p, index) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden aspect-[4/5] flex flex-col group"
              >
                {/* Background Image */}
                <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedProfileForBrief(p)}>
                  {p.photos && p.photos.length > 0 ? (
                    <img src={p.photos[0]} alt={p.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-slate-800" />
                  )}
                  {/* Heavy dark gradient overlay at bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                
                {/* Badges Overlay */}
                <div className="absolute top-5 left-5 right-5 flex justify-between z-10">
                  <div className={`px-3 py-1.5 rounded-full border text-xs font-bold shadow-lg backdrop-blur-md ${getMatchColor(p.matchScore)}`}>
                     {p.matchScore}% Match
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedUser(p); setReportModal(true); }} 
                    className="bg-black/40 hover:bg-red-500/90 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                  >
                    Report
                  </button>
                </div>
                
                {/* Content at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 pointer-events-none">
                  <div className="flex justify-between items-end mb-2">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">{p.name}</h2>
                  </div>
                  <p className="text-slate-300 font-medium mb-3 text-lg drop-shadow-md">{p.branch} • Year {p.year}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.answers && (
                      <>
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                          {p.answers.weekendVibe}
                        </span>
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                          {p.answers.studyVibe.includes('Beats') ? 'Coffee Shop' : 'Library'}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="pointer-events-auto">
                    <button 
                      onClick={() => openIcebreaker(p)} 
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-2xl py-4 font-bold text-lg transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                    >
                      Break the Ice 🧊
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
