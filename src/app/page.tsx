"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white text-slate-900 font-sans selection:bg-slate-100">
      
      {/* Navigation */}
      <header className="w-full px-6 py-6 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="text-xl font-semibold tracking-tight">
          CampusEngage.
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <Button variant="default" className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-5 shadow-sm transition-all hover:scale-105">
              Join Now
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center px-6">
        <section className="w-full max-w-5xl py-20 md:py-32 flex flex-col items-center text-center border-b border-slate-50">
          
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-slate-900 mr-2 animate-pulse"></span>
            Exclusive to university students
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Meaningful connections <br className="hidden sm:block"/> start here.
          </motion.h1>
          
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl text-lg sm:text-xl text-slate-500 mb-10 font-light leading-relaxed">
            A refined space to meet, connect, and date within your university network. Designed for students who value authenticity over endless swiping.
          </motion.p>
          
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/register">
              <Button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 rounded-md px-8 py-6 text-lg h-14 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                Create Account
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="w-full sm:w-auto rounded-md px-8 py-6 text-lg h-14 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                See How It Works
              </Button>
            </Link>
          </motion.div>

        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why CampusEngage?</h2>
            <p className="mt-4 text-slate-500">Built exclusively for our campus culture.</p>
          </div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              { title: "No Cringe Swiping", desc: "We removed the swipe. Connect by answering engaging icebreaker prompts." },
              { title: "Verified Students", desc: "A closed community. You're only interacting with actual peers from your university." },
              { title: "Real Conversations", desc: "Our mechanics are designed to spark genuine chats, not just collect matches." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <div className="w-4 h-4 bg-slate-900 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-4xl py-24 mb-12 bg-slate-50 rounded-3xl text-center px-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Ready to find your match?</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">Join hundreds of other students already making meaningful connections on campus.</p>
          <Link href="/register">
            <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-md px-10 py-6 text-lg shadow-sm transition-all hover:scale-105">
              Get Started Now
            </Button>
          </Link>
        </section>
      </main>

      <footer className="w-full py-12 text-center border-t border-slate-100">
        <p className="text-sm text-slate-400">
          © 2026 CampusEngage. Built for students.
        </p>
      </footer>
    </div>
  );
}
