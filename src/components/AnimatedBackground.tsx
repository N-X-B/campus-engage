"use client";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50">
      {/* Light background base with a subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated glowing orbs - very bright and visible for light mode */}
      <motion.div
        animate={{
          x: [0, 150, 0, -150, 0],
          y: [0, 100, 200, 100, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-300/40 rounded-full blur-[100px]"
      />
      
      <motion.div
        animate={{
          x: [0, -150, 0, 150, 0],
          y: [0, -100, -200, -100, 0],
          scale: [1, 0.8, 1, 1.2, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-violet-300/40 rounded-full blur-[100px]"
      />

      <motion.div
        animate={{
          x: [-50, 100, -50],
          y: [100, -100, 100],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-fuchsia-300/30 rounded-full blur-[90px]"
      />

      <motion.div
        animate={{
          x: [100, -100, 100],
          y: [-50, 50, -50],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute top-[50%] right-[30%] w-[35vw] h-[35vw] bg-sky-300/30 rounded-full blur-[90px]"
      />
    </div>
  );
}
