"use client";

import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, doc, setDoc, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import { calculateMatchScore } from '@/lib/matchAlgorithm';
import { getTopMatches } from '@/app/actions/matchmaking';
import { getProfilesOnServer } from '@/app/actions/profile';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';


const INTEREST_GROUPS = {
  "Academics 📚": ["Study Group", "Library Grind", "Tech & Hackathons", "Startup Building"],
  "Social & Nightlife 🪩": ["Greek Life", "Bar Crawls", "House Parties", "Cafe Hopping"],
  "Hobbies & Arts 🎨": ["Dance Crew", "Jam Sessions", "Gaming & Esports", "Photography"],
  "Sports & Fitness 💪": ["Gym Partners", "Intramural Sports", "Running / Hiking", "Yoga & Wellness"]
};

const ICEBREAKERS = [
  "What's the most overrated dining hall on campus?",
  "If you had to study in one library forever, which one?",
  "What is your most controversial campus opinion?",
  "Best spot for a late-night food run?",
  "What's the hardest class you've taken so far?"
];


const timeoutPromise = (ms: number, message: string) => 
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));

export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterError, setFilterError] = useState("");
  // Keep all fetched profiles to filter locally
  const [allFetchedProfiles, setAllFetchedProfiles] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [icebreakerModal, setIcebreakerModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [promptOptions, setPromptOptions] = useState<string[]>([]);
  const [breakingIceId, setBreakingIceId] = useState<string | null>(null);
  const [shatterPos, setShatterPos] = useState<{x: number, y: number, width: number} | null>(null);
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
        if (!isDemoMode) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) setUserData(userDoc.data());
        }
        let fetchedProfiles: any[] = [];
        
        if (isDemoMode) {
          fetchedProfiles = await demoDb.getProfiles();
        } else {
          try {
            console.log("[FEED] Fetching profiles via Server Action (bypassing firewall)...");
            const result = await getProfilesOnServer();
            if (result.success && result.profiles) {
               fetchedProfiles = result.profiles;
               
               if (fetchedProfiles.length <= 1) {
                 console.warn("[FEED] Database is empty. Injecting Demo users.");
                 fetchedProfiles = await demoDb.getProfiles();
               }
            } else {
               throw new Error(result.error || "Server Action Failed");
            }
          } catch (err) {
            console.warn("[FEED] Server Action failed. Falling back to Demo Mode.", err);
            fetchedProfiles = await demoDb.getProfiles();
          }
        } // CLOSED THE ELSE BLOCK HERE
        
        let scoredProfiles = [];
        
        // Try AI Vector Database Matchmaking first
        if (!isDemoMode && user) {
          try {
            const aiMatches = await getTopMatches(user.uid, 50);
            if (aiMatches.success && aiMatches.matches.length > 0) {
              const aiScoreMap = new Map();
              aiMatches.matches.forEach((m: any) => aiScoreMap.set(m.id, m.score));
              
              scoredProfiles = fetchedProfiles
                .filter(p => p.onboarded && p.id !== user.uid && aiScoreMap.has(p.id))
                .map(p => ({
                  ...p,
                  // Scale Pinecone cosine similarity (usually 0 to 1, sometimes 0 to 100) to our 1-100 scale
                  matchScore: Math.round(aiScoreMap.get(p.id) * 100)
                }))
                .sort((a, b) => b.matchScore - a.matchScore);
            }
          } catch (e) {
            console.error("AI Matchmaking skipped/failed (using fallback):", e);
          }
        }
        
        // Fallback to basic string-matching algorithm if AI is missing keys or fails
        if (scoredProfiles.length === 0) {
          scoredProfiles = fetchedProfiles
            .filter(p => p.onboarded && p.id !== user.uid)
            .map(p => ({
              ...p,
              matchScore: calculateMatchScore(user, p)
            }))
            .sort((a, b) => b.matchScore - a.matchScore);
        }

        // --- DAILY SCARCITY LIMIT (15 to 25) ---
        // Deterministic daily limit based on user UID and Date
        const today = new Date().toISOString().split('T')[0];
        const seedStr = user.uid + today;
        let seed = 0;
        for (let i = 0; i < seedStr.length; i++) {
          seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
          seed = seed & seed;
        }
        
        // Random limit between 15 and 25
        const dailyLimit = 15 + (Math.abs(seed) % 11);
        
        // Take the top matches up to the daily limit
        scoredProfiles = scoredProfiles.slice(0, dailyLimit);

        setProfiles(scoredProfiles);

      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfiles();
  }, [user]);

    
  useEffect(() => {
    if (selectedFilters.length === 0) {
      setProfiles(allFetchedProfiles);
      return;
    }
    const filtered = allFetchedProfiles.filter(p => {
      if (!p.interests || !Array.isArray(p.interests)) return false;
      return selectedFilters.some(filter => p.interests.includes(filter));
    });
    setProfiles(filtered);
  }, [selectedFilters, allFetchedProfiles]);

  const handleBreakIceClick = (e: any, p: any, isModal: boolean = false) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setShatterPos({ x: rect.left, y: rect.top, width: rect.width });
    setBreakingIceId(p.id);
    setTimeout(() => {
      if (isModal) setSelectedProfileForBrief(null);
      openIcebreaker(p);
      setBreakingIceId(null);
      setShatterPos(null);
    }, 400);
  };

  const openIcebreaker = (targetUser: any) => {
    setSelectedUser(targetUser);
    const shuffled = [...ICEBREAKERS].sort(() => 0.5 - Math.random());
    setPromptOptions(shuffled.slice(0, 3));
    setIcebreakerModal(true);
  };

  const sendIcebreakerMessage = async (promptToSend: string) => {
    if (!user || !selectedUser) return;
    
    // In Demo Mode, just behave normally
    if (isDemoMode) {
      alert("Icebreaker sent! (Demo Mode)");
      setIcebreakerModal(false);
      return;
    }

    try {
      const convId = [user.uid, selectedUser.id].sort().join('_');
      
      // We create a conversation document but mark it as pending
      // and we store the prompt so the receiver can see it before accepting.
      await setDoc(doc(db, 'conversations', convId), {
         participants: [user.uid, selectedUser.id],
         status: 'pending',
         senderId: user.uid,
         receiverId: selectedUser.id,
         icebreakerPrompt: promptToSend,
         lastUpdated: Date.now()
      }, { merge: true });

      alert("Invitation sent! You can chat once they accept your Icebreaker.");
      setIcebreakerModal(false);
      
      // Remove them from the feed locally so we don't see them again
      setProfiles(prev => prev.filter(p => p.id !== selectedUser.id));
      
    } catch(e) {
      console.error(e);
      alert("Failed to send invitation.");
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'bg-rose-500 text-white border-rose-400';
    if (score >= 70) return 'bg-emerald-500 text-white border-emerald-400';
    return 'bg-white/20 text-white border-white/30 backdrop-blur-md';
  };

  if (loading || fetching) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-0 font-sans selection:bg-indigo-500/30">
      <Navigation />
      
      
      {/* Vibe Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden max-w-md w-full shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                 <div>
                   <h2 className="text-xl font-bold text-white mb-1">Filter by Campus Groups</h2>
                   <p className="text-xs text-zinc-400">Select up to 5 groups to match with.</p>
                 </div>
                 <button onClick={() => setShowFilterModal(false)} className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">✕</button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {filterError && <p className="text-rose-400 text-sm font-bold bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">{filterError}</p>}
                
                {Object.entries(INTEREST_GROUPS).map(([category, tags]) => (
                  <div key={category}>
                    <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {(tags as string[]).map(tag => {
                        const isSelected = selectedFilters.includes(tag);
                        const atLimit = selectedFilters.length >= 5;
                        const disabled = !isSelected && atLimit;
                        
                        return (
                          <button
                            key={tag}
                            disabled={disabled}
                            onClick={() => {
                               setFilterError("");
                               if (isSelected) {
                                 setSelectedFilters(prev => prev.filter(f => f !== tag));
                               } else {
                                 if (atLimit) {
                                   setFilterError("You can only select up to 5 campus groups to filter by!");
                                   return;
                                 }
                                 setSelectedFilters(prev => [...prev, tag]);
                               }
                            }}
                            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                               isSelected 
                                 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-transparent' 
                                 : disabled 
                                    ? 'bg-black/20 text-zinc-600 border border-white/5 cursor-not-allowed' 
                                    : 'bg-black/50 text-zinc-400 border border-white/10 hover:border-white/30'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
                 <button 
                   onClick={() => setShowFilterModal(false)}
                   className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors shadow-lg"
                 >
                   Apply Filters
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Brief Modal Overlay */}

      <AnimatePresence>
        {selectedProfileForBrief && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 bg-zinc-800 p-4"
            onClick={() => setSelectedProfileForBrief(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 rounded-[2rem] border border-zinc-800 overflow-hidden max-w-md w-full shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <div className="relative aspect-[4/5] w-full shrink-0">
                 {selectedProfileForBrief.photos && selectedProfileForBrief.photos.length > 0 ? (
                   <img src={selectedProfileForBrief.photos[0]} alt="profile" className="object-cover w-full h-full" />
                 ) : (
                   <div className="w-full h-full bg-zinc-800" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                 
                 <button onClick={() => setSelectedProfileForBrief(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10">
                   ✕
                 </button>
                 
                 <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 mb-2">
                       <h2 className="text-4xl font-bold text-white tracking-tight">{selectedProfileForBrief.name}</h2>
                    </div>
                    <p className="text-zinc-300 font-medium text-lg">{selectedProfileForBrief.branch} • Year {selectedProfileForBrief.year}</p>
                 </div>
              </div>
              
              <div className="p-6 pt-2 bg-zinc-900">
                 <div className="bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700/50 mb-6">
                   <p className="text-zinc-300 italic text-lg leading-relaxed">"{selectedProfileForBrief.bio}"</p>
                 </div>

                 {selectedProfileForBrief.answers && (
                   <div className="space-y-5 mb-8">
                     <div>
                       <h3 className="text-xs font-bold uppercase text-indigo-400 mb-2 tracking-widest">Campus Hot Take</h3>
                       <p className="text-white font-medium text-lg bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">{selectedProfileForBrief.answers.hotTake}</p>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl">{selectedProfileForBrief.answers.studyVibe}</span>
                       <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl">{selectedProfileForBrief.answers.weekendVibe}</span>
                     </div>
                   </div>
                 )}

                 <div className="relative h-16 w-full mt-4">
                   <AnimatePresence>
                     {breakingIceId === selectedProfileForBrief.id ? (
                        <div className="absolute inset-0 pointer-events-none" />
                     ) : (
                       <motion.button 
                         key="btn"
                         exit={{ opacity: 0, scale: 1.1 }}
                         onClick={(e) => handleBreakIceClick(e, selectedProfileForBrief, true)} 
                         className="absolute inset-0 w-full bg-white text-black rounded-2xl py-4 font-bold text-lg hover:bg-zinc-200 transition shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
                       >
                         Break the Ice 🧊
                       </motion.button>
                     )}
                   </AnimatePresence>
                 </div>
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
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Break the ice</h2>
                   <p className="text-zinc-400 mt-1">Sending to {selectedUser.name}</p>
                 </div>
                 <button onClick={() => setIcebreakerModal(false)} className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white">✕</button>
              </div>
              <div className="space-y-3 mb-8">
                {promptOptions.map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => sendIcebreakerMessage(prompt)}
                    className="w-full text-left p-4 bg-zinc-800/50 hover:bg-white hover:text-black border border-zinc-700/50 rounded-2xl text-zinc-300 transition-all font-medium text-lg shadow-sm"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
              <button onClick={() => {
                const shuffled = [...ICEBREAKERS].sort(() => 0.5 - Math.random());
                setPromptOptions(shuffled.slice(0, 3));
              }} className="w-full py-3 text-sm text-zinc-500 font-bold hover:text-white transition uppercase tracking-widest bg-zinc-800/30 rounded-xl">
                🎲 Shuffle Options
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 mt-4">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Daily Batch</h1>
            <p className="text-zinc-400 mt-1">Curated picks, refreshing at midnight.</p>
          </div>
          {isDemoMode && <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold border border-orange-500/30">DEMO MODE</span>}
        </div>

        {/* Intent / Domain Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
             onClick={() => setShowFilterModal(true)}
             className="px-4 py-2 rounded-full font-bold text-sm transition-all bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2"
          >
             <span className="text-lg">🎯</span> Filter Vibes {selectedFilters.length > 0 && `(${selectedFilters.length}/5)`}
          </button>
          
          {selectedFilters.length === 0 && (
             <span className="px-4 py-2 rounded-full font-bold text-sm bg-white text-black shadow-sm">
               All Campus
             </span>
          )}

          {selectedFilters.map(filter => (
             <button 
               key={filter}
               onClick={() => setSelectedFilters(prev => prev.filter(f => f !== filter))}
               className="px-4 py-2 rounded-full font-bold text-sm bg-zinc-800 text-white border border-white/10 hover:border-rose-500/50 hover:text-rose-400 transition-colors flex items-center gap-2 group"
             >
               {filter}
               <span className="text-zinc-500 group-hover:text-rose-400 transition-colors">✕</span>
             </button>
          ))}
        </div>
        
        {profiles.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-xl font-bold text-white">No profiles left.</h3>
            <p className="text-zinc-500 mt-2">Check back later for new people.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            {profiles.map((p, index) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 100, filter: "blur(40px) brightness(2)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px) brightness(1)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden aspect-[4/5] flex flex-col group"
              >
                {/* Background Image */}
                <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedProfileForBrief(p)}>
                  {p.photos && p.photos.length > 0 ? (
                    <img src={p.photos[0]} alt={p.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800" />
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
                  <p className="text-zinc-300 font-medium mb-3 text-lg drop-shadow-md">{p.branch} • Year {p.year}</p>
                  
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
                  
                  <div className="pointer-events-auto relative h-16 w-full">
                    <AnimatePresence>
                      {breakingIceId === p.id ? (
                        <div className="absolute inset-0 pointer-events-none" />
                      ) : (
                        <motion.button 
                          key="btn"
                          exit={{ opacity: 0, scale: 1.1 }}
                          onClick={(e) => handleBreakIceClick(e, p)} 
                          className="absolute inset-0 w-full bg-white/10 hover:bg-white/20 bg-zinc-800 border border-white/30 text-white rounded-2xl py-4 font-bold text-lg transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                          Break the Ice 🧊
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      
      {/* Global Shatter Animation Overlay (Optimized for Mobile) */}
      <AnimatePresence>
        {shatterPos && (
          <div className="fixed inset-0 pointer-events-none z-[200]">
            {/* The Main Flash */}
            <motion.div
              initial={{ x: shatterPos.x, y: shatterPos.y, width: shatterPos.width, height: 60, opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bg-white rounded-2xl"
            />
            
            {/* Ice Particles */}
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const distance = 150 + Math.random() * 100;
              const destX = shatterPos.x + shatterPos.width / 2 + Math.cos(angle) * distance;
              const destY = shatterPos.y + 30 + Math.sin(angle) * distance;
              
              return (
                <motion.div 
                  key={i}
                  initial={{ 
                    x: shatterPos.x + shatterPos.width / 2, 
                    y: shatterPos.y + 30, 
                    scale: 0.5 + Math.random(),
                    rotate: 0, 
                    opacity: 1 
                  }}
                  animate={{ 
                    x: destX, 
                    y: destY, 
                    rotate: Math.random() * 360, 
                    opacity: 0,
                    scale: 0 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute w-6 h-6 bg-blue-100 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  style={{ willChange: 'transform, opacity' }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
      </main>

    </div>
  );
}
