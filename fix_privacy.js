const fs = require('fs');

const code = `"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
            How we handle, protect, and process your personal data.
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
              📊
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">What Information We Collect</h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              We collect minimal information to provide a highly optimized campus networking experience:
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-indigo-400 font-bold mt-1">01</span>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Account Data</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Your university email, name, and password (securely hashed via Firebase Auth).</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-indigo-400 font-bold mt-1">02</span>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Profile Data</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Your graduation year, major, profile photo, and answers to the Vibe Check questionnaire.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-indigo-400 font-bold mt-1">03</span>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">Usage Data</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Icebreakers sent, login frequency, and referral networks to enforce limits and unlock features.</p>
                </div>
              </li>
            </ul>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-zinc-900/60 transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-emerald-500/30">
              🛡️
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">How We Use Your Data</h2>
            <p className="text-zinc-400 leading-relaxed">
              Your data exclusively fuels our matchmaking algorithm. We process your answers to calculate compatibility scores using semantic similarity and behavioral matrices. <strong>We do not sell your personal data to third-party data brokers.</strong> Your profile is only visible to other verified students within the CampusEngage network.
            </p>
          </motion.section>

          <motion.section 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-10 hover:bg-zinc-900/60 transition-colors"
          >
            <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-rose-500/30">
              🗑️
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Data Deletion & Your Rights</h2>
            <p className="text-zinc-400 leading-relaxed">
              You have absolute control over your digital footprint. At any time, you can navigate to the <span className="text-white font-bold">Account Settings</span> section of your Profile and click <span className="text-rose-400 font-bold">Delete Account</span>. This action triggers a cascade protocol that permanently wipes your profile, matches, chat history, and photos from our primary database and authentication servers instantly.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/app/privacy/page.tsx', code);
