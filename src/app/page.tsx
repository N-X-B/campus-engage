"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// 1. Cyber Scramble Text Component
const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text.split('').map(() => ''));
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return letters[Math.floor(Math.random() * letters.length)];
        })
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="whitespace-nowrap">{displayText.join("")}</span>;
};

// 2. Magnetic Button Component
const MagneticButton = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative z-10 inline-block"
    >
      {children}
    </motion.div>
  );
};

// 3. 3D Hover Tilt Card Component
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative perspective-1000 ${className}`}
    >
      <motion.div 
        className="absolute inset-0 z-50 pointer-events-none rounded-[2rem]"
        style={{
          background: useTransform(
            () => `radial-gradient(circle at ${ (x.get() + 0.5) * 100 }% ${ (y.get() + 0.5) * 100 }%, rgba(255,255,255,0.08) 0%, transparent 60%)`
          )
        }}
      />
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const letterStretch = useTransform(scrollYProgress, [0, 0.5], ["0em", "0.3em"]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  
  

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-white/20 cursor-none">
      
      {/* Ghost Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 bg-white/10 mix-blend-difference pointer-events-none z-[9999] hidden md:block"
        style={{ x: cursorX, y: cursorY }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-white hover:scale-105 transition-transform">
          CampusEngage.
        </Link>
        <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-white hover:text-zinc-400 transition cursor-none">
          Sign In
        </Link>
      </nav>

      {/* Futuristic Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
             style={{
               backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
               WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
             }} 
        />

        {/* Dynamic Mesh / Aurora Background */}
        <div className="absolute inset-0 z-[-10] overflow-hidden pointer-events-none opacity-40">
           <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.15)_0%,_transparent_60%)]" />
           <motion.div animate={{ rotate: -360, scale: [1, 1.5, 1], x: [0, 100, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,_rgba(5,150,105,0.1)_0%,_transparent_60%)]" />
           <motion.div animate={{ y: [0, -100, 0], x: [0, -50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(225,29,72,0.1)_0%,_transparent_60%)]" />
        </div>
        
        <motion.div style={{ y: yBg, opacity: opacityText }} className="text-center w-full max-w-7xl mt-20 z-10 relative">
          
          {/* Cyber Scramble + Kinetic Stretch */}
          <motion.h1 
            style={{ letterSpacing: letterStretch }}
            className="text-[1.7rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-widest sm:tracking-[0.2em] mb-8 flex justify-center flex-wrap sm:flex-nowrap w-full"
          >
            <ScrambleText text="MEET YOUR CAMPUS." />
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-2xl text-zinc-300 font-medium max-w-2xl mx-auto mb-12 drop-shadow-xl"
            initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            The algorithm that matches you on vibes, not just zip codes. Connect with students who actually share your energy.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.5, type: "spring", bounce: 0.5 }}
            className="flex justify-center"
          >
            <MagneticButton>
              <Link href="/register" className="inline-block relative group cursor-none">
                 <div className="absolute -inset-2 bg-white opacity-10 blur-xl group-hover:opacity-30 transition duration-500 rounded-full"></div>
                 <div className="relative bg-white text-black px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 group-hover:scale-105 border border-white/50 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                   Join the Network
                 </div>
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <div className="w-6 h-12 border border-zinc-700 rounded-full flex justify-center p-1.5 backdrop-blur-sm">
            <motion.div 
               animate={{ y: [0, 15, 0], opacity: [1, 0, 1] }} 
               transition={{ repeat: Infinity, duration: 1.5 }}
               className="w-1.5 h-1.5 bg-zinc-400 rounded-full" 
            />
          </div>
        </motion.div>
      </section>

      {/* Feature 1: The Feed */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -100, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">Stop Swiping.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-700">Start scrolling.</span></h2>
            <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
              We scrapped the boring swiping mechanics. Experience a premium, immersive vertical feed that feels more like a modern social network than a corporate directory.
            </p>
          </motion.div>

          <motion.div 
            className="relative h-[600px] w-full max-w-sm mx-auto perspective-1000"
            initial={{ opacity: 0, y: 150, rotateY: 30, rotateZ: -10, filter: "blur(30px) brightness(1.5)" }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0, rotateZ: 0, filter: "blur(0px) brightness(1)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
          >
            <div className="absolute inset-0 bg-zinc-900 rounded-[3rem] p-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 relative z-10">
              <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative border border-white/5">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="App Mockup" className="object-cover w-full h-full opacity-60 grayscale transition-transform duration-1000 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-10 left-6 right-6">
                  <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Emma, 1st Year</h3>
                  <div className="w-full h-14 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white font-bold border border-white/10 shadow-xl overflow-hidden relative group cursor-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    Break the Ice 🧊
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="absolute -right-8 top-20 bg-black/80 backdrop-blur-md text-white font-bold px-5 py-3 rounded-full shadow-2xl border border-white/10 z-20"
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              🔥 92% Match
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature 2: Bento Box Algorithm with 3D Tilt */}
      <section className="py-32 px-4 bg-zinc-950 border-y border-zinc-900/50 relative overflow-hidden">
        
        <motion.div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] border border-white/5 rounded-full border-dashed opacity-50 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-[800px] h-[800px] border-2 border-white/5 rounded-full border-dotted opacity-30 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">The Mathematics of Vibes.</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Our matchmaking engine calculates compatibility using semantic embeddings and campus-specific parameters.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="md:col-span-2">
              <div className="w-full h-full bg-black/50 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 flex flex-col justify-between hover:border-white/30 transition-colors shadow-2xl overflow-hidden relative">
                <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
                  <h3 className="text-3xl font-bold text-white mb-3">Semantic Hot Takes</h3>
                  <p className="text-zinc-400 text-lg">We analyze your campus hot takes using vector embeddings to find students with the exact same sense of humor.</p>
                </div>
                <div className="mt-12 p-6 bg-zinc-950/80 rounded-2xl border border-white/10 relative z-10 shadow-inner" style={{ transform: "translateZ(20px)" }}>
                  <p className="text-zinc-500 font-mono text-sm tracking-tighter overflow-hidden">
                    <ScrambleText text="similarity_score = dot_product(v1, v2) > 0.85" />
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="w-full h-full bg-black/50 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 flex flex-col justify-between hover:border-white/30 transition-colors shadow-2xl overflow-hidden relative group">
                <div style={{ transform: "translateZ(40px)" }}>
                  <h3 className="text-3xl font-bold text-white mb-3 relative z-10">Study Energy</h3>
                  <p className="text-zinc-400 relative z-10 text-lg">Match with library rats or coffee shop regulars.</p>
                </div>
                <motion.div style={{ transform: "translateZ(60px)" }} className="mt-8 text-7xl opacity-40 grayscale absolute -bottom-6 -right-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>🎧</motion.div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Feature 3: How it Works */}
      <section className="py-40 px-4 relative overflow-hidden bg-black">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] border border-white/[0.03] rounded-full pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        >
           <div className="absolute top-0 left-1/2 w-6 h-6 bg-white/20 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.8)] backdrop-blur-md" />
           <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white/10 rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-32"
            initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-6xl font-bold tracking-tighter mb-6">System Architecture.</h2>
            <p className="text-2xl text-zinc-500">Three simple steps to build your network on campus.</p>
          </motion.div>

          <div className="space-y-32">
            <motion.div 
              className="flex flex-col md:flex-row items-center gap-12 group"
              initial={{ opacity: 0, x: -100, filter: "blur(20px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-black w-40 flex-shrink-0 leading-none group-hover:from-zinc-600 transition-all duration-700">01</div>
              <div>
                <h3 className="text-4xl font-bold mb-4 tracking-tight">Onboard in 60s</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">Fill out the quick, 4-step Vibe Check wizard. We ask you rapid-fire questions about your campus habits—like whether you write essays a week early or 12 hours before the deadline.</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col md:flex-row items-center gap-12 group"
              initial={{ opacity: 0, x: 100, filter: "blur(20px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-black w-40 flex-shrink-0 md:order-last text-right leading-none group-hover:from-zinc-600 transition-all duration-700">02</div>
              <div className="md:text-right">
                <h3 className="text-4xl font-bold mb-4 tracking-tight">Algorithmic Pairing</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">Our system computes a precise Matchability Factor™ out of 100% by comparing your answers to everyone else in your university. The highest matches are instantly pushed to the top of your feed.</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col md:flex-row items-center gap-12 group"
              initial={{ opacity: 0, x: -100, filter: "blur(20px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-black w-40 flex-shrink-0 leading-none group-hover:from-zinc-600 transition-all duration-700">03</div>
              <div>
                <h3 className="text-4xl font-bold mb-4 tracking-tight">Break the Ice</h3>
                <p className="text-zinc-400 text-xl leading-relaxed">Click on a profile to view their brief. If the vibe is right, tap the Icebreaker button. We'll automatically generate a highly contextual conversation starter and drop you directly into a private chat.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-48 px-4 text-center relative overflow-hidden bg-black border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">READY?</h2>
          
          <MagneticButton>
            <Link href="/register" className="inline-block relative group cursor-none">
               <div className="absolute -inset-2 bg-white opacity-10 blur-2xl group-hover:opacity-40 transition duration-700 rounded-full"></div>
               <div className="relative bg-white text-black px-14 py-7 rounded-full font-bold text-2xl transition-all duration-500 group-hover:scale-110 shadow-[0_0_50px_rgba(255,255,255,0.15)]">
                 Initialize Profile
               </div>
            </Link>
          </MagneticButton>
        </motion.div>
      </section>
      

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6 bg-black text-sm relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-xs">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-zinc-500 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-zinc-500 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-zinc-500 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-zinc-500 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-xs">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/safety" className="text-zinc-500 hover:text-white transition-colors">Safety Tips</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase mb-6 text-xs">Social</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors cursor-none">Instagram</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors cursor-none">TikTok</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors cursor-none">Twitter</a></li>
            </ul>
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tighter text-white mb-4">
              CampusEngage.
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              The mathematics of vibes.<br />
              Built for students, by students.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs font-mono">
          <p>© {new Date().getFullYear()} CampusEngage Inc.</p>
          <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> All systems operational.</p>
        </div>
      </footer>
    </div>
  );
}
