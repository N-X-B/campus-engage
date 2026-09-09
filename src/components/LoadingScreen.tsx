"use client";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        <div className="text-3xl md:text-4xl font-black tracking-tighter text-white flex items-center mb-6">
          CampusEngage
          <motion.span 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="text-indigo-500"
          >.</motion.span>
        </div>
        
        {/* Minimal loading bar */}
        <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
           <motion.div 
             className="absolute top-0 bottom-0 left-0 w-1/3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
             animate={{ x: ["-100%", "300%"] }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
           />
        </div>
      </motion.div>
    </div>
  );
}
