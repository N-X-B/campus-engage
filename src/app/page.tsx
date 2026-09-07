"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-white">
          CampusEngage.
        </Link>
        <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-white hover:text-slate-300 transition">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mt-20"
        >
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            MEET<br/>YOUR<br/>CAMPUS.
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            The algorithm that matches you on vibes, not just zip codes. Connect with students who actually share your energy.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Link href="/register" className="inline-block bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Join the Network
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Feature 1: The Feed */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Stop<br/>Swiping.<br/><span className="text-indigo-400">Start scrolling.</span></h2>
            <p className="text-xl text-slate-400 mb-8">
              We scrapped the boring swiping mechanics. Experience a premium, immersive vertical feed that feels more like a modern social network than a corporate directory.
            </p>
          </motion.div>

          {/* Floating UI Mockup */}
          <motion.div 
            className="relative h-[600px] w-full max-w-sm mx-auto"
            initial={{ opacity: 0, y: 100, rotate: -5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          >
            <div className="absolute inset-0 bg-slate-800 rounded-[3rem] p-2 shadow-2xl border border-slate-700">
              <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="App Mockup" className="object-cover w-full h-full opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-10 left-6 right-6">
                  <h3 className="text-3xl font-bold text-white mb-2">Emma, 1st Year</h3>
                  <div className="w-full h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-bold border border-white/30">
                    Break the Ice 🧊
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <motion.div 
              className="absolute -right-10 top-20 bg-rose-500 text-white font-bold px-4 py-2 rounded-full shadow-xl border border-rose-400"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              🔥 92% Match
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature 2: Bento Box Algorithm */}
      <section className="py-32 px-4 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">The Mathematics of Vibes.</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Our matchmaking engine calculates compatibility using semantic embeddings and campus-specific parameters.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-slate-950 p-8 rounded-3xl border border-slate-800 md:col-span-2 flex flex-col justify-between"
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Semantic Hot Takes</h3>
                <p className="text-slate-400">We analyze your campus hot takes using vector embeddings to find students with the exact same sense of humor.</p>
              </div>
              <div className="mt-10 p-4 bg-slate-900 rounded-2xl border border-slate-700">
                <p className="text-emerald-400 font-mono text-sm">similarity_score = dot_product(v1, v2) &gt; 0.85</p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-indigo-600 p-8 rounded-3xl border border-indigo-500 flex flex-col justify-between"
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">Study Energy</h3>
              <p className="text-indigo-200">Match with library rats or coffee shop regulars.</p>
              <div className="mt-8 text-6xl">🎧</div>
            </motion.div>

            <motion.div 
              className="bg-rose-500 p-8 rounded-3xl border border-rose-400 md:col-span-3 flex items-center justify-between overflow-hidden relative"
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            >
              <div className="relative z-10 max-w-lg">
                <h3 className="text-3xl font-bold text-white mb-2">Icebreakers, automated.</h3>
                <p className="text-rose-100 text-lg">No more "hey". Our engine generates contextual prompts instantly so you never have to think of a first message.</p>
              </div>
              <div className="hidden md:block text-[12rem] absolute right-10 -bottom-10 opacity-50 rotate-12">🧊</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10">READY?</h2>
          <Link href="/register" className="inline-block bg-white text-black px-12 py-6 rounded-full font-bold text-2xl hover:scale-110 transition-transform duration-300 shadow-[0_0_60px_rgba(255,255,255,0.4)]">
            Create Your Profile
          </Link>
        </motion.div>
      </section>
      
    </div>
  );
}
