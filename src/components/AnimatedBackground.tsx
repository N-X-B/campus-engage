"use client";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
      {/* Light background base with a stronger grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated glowing orbs - HIGHLY VISIBLE */}
      <motion.div
        animate={{
          x: [0, 200, 0, -200, 0],
          y: [0, 150, 300, 150, 0],
          scale: [1, 1.4, 1, 0.8, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[0%] left-[0%] w-[40vw] h-[40vw] bg-pink-400/60 rounded-full blur-[60px]"
      />
      
      <motion.div
        animate={{
          x: [0, -200, 0, 200, 0],
          y: [0, -150, -300, -150, 0],
          scale: [1, 0.8, 1, 1.4, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[0%] right-[0%] w-[50vw] h-[50vw] bg-violet-400/60 rounded-full blur-[70px]"
      />

      <motion.div
        animate={{
          x: [-100, 150, -100],
          y: [150, -150, 150],
          scale: [0.8, 1.3, 0.8],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] left-[40%] w-[35vw] h-[35vw] bg-fuchsia-400/50 rounded-full blur-[60px]"
      />

      <motion.div
        animate={{
          x: [150, -150, 150],
          y: [-100, 100, -100],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-sky-400/50 rounded-full blur-[50px]"
      />
    </div>
  );
}
