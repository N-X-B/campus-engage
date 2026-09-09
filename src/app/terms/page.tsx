"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 pb-20 text-white">
      {/* Abstract Background Elements */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-rose-500/10 rounded-full blur-[100px]" />
      </div>

      <nav className="w-full px-6 py-5 bg-black/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold tracking-tight text-white hover:scale-105 transition-transform">
          CampusEngage.
        </Link>
        <Link href="/" className="text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">
          Back to Home
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            Legal & Trust
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            The rules and guidelines for participating in our community.
          </p>
          <p className="text-sm text-zinc-500 mt-4 uppercase tracking-widest font-bold">Last Updated: September 2026</p>
        </motion.div>

        <div className="space-y-8">
          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-zinc-900/60 transition-colors"
          >
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-indigo-500/30">
              🎓
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Eligibility</h2>
            <p className="text-zinc-400 leading-relaxed">
              By using CampusEngage, you represent and warrant that you are currently enrolled at a university or college. You must use a valid university email address (.edu or equivalent) or have an active student identity to participate in the network.
            </p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-zinc-900/60 transition-colors"
          >
            <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-rose-500/30">
              🛑
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Acceptable Use Policy</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              CampusEngage is designed for building meaningful connections. You agree <strong>not</strong> to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
                 <span className="text-xl mb-2 block">🚫</span>
                 <p className="text-sm text-zinc-300 font-medium">Harass, bully, or intimidate other students.</p>
               </div>
               <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
                 <span className="text-xl mb-2 block">🤖</span>
                 <p className="text-sm text-zinc-300 font-medium">Use the platform for commercial spam or bots.</p>
               </div>
               <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
                 <span className="text-xl mb-2 block">🎭</span>
                 <p className="text-sm text-zinc-300 font-medium">Create fake accounts or impersonate others.</p>
               </div>
               <div className="bg-black/50 p-5 rounded-2xl border border-white/5">
                 <span className="text-xl mb-2 block">🔞</span>
                 <p className="text-sm text-zinc-300 font-medium">Upload explicit, violent, or strictly prohibited content.</p>
               </div>
            </div>
            <p className="text-rose-400 mt-6 font-bold text-sm">Violating these terms will result in an immediate, permanent ban.</p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-zinc-900/60 transition-colors"
          >
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-amber-500/30">
              ⚖️
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Fair Use & Icebreaker Limits</h2>
            <p className="text-zinc-400 leading-relaxed">
              To prevent spam and ensure high-quality interactions, standard accounts are limited to a daily maximum of Icebreaker messages. Users who abuse the system, spam requests, or attempt to bypass referral paywalls artificially may have their accounts permanently restricted.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
