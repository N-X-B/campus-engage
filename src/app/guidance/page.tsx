"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isDemoMode } from '@/lib/demo-backend';

export const ARCHETYPES = [
  {
    slug: 'tech',
    title: 'The Algorithm Oracle',
    emoji: '🔮',
    domains: ['CSE', 'AI-ML', 'IT', 'Computer Science', 'Software', 'Cse', 'cse'],
    tagline: 'Code is the new mantra. Every function is an intention.',
    color: 'from-indigo-500/20 to-violet-500/20',
    border: 'border-indigo-500/30',
    accent: 'text-indigo-400',
    glow: 'bg-indigo-500/10',
  },
  {
    slug: 'mechanical',
    title: 'The Iron Sage',
    emoji: '⚙️',
    domains: ['Mechanical', 'Mechatronics', 'Automobile'],
    tagline: 'Every machine is a universe governed by its own dharma.',
    color: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/30',
    accent: 'text-orange-400',
    glow: 'bg-orange-500/10',
  },
  {
    slug: 'civil',
    title: 'The Earth Shaper',
    emoji: '🏔️',
    domains: ['Civil', 'Construction', 'Architecture'],
    tagline: 'You do not build structures. You sculpt the future of civilization.',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-400',
    glow: 'bg-emerald-500/10',
  },
  {
    slug: 'electrical',
    title: 'The Current Keeper',
    emoji: '⚡',
    domains: ['Electrical', 'Electronics', 'EEE', 'ECE'],
    tagline: 'You channel the invisible force that powers all of creation.',
    color: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/30',
    accent: 'text-yellow-400',
    glow: 'bg-yellow-500/10',
  },
  {
    slug: 'management',
    title: 'The Dharmic Leader',
    emoji: '🪷',
    domains: ['MBA', 'Management', 'Business', 'Commerce', 'Finance', 'BBA'],
    tagline: 'True leadership is selfless service with unwavering vision.',
    color: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
    accent: 'text-rose-400',
    glow: 'bg-rose-500/10',
  },
  {
    slug: 'health',
    title: 'The Healer Monk',
    emoji: '🌿',
    domains: ['Pharmacy', 'Biotech', 'Medicine', 'Nursing', 'Life Sciences'],
    tagline: 'Healing is the highest form of service — the most ancient of callings.',
    color: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    accent: 'text-green-400',
    glow: 'bg-green-500/10',
  },
  {
    slug: 'design',
    title: 'The Vision Weaver',
    emoji: '🎨',
    domains: ['Design', 'Arts', 'Media', 'Communication', 'Animation'],
    tagline: 'Creativity is not a skill. It is a remembering of what you already know.',
    color: 'from-fuchsia-500/20 to-purple-500/20',
    border: 'border-fuchsia-500/30',
    accent: 'text-fuchsia-400',
    glow: 'bg-fuchsia-500/10',
  },
  {
    slug: 'seeker',
    title: 'The Eternal Seeker',
    emoji: '🌌',
    domains: ['Undecided', 'General', 'Other'],
    tagline: 'Not all who wander are lost. Some are mapping undiscovered worlds.',
    color: 'from-sky-500/20 to-blue-500/20',
    border: 'border-sky-500/30',
    accent: 'text-sky-400',
    glow: 'bg-sky-500/10',
  },
];

export function matchDomain(branch: string): string {
  if (!branch) return '';
  const b = branch.toLowerCase();
  for (const arc of ARCHETYPES) {
    if (arc.domains.some(d => b.includes(d.toLowerCase()))) return arc.slug;
  }
  if (b.includes('cse') || b.includes('computer') || b.includes('ai') || b.includes('data')) return 'tech';
  if (b.includes('mech')) return 'mechanical';
  if (b.includes('civil')) return 'civil';
  if (b.includes('elec') || b.includes('ece') || b.includes('eee')) return 'electrical';
  if (b.includes('mba') || b.includes('manage') || b.includes('bba')) return 'management';
  if (b.includes('pharma') || b.includes('bio') || b.includes('health')) return 'health';
  if (b.includes('design') || b.includes('art')) return 'design';
  return 'seeker';
}

export default function GuidancePage() {
  const { user } = useAuth();
  const [suggestedSlug, setSuggestedSlug] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!user || isDemoMode) return;
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.branch) setSuggestedSlug(matchDomain(d.branch));
        if (d.name) setUserName(d.name.split(' ')[0]);
      }
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-32 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/8 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-5xl mx-auto px-5 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-amber-400/80 text-xs font-bold uppercase tracking-[0.3em] mb-6 border border-amber-500/20 bg-amber-500/5 px-4 py-2 rounded-full">
            <span>🕉</span>
            <span>The Path — Growth Mode</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-5">
            Your Calling<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Awaits.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            {userName ? `${userName}, every` : 'Every'} path is sacred. Choose your domain and receive wisdom, a life roadmap, and daily guidance — not just for your career, but for how you live.
          </p>
        </motion.div>

        {suggestedSlug && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <p className="text-center text-xs text-amber-500/70 uppercase tracking-widest font-bold mb-4">✦ Your Archetype ✦</p>
            <Link href={`/guidance/${suggestedSlug}`} className="block">
              {ARCHETYPES.filter(a => a.slug === suggestedSlug).map(arc => (
                <div key={arc.slug} className={`relative p-8 rounded-3xl border ${arc.border} bg-gradient-to-br ${arc.color} flex items-center gap-6 group hover:scale-[1.01] transition-transform`}>
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl ${arc.glow} border ${arc.border} flex-shrink-0`}>{arc.emoji}</div>
                  <div className="flex-1">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${arc.accent}`}>Your Archetype</p>
                    <h2 className="text-2xl font-black text-white mb-2">{arc.title}</h2>
                    <p className="text-zinc-400 text-sm italic">&quot;{arc.tagline}&quot;</p>
                  </div>
                  <div className={`text-3xl opacity-0 group-hover:opacity-100 transition-opacity ${arc.accent}`}>→</div>
                </div>
              ))}
            </Link>
          </motion.div>
        )}

        <p className="text-center text-xs text-zinc-600 uppercase tracking-widest font-bold mb-8">
          {suggestedSlug ? '✦ Or explore all paths ✦' : '✦ Choose your archetype ✦'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ARCHETYPES.map((arc, i) => (
            <motion.div
              key={arc.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/guidance/${arc.slug}`}>
                <div className={`relative p-6 rounded-2xl border ${arc.border} bg-gradient-to-br ${arc.color} group hover:scale-[1.02] transition-all duration-300 cursor-pointer`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${arc.glow} border ${arc.border} flex-shrink-0`}>{arc.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-white mb-1">{arc.title}</h3>
                      <p className="text-zinc-500 text-xs mb-3 leading-relaxed">{arc.tagline}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {arc.domains.slice(0, 3).map(d => (
                          <span key={d} className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/30 ${arc.accent} border ${arc.border}`}>{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`absolute bottom-5 right-5 text-xl opacity-0 group-hover:opacity-100 transition-opacity ${arc.accent}`}>→</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mt-20">
          <p className="text-zinc-600 text-sm italic">&quot;You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.&quot;</p>
          <p className="text-zinc-700 text-xs mt-2">— Bhagavad Gita, Chapter 2, Verse 47</p>
        </motion.div>
      </div>
    </div>
  );
}
