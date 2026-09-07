"use client";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-950">
      {/* Dark background base with a subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated glowing orbs - very large and blurry for a fluid effect */}
      <motion.div
        animate={{
          x: [0, 150, 0, -150, 0],
          y: [0, 100, 200, 100, 0],
          scale: [1, 1.3, 1, 0.7, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/30 rounded-full blur-[120px]"
      />
      
      <motion.div
        animate={{
          x: [0, -150, 0, 150, 0],
          y: [0, -100, -200, -100, 0],
          scale: [1, 0.7, 1, 1.3, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/30 rounded-full blur-[120px]"
      />

      <motion.div
        animate={{
          x: [-50, 100, -50],
          y: [100, -100, 100],
          scale: [0.8, 1.5, 0.8],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-indigo-500/20 rounded-full blur-[100px]"
      />

      <motion.div
        animate={{
          x: [100, -100, 100],
          y: [-50, 50, -50],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute top-[50%] right-[30%] w-[35vw] h-[35vw] bg-rose-500/10 rounded-full blur-[100px]"
      />
    </div>
  );
}
