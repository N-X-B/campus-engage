"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { ScrambleText } from '@/components/ScrambleText';
import { useAuth } from '@/lib/AuthContext';
import { haptic } from '@/lib/haptics';

import { TokenBadge } from '@/components/TokenBadge';

// Simulated Spotted Data
const INITIAL_SPOTTED = [
  {
    id: '1',
    message: "Saw a guy in a green vintage hoodie at Starbucks studying discrete math. You have great vibes.",
    authorMajor: "Computer Science",
    authorYear: "Year 2",
    timestamp: Date.now() - 3600000,
    unlockedMajor: false,
    unlockedYear: false,
  },
  {
    id: '2',
    message: "To the girl with the red tote bag in the library on the 3rd floor... I didn't want to interrupt your focus but wow.",
    authorMajor: "Architecture",
    authorYear: "Year 3",
    timestamp: Date.now() - 7200000,
    unlockedMajor: false,
    unlockedYear: false,
  },
  {
    id: '3',
    message: "Whoever was playing the guitar outside the dorms at midnight, thank you. Main character energy.",
    authorMajor: "Business",
    authorYear: "Year 1",
    timestamp: Date.now() - 86400000,
    unlockedMajor: false,
    unlockedYear: false,
  }
];

export default function SpottedPage() {
  const { user } = useAuth();
  const [tokens, setTokens] = useState(0);
  const [posts, setPosts] = useState(INITIAL_SPOTTED);

  useEffect(() => {
    setTokens(parseInt(localStorage.getItem('revealTokens') || '0', 10));
    const handleTokenUpdate = () => setTokens(parseInt(localStorage.getItem('revealTokens') || '0', 10));
    window.addEventListener('tokensUpdated', handleTokenUpdate);
    return () => window.removeEventListener('tokensUpdated', handleTokenUpdate);
  }, []);

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

    // Update post state
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        if (type === 'major') return { ...p, unlockedMajor: true };
        if (type === 'year') return { ...p, unlockedYear: true };
      }
      return p;
    }));
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
          <div className="flex flex-col items-end gap-2">
            <TokenBadge tokens={tokens} />
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post, idx) => (
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
                <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span>🕵️</span> Author Clues
                </div>
                
                {/* Major Reveal */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm font-mono">Major:</span>
                    {post.unlockedMajor ? (
                      <span className="text-rose-400 font-bold text-sm"><ScrambleText text={post.authorMajor} duration={1000} /></span>
                    ) : (
                      <span className="text-zinc-600 font-mono text-sm blur-[2px] select-none">xxxxxxxxxxxx</span>
                    )}
                  </div>
                  {!post.unlockedMajor && (
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
                    {post.unlockedYear ? (
                      <span className="text-rose-400 font-bold text-sm"><ScrambleText text={post.authorYear} duration={1000} /></span>
                    ) : (
                      <span className="text-zinc-600 font-mono text-sm blur-[2px] select-none">xxxxxx</span>
                    )}
                  </div>
                  {!post.unlockedYear && (
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
          ))}
        </div>
      </main>
    </div>
  );
}
