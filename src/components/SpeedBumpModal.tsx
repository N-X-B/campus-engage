"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: string;
  name: string;
  photos: string[];
}

interface SpeedBumpModalProps {
  isOpen: boolean;
  onComplete: () => void;
  profileA: Profile;
  profileB: Profile;
  prompt: string;
}

export default function SpeedBumpModal({ isOpen, onComplete, profileA, profileB, prompt }: SpeedBumpModalProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(10);
      setSelected(null);
      setShowReward(false);
      return;
    }

    if (timeLeft > 0 && !selected) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selected) {
      // Auto close or fail if time runs out? For now just close without reward.
      onComplete();
    }
  }, [isOpen, timeLeft, selected, onComplete]);

  const handleVote = (choice: 'A' | 'B') => {
    if (selected) return;
    setSelected(choice);
    
    // Add token
    const currentTokens = parseInt(localStorage.getItem('revealTokens') || '0', 10);
    localStorage.setItem('revealTokens', (currentTokens + 1).toString());
    localStorage.setItem('lastTokenEarned', Date.now().toString());
    
    // Dispatch event so other tabs/components can update
    window.dispatchEvent(new Event('tokensUpdated'));

    setTimeout(() => {
      setShowReward(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {showReward ? (
            <motion.div 
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -20, 0] }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              <div className="text-[6rem] mb-4">🪙</div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 mb-2">
                +1 REVEAL TOKEN
              </h2>
              <p className="text-zinc-400 font-bold uppercase tracking-widest">Go check your crushes!</p>
            </motion.div>
          ) : (
            <motion.div 
              className="w-full max-w-4xl"
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded-full mb-8 overflow-hidden relative shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 10) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>

              <div className="text-center mb-8 text-white">
                <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-full text-xs font-black uppercase tracking-widest mb-4 animate-pulse">
                  Vibe Check
                </span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter drop-shadow-2xl">{prompt}</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-6 relative">
                {/* VS Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black border border-white/20 rounded-full flex items-center justify-center z-10 font-black italic text-xl shadow-2xl backdrop-blur-md">
                  VS
                </div>

                {/* Profile A */}
                <motion.div 
                  className={`flex-1 relative rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${selected === 'A' ? 'border-white scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)]' : selected === 'B' ? 'border-transparent opacity-30 scale-95' : 'border-white/10 hover:border-white/40 hover:scale-[1.02]'}`}
                  onClick={() => handleVote('A')}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="aspect-[4/5] relative">
                    <img src={profileA.photos[0] || 'https://via.placeholder.com/400x500'} alt={profileA.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white z-10">
                      <h3 className="text-3xl font-black">{profileA.name}</h3>
                    </div>
                  </div>
                </motion.div>

                {/* Profile B */}
                <motion.div 
                  className={`flex-1 relative rounded-[2rem] overflow-hidden cursor-pointer border-2 transition-all duration-300 group ${selected === 'B' ? 'border-white scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)]' : selected === 'A' ? 'border-transparent opacity-30 scale-95' : 'border-white/10 hover:border-white/40 hover:scale-[1.02]'}`}
                  onClick={() => handleVote('B')}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="aspect-[4/5] relative">
                    <img src={profileB.photos[0] || 'https://via.placeholder.com/400x500'} alt={profileB.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white z-10">
                      <h3 className="text-3xl font-black">{profileB.name}</h3>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
