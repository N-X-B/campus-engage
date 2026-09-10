"use client";

import { motion } from "framer-motion";

export function SonarBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-[2px] border-indigo-500/40 bg-indigo-500/10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 3], 
              opacity: [0, 0.6, 0] 
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2, // stagger the ripples
            }}
          />
        ))}
      </div>
      
      {/* Optional faint ambient glow in the center to anchor it */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />
    </div>
  );
}
