"use client";

import React, { useState, useEffect } from 'react';

export function TokenBadge({ tokens }: { tokens: number }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    // Simulate token decay logic (e.g. 4 hours from last earn)
    const updateDecay = () => {
      const lastEarned = localStorage.getItem('lastTokenEarned');
      if (!lastEarned) {
        setTimeLeft('');
        return;
      }
      
      const earnTime = parseInt(lastEarned, 10);
      const DECAY_TIME = 4 * 60 * 60 * 1000; // 4 hours
      const now = Date.now();
      const diff = (earnTime + DECAY_TIME) - now;
      
      if (diff <= 0) {
        // Burn tokens
        localStorage.setItem('revealTokens', '0');
        localStorage.removeItem('lastTokenEarned');
        window.dispatchEvent(new Event('tokensUpdated'));
        setTimeLeft('Burned');
      } else {
        // Format mm:ss or hh:mm
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${mins}m`);
      }
    };
    
    updateDecay();
    const interval = setInterval(updateDecay, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [tokens]);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.2)]">
        <span className="text-amber-500 font-black text-sm">{tokens}</span>
        <span className="text-lg leading-none">🪙</span>
      </div>
      {tokens > 0 && timeLeft && timeLeft !== 'Burned' && (
        <div className="text-[9px] text-rose-500 font-bold tracking-widest uppercase animate-pulse">
          Burns in: {timeLeft}
        </div>
      )}
    </div>
  );
}
