"use client";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
      {/* Dark background base with subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Animated glowing neon fluids */}
      <motion.div
        animate={{
          x: [0, 100, 0, -100, 0],
          y: [0, 100, 200, 100, 0],
          scale: [1, 1.2, 1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-600/50 mix-blend-screen rounded-full blur-[100px]"
      />
      
      <motion.div
        animate={{
          x: [0, -150, 0, 150, 0],
          y: [0, -100, -200, -100, 0],
          scale: [1, 0.9, 1, 1.3, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-600/50 mix-blend-screen rounded-full blur-[120px]"
      />

      <motion.div
        animate={{
          x: [-100, 150, -100],
          y: [150, -150, 150],
          scale: [0.8, 1.3, 0.8],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[30%] w-[45vw] h-[45vw] bg-violet-600/50 mix-blend-screen rounded-full blur-[100px]"
      />

      <motion.div
        animate={{
          x: [150, -150, 150],
          y: [-100, 100, -100],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] bg-emerald-500/30 mix-blend-screen rounded-full blur-[100px]"
      />
      
      {/* Glassmorphism overlay to smooth the fluid effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[50px]" />
    </div>
  );
}
