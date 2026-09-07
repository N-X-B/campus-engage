"use client";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none bg-slate-950">
      {/* Dark background base */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated glowing orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-purple-500/20 rounded-full blur-[100px]"
      />
      
      <motion.div
        animate={{
          x: [0, -100, 0, 100, 0],
          y: [0, -50, -100, -50, 0],
          scale: [1, 0.8, 1, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] bg-blue-500/20 rounded-full blur-[100px]"
      />

      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 100, -100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-indigo-500/20 rounded-full blur-[100px]"
      />
    </div>
  );
}
