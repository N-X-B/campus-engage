"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SafetyTipsPage() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 pb-20 text-white">
      {/* Abstract Background Elements */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]" />
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
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            Safety First
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            Safety Tips
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            Best practices for staying secure both online and on-campus.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] p-8 md:p-10 hover:bg-zinc-900/60 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -z-10" />
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-emerald-500/30">
              💬
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Keep Conversations on the App</h2>
            <p className="text-zinc-400 leading-relaxed">
              Get to know someone through the CampusEngage chat before moving to iMessage, Snapchat, or Instagram. Our platform allows you to securely unmatch and report users without exposing your personal phone number or social handles.
            </p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-zinc-900/60 transition-colors"
          >
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-amber-500/30">
              💳
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Never Share Sensitive Info</h2>
            <p className="text-zinc-400 leading-relaxed">
              Never send money, crypto, or gift cards to someone you met on the app. Do not share your dorm room number, social security number, or exact class schedule with someone you haven't built absolute trust with.
            </p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-zinc-900/60 transition-colors"
          >
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-indigo-500/30">
              ☕
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Meet in Public, On Campus</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              For your first few meetups, choose well-lit, public areas on campus. Great options include:
            </p>
            <div className="flex flex-col gap-3">
               <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                 <span className="text-2xl">📚</span>
                 <span className="text-white font-medium">The main campus library or student union</span>
               </div>
               <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                 <span className="text-2xl">☕</span>
                 <span className="text-white font-medium">A busy on-campus coffee shop</span>
               </div>
               <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                 <span className="text-2xl">🍕</span>
                 <span className="text-white font-medium">The campus dining hall during peak hours</span>
               </div>
            </div>
            <p className="text-rose-400 mt-6 font-bold text-sm">Avoid meeting in private dorm rooms or off-campus apartments until you are fully comfortable.</p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-rose-900/10 backdrop-blur-xl border border-rose-500/20 rounded-[2rem] p-8 md:p-10 hover:bg-rose-900/20 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[40px] -z-10" />
            <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-rose-500/30">
              🚩
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Use the Report Button</h2>
            <p className="text-zinc-400 leading-relaxed">
              If someone makes you uncomfortable, sends explicit messages, or acts suspiciously, use the <strong className="text-white">Report</strong> feature immediately. We take reports seriously and will ban users who violate our community guidelines. Your reports are kept strictly confidential.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
