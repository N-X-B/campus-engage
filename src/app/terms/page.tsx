"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';


export default function TermsofServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-xl text-zinc-400 font-medium">
            The rules and guidelines for participating in our community.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400"
        >
          
  <p>Last Updated: September 2026</p>
  
  <h2>1. Eligibility</h2>
  <p>By using CampusEngage, you represent and warrant that you are currently enrolled at a university or college. You must use a valid university email address (.edu or equivalent) or have an active student identity to participate in the network.</p>

  <h2>2. Acceptable Use Policy</h2>
  <p>CampusEngage is designed for building meaningful connections. You agree <strong>not</strong> to:</p>
  <ul>
    <li>Harass, bully, or intimidate other students.</li>
    <li>Use the platform for commercial spam, pyramid schemes, or unsolicited promotions.</li>
    <li>Create fake accounts, impersonate others, or share links with malicious intent.</li>
    <li>Upload explicit, violent, or strictly prohibited content.</li>
  </ul>
  <p>Violating these terms will result in an immediate, permanent ban.</p>

  <h2>3. Fair Use & Icebreaker Limits</h2>
  <p>To prevent spam and ensure high-quality interactions, standard accounts are limited to a daily maximum of Icebreaker messages. Users who abuse the system or attempt to bypass referral paywalls artificially may have their accounts restricted.</p>

  <h2>4. Limitation of Liability</h2>
  <p>CampusEngage provides the platform "as-is". We are not responsible for the conduct of any user on or off the platform. You agree to use caution and common sense when interacting with others and arranging real-world meetings.</p>

        </motion.div>
      </main>
    </div>
  );
}
