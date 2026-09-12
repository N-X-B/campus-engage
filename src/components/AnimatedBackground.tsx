"use client";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
      {/* Dark background base with subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* 
        OPTIMIZATION: Replaced heavy GPU filter: blur() and mix-blend-mode 
        with native CSS radial gradients. These run at 60fps on mobile.
      */}
      <motion.div
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.1, 1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.2) 0%, rgba(8,145,178,0) 70%)' }}
      />
      
      <motion.div
        animate={{
          x: [0, -75, 0, 75, 0],
          y: [0, -50, -100, -50, 0],
          scale: [1, 0.9, 1, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(192,38,211,0.2) 0%, rgba(192,38,211,0) 70%)' }}
      />

      <motion.div
        animate={{
          x: [-50, 75, -50],
          y: [75, -75, 75],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-[30%] left-[30%] w-[45vw] h-[45vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0) 70%)' }}
      />

      <motion.div
        animate={{
          x: [75, -75, 75],
          y: [-50, 50, -50],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0) 70%)' }}
      />
    </div>
  );
}
