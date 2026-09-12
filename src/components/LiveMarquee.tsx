"use client";
import React from 'react';
import { motion } from 'framer-motion';

const GOSSIP_MESSAGES = [
  "🔥 14 people from CS are swiping right now",
  "👀 Someone in the Library just dropped a Confession",
  "📈 A Freshman just hit 80 Aura",
  "💬 6 Icebreakers were sent in the last hour",
  "✨ Someone just got voted 'Best Smile'",
  "🚨 A new Spotted confession is going viral",
  "⚡️ High activity detected in the Business Block"
];

export function LiveMarquee() {
  return (
    <div className="w-full bg-rose-500/10 border-b border-rose-500/20 overflow-hidden py-1.5 relative z-50">
      <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 20, repeat: Infinity }}
      >
        <div className="flex gap-8 px-4 items-center">
          {GOSSIP_MESSAGES.map((msg, i) => (
            <span key={`a-${i}`} className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {msg}
            </span>
          ))}
          {GOSSIP_MESSAGES.map((msg, i) => (
            <span key={`b-${i}`} className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {msg}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
