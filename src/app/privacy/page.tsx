"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';


export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 overflow-hidden relative pb-20 text-white">
      <div className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[40%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      
      <nav className="w-full px-6 py-5 bg-black/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold tracking-tight text-white hover:scale-105 transition-transform">
          CampusEngage.
        </Link>
        <Link href="/" className="text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">
          Back to Home
        </Link>
      </nav>
  

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
            Legal & Trust
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-zinc-400 font-medium">
            How we handle, protect, and process your personal data.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400"
        >
          
  <p>Last Updated: September 2026</p>
  
  <h2>1. What Information We Collect</h2>
  <p>We collect information to provide a better campus networking experience. This includes:</p>
  <ul>
    <li><strong>Account Data:</strong> Your university email, name, and password (securely hashed via Firebase Auth).</li>
    <li><strong>Profile Data:</strong> Your graduation year, major, profile photo, and answers to the Vibe Check questionnaire.</li>
    <li><strong>Messaging Data:</strong> Icebreaker prompts and chat history, stored securely in our database to enable communication.</li>
    <li><strong>Usage Data:</strong> Icebreakers sent, login frequency, and referral networks to enforce limits and unlock features.</li>
  </ul>

  <h2>2. How We Use Your Data</h2>
  <p>Your data fuels our matchmaking algorithm. We process your answers to calculate compatibility scores using semantic similarity and behavioral matrices. We do not sell your personal data to third-party data brokers. Your profile is only visible to other verified students within the CampusEngage network.</p>

  <h2>3. Data Deletion & Your Rights</h2>
  <p>You have full control over your digital footprint. At any time, you can navigate to the <strong>Account Settings</strong> section of your Profile and click <strong>Delete Account</strong>. This action triggers a cascade delete that permanently wipes your profile, matches, chat history, and photos from our primary database and authentication servers.</p>

  <h2>4. AI & Vector Embeddings</h2>
  <p>To provide advanced matchmaking, anonymous subsets of your "Hot Takes" may be processed by AI models to generate mathematical vector embeddings. These embeddings contain no personally identifiable information and are strictly used to compute conversational compatibility.</p>

        </motion.div>
      </main>
    </div>
  );
}
