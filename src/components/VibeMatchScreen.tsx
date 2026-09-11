"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VibeMatchScreenProps {
  isOpen: boolean;
  onClose: () => void;
  matchedName: string;
  matchedPhoto: string;
}

export default function VibeMatchScreen({ isOpen, onClose, matchedName, matchedPhoto }: VibeMatchScreenProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 300);
      
      // Auto close after some time or let user click
      const timer = setTimeout(() => {
        onClose();
        setShowContent(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          onClick={() => {
            onClose();
            setShowContent(false);
          }}
        >
          {/* Intense animated background */}
          <motion.div 
            className="absolute inset-0 bg-[conic-gradient(from_0deg,var(--tw-gradient-stops))] from-rose-500 via-indigo-500 to-rose-500 opacity-30"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          
          {showContent && (
            <div className="relative z-10 flex flex-col items-center justify-center p-4">
              <motion.h2 
                className="text-6xl md:text-8xl lg:text-[10rem] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 drop-shadow-[0_0_50px_rgba(255,255,255,0.5)] leading-none text-center mb-12"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
              >
                VIBE<br/>MATCH
              </motion.h2>

              <motion.div 
                className="relative"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.2 }}
              >
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full p-2 bg-gradient-to-tr from-rose-500 to-indigo-500 animate-pulse shadow-[0_0_100px_rgba(244,63,94,0.6)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 border-4 border-black">
                    <img src={matchedPhoto || 'https://via.placeholder.com/400'} alt={matchedName} className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <motion.div 
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full font-black tracking-widest uppercase text-sm md:text-base whitespace-nowrap shadow-2xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {matchedName}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
