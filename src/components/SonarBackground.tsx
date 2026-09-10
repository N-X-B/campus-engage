"use client";

import { motion } from "framer-motion";

export function SonarBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            style={{ willChange: "transform, opacity" }}
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
              delay: i * 2,
            }}
          />
        ))}
      </div>
      
      {/* Optional faint ambient glow in the center to anchor it */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)' }} />
    </div>
  );
}
