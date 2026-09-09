"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';


export default function SafetyTipsPage() {
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
            Safety Tips
          </h1>
          <p className="text-xl text-zinc-400 font-medium">
            Best practices for staying secure both online and on-campus.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400"
        >
          
  <p>Your safety is our absolute priority. While we require university emails to join, you should always remain vigilant when meeting new people online.</p>

  <h2>1. Keep Conversations on the App</h2>
  <p>Get to know someone through the CampusEngage chat before moving to iMessage, Snapchat, or Instagram. Our platform allows you to securely unmatch and report users without exposing your personal phone number or social handles.</p>

  <h2>2. Never Share Financial or Sensitive Info</h2>
  <p>Never send money, crypto, or gift cards to someone you met on the app. Do not share your dorm room number, social security number, or exact class schedule with someone you haven't built absolute trust with.</p>

  <h2>3. Meet in Public, On Campus</h2>
  <p>For your first few meetups, choose well-lit, public areas on campus. Great options include:</p>
  <ul>
    <li>The main campus library or student union.</li>
    <li>A busy on-campus coffee shop.</li>
    <li>The campus dining hall during peak hours.</li>
  </ul>
  <p>Avoid meeting in private dorm rooms or off-campus apartments until you are fully comfortable.</p>

  <h2>4. Use the Report Button</h2>
  <p>If someone makes you uncomfortable, sends explicit messages, or acts suspiciously, use the <strong>Report</strong> feature immediately. We take reports seriously and will ban users who violate our community guidelines. Your reports are kept strictly confidential.</p>

        </motion.div>
      </main>
    </div>
  );
}
