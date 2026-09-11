"use client";

import React, { useState, useEffect } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export function ScrambleText({ text, duration = 1500 }: { text: string, duration?: number }) {
  const [displayText, setDisplayText] = useState(text.replace(/[a-zA-Z]/g, 'x'));
  
  useEffect(() => {
    let frame = 0;
    const length = text.length;
    const interval = 30; // ms per frame
    const totalFrames = duration / interval;
    
    const tick = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      let scrambled = '';
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
          continue;
        }
        
        // Reveal characters proportionally as progress advances
        const charProgress = i / length;
        if (progress > charProgress) {
          scrambled += text[i];
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      
      setDisplayText(scrambled);
      
      if (frame >= totalFrames) {
        clearInterval(tick);
        setDisplayText(text); // ensure perfect match at end
      }
    }, interval);
    
    return () => clearInterval(tick);
  }, [text, duration]);
  
  return <span>{displayText}</span>;
}
