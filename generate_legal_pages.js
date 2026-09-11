const fs = require('fs');

const createPage = (path, title, subtitle, content) => {
  fs.mkdirSync("src/app/" + path, { recursive: true });
  
  const code = `"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';

export default function ` + title.replace(/\s/g, '') + `Page() {
  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 overflow-hidden relative pb-20 text-white">
      <div className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[40%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <Navigation />

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
            ` + title + `
          </h1>
          <p className="text-xl text-zinc-400 font-medium">
            ` + subtitle + `
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400"
        >
          ` + content + `
        </motion.div>
      </main>
    </div>
  );
}
`;

  fs.writeFileSync("src/app/" + path + "/page.tsx", code);
};

const privacyContent = `
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
`;

const termsContent = `
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
`;

const safetyContent = `
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
`;

createPage('privacy', 'Privacy Policy', 'How we handle, protect, and process your personal data.', privacyContent);
createPage('terms', 'Terms of Service', 'The rules and guidelines for participating in our community.', termsContent);
createPage('safety', 'Safety Tips', 'Best practices for staying secure both online and on-campus.', safetyContent);

console.log("Pages generated successfully.");
