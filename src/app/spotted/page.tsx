"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { ScrambleText } from '@/components/ScrambleText';
import { useAuth } from '@/lib/AuthContext';
import { haptic } from '@/lib/haptics';
import { collection, addDoc, onSnapshot, query, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toxicWords } from "@/lib/toxicWords";
import { TokenBadge } from '@/components/TokenBadge';

export default function SpottedPage() {
  const { user } = useAuth();
  const [tokens, setTokens] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  // Modal State
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local unlocks state (so we don't save every tiny unlock to a global DB for MVP, just local)
  const [localUnlocks, setLocalUnlocks] = useState<Record<string, { major?: boolean, year?: boolean }>>({});

  useEffect(() => {
    setTokens(parseInt(localStorage.getItem('revealTokens') || '0', 10));
    const handleTokenUpdate = () => setTokens(parseInt(localStorage.getItem('revealTokens') || '0', 10));
    window.addEventListener('tokensUpdated', handleTokenUpdate);
    
    // Load local unlocks
    const saved = localStorage.getItem('spottedUnlocks');
    if (saved) setLocalUnlocks(JSON.parse(saved));

    return () => window.removeEventListener('tokensUpdated', handleTokenUpdate);
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Get user data to attach to their posts
    getDoc(doc(db, 'users', user.uid)).then(d => {
      if (d.exists()) setUserData(d.data());
    });

    // Listen for live confessions
    const q = query(collection(db, 'spotted_confessions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      snapshot.forEach(docSnap => {
        fetched.push({ id: docSnap.id, ...docSnap.data() });
      });
      setPosts(fetched);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUnlock = (postId: string, type: 'major' | 'year', cost: number) => {
    if (tokens < cost) {
      alert(`You need ${cost} Reveal Tokens to unlock this! Go to the Feed to earn more.`);
      return;
    }
    
    // Deduct tokens
    const newTokens = tokens - cost;
    localStorage.setItem('revealTokens', newTokens.toString());
    window.dispatchEvent(new Event('tokensUpdated'));
    haptic.success();

    // Save unlock
    const updatedUnlocks = { ...localUnlocks };
    if (!updatedUnlocks[postId]) updatedUnlocks[postId] = {};
    if (type === 'major') updatedUnlocks[postId].major = true;
    if (type === 'year') updatedUnlocks[postId].year = true;
    
    setLocalUnlocks(updatedUnlocks);
    localStorage.setItem('spottedUnlocks', JSON.stringify(updatedUnlocks));
  };

  const handleBreakIce = (postId: string) => {
    if (tokens < 30) {
       alert("You need 30 Reveal Tokens to Break the Ice with an anonymous poster!");
       return;
    }
    // Deduct tokens
    const newTokens = tokens - 30;
    localStorage.setItem('revealTokens', newTokens.toString());
    window.dispatchEvent(new Event('tokensUpdated'));
    haptic.success();
    alert("Icebreaker request sent! (In a full backend, this would open a new anonymous chat).");
  };

  const handleSubmitConfession = async () => {
    if (tokens < 20) {
      alert("You need 20 Reveal Tokens to post a confession!");
      return;
    }
    if (composeText.trim().length < 10) {
      alert("Confession must be at least 10 characters long.");
      return;
    }

    
    // Basic local filter
    const lower = composeText.toLowerCase();
    
    // We check if the text contains any of the exact substrings. 
    // For a confession app, blocking substrings like "mc" might flag "hamburger mc", 
    // so we pad with spaces for short acronyms, but for safety we'll use regex word boundaries.
    
    const containsToxic = toxicWords.some(w => {
      // For short acronyms like 'bc' or 'mc', ensure they are standalone words
      if (w.length <= 3) {
        const regex = new RegExp(`\\b${w}\\b`, 'i');
        return regex.test(lower);
      }
      return lower.includes(w);
    });

    if (containsToxic) {
      alert("🚨 Blocked: Your confession contains inappropriate or toxic language. Keep it positive or dramatic, not harmful.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'spotted_confessions'), {
        message: composeText.trim(),
        authorId: user?.uid || 'anonymous',
        authorMajor: userData?.branch || 'Unknown',
        authorYear: userData?.year || 'Unknown',
        timestamp: Date.now(),
      });

      // Deduct Tokens
      const newTokens = tokens - 20;
      localStorage.setItem('revealTokens', newTokens.toString());
      window.dispatchEvent(new Event('tokensUpdated'));
      
      haptic.success();
      setComposeText("");
      setShowComposeModal(false);
    } catch (e) {
      console.error(e);
      alert("Failed to post confession.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative z-10 pb-20 md:pb-0 font-sans selection:bg-rose-500/30 bg-black">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2 font-mono uppercase">Spotted</h1>
            <p className="text-rose-500 font-medium font-mono text-xs uppercase tracking-widest">Anonymous Campus Confessions</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <TokenBadge tokens={tokens} />
            <button 
              onClick={() => setShowComposeModal(true)}
              className="bg-white text-black font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full hover:scale-105 transition-transform"
            >
              Drop a Confession
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.length === 0 && (
             <div className="text-center py-20">
                <span className="text-6xl mb-4 block opacity-50">👀</span>
                <h3 className="text-white font-bold text-lg">No confessions yet.</h3>
                <p className="text-zinc-500 mt-2 text-sm">Be the first to drop 20 tokens and spill a secret.</p>
             </div>
          )}

          {posts.map((post, idx) => {
            const unlocked = localUnlocks[post.id] || {};
            
            return (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[50px] pointer-events-none" />
                
                <div className="mb-4">
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Campus
                  </span>
                </div>
                
                <p className="text-white text-lg font-medium leading-relaxed mb-6">
                  "{post.message}"
                </p>

                <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2"><span>🕵️</span> Author Clues</span>
                    <button 
                       onClick={() => handleBreakIce(post.id)}
                       className="bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                    >
                       🧊 Break Ice <span className="opacity-75">(30 🪙)</span>
                    </button>
                  </div>
                  
                  {/* Major Reveal */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-sm font-mono">Major:</span>
                      {unlocked.major ? (
                        <span className="text-rose-400 font-bold text-sm"><ScrambleText text={post.authorMajor} duration={1000} /></span>
                      ) : (
                        <span className="text-zinc-600 font-mono text-sm blur-[2px] select-none">xxxxxxxxxxxx</span>
                      )}
                    </div>
                    {!unlocked.major && (
                      <button 
                        onClick={() => handleUnlock(post.id, 'major', 2)}
                        className="text-[10px] bg-zinc-800 hover:bg-rose-500 hover:text-white transition-colors border border-zinc-700 hover:border-rose-500 px-3 py-1.5 rounded-full font-bold tracking-widest uppercase flex items-center gap-1"
                      >
                        Unlock <span className="opacity-75">(2 🪙)</span>
                      </button>
                    )}
                  </div>

                  {/* Year Reveal */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-sm font-mono">Year:</span>
                      {unlocked.year ? (
                        <span className="text-rose-400 font-bold text-sm"><ScrambleText text={post.authorYear} duration={1000} /></span>
                      ) : (
                        <span className="text-zinc-600 font-mono text-sm blur-[2px] select-none">xxxxxx</span>
                      )}
                    </div>
                    {!unlocked.year && (
                      <button 
                        onClick={() => handleUnlock(post.id, 'year', 4)}
                        className="text-[10px] bg-zinc-800 hover:bg-rose-500 hover:text-white transition-colors border border-zinc-700 hover:border-rose-500 px-3 py-1.5 rounded-full font-bold tracking-widest uppercase flex items-center gap-1"
                      >
                        Unlock <span className="opacity-75">(4 🪙)</span>
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Compose Modal */}
      <AnimatePresence>
        {showComposeModal && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
             <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
             >
                <div className="absolute top-0 right-0 p-4">
                  <button onClick={() => setShowComposeModal(false)} className="text-zinc-500 hover:text-white">✕</button>
                </div>
                
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Drop a Confession</h2>
                <p className="text-zinc-400 text-sm mb-6">Spill your secret to the entire campus instantly. No review, just raw gossip.</p>
                
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3 mb-6">
                   <span className="text-2xl">🪙</span>
                   This action costs exactly 20 Reveal Tokens.
                </div>

                <textarea
                   value={composeText}
                   onChange={e => setComposeText(e.target.value)}
                   placeholder="To the girl in the library with the red tote bag..."
                   className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white resize-none h-32 focus:outline-none focus:border-rose-500 transition-colors mb-6"
                />
                
                <button 
                   onClick={handleSubmitConfession}
                   disabled={isSubmitting || tokens < 20}
                   className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-sm"
                >
                   {isSubmitting ? "Posting..." : "Post Instantly (20 🪙)"}
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
