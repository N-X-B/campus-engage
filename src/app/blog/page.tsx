"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: "Coming Soon: The 9 PM Campus Drop & Crush Radar",
    category: "Roadmap",
    date: "November 12, 2026",
    excerpt: "We are about to change how the campus connects. Get ready for time-gated matching, anonymous crush tagging, and curiosity loops.",
    content: "Swiping at 2 PM is dead because no one is online to reply. We're fixing this with the '9 PM Campus Drop'—the Feed will be locked all day until exactly 9 PM. You'll have exactly 1 hour to see your matches while the entire campus is online concurrently. \n\nWe're also dropping 'Crush Radar', allowing you to anonymously tag 3 people you're into. If they tag you back? The screen shatters and a private chat opens. Finally, we're making Superlatives more interesting: when someone votes for you, their identity is blurred until you unlock it.",
    gradient: "from-rose-500/20 to-orange-500/10",
    border: "border-rose-500/30"
  },
  {
    id: 2,
    title: "Safety First: On-Device AI Photo Moderation",
    category: "Release",
    date: "November 5, 2026",
    excerpt: "We've rebuilt our photo management system from the ground up to keep the campus safe, utilizing advanced edge AI.",
    content: "Trust is the foundation of our network. Our new standalone 'Edit Photos' modal doesn't just look sleek—it's powered by TensorFlow.js and the NSFWJS model running entirely on your device. Every photo is instantly scanned for explicit content before it ever touches our servers. If it doesn't pass the vibe check, it gets blocked instantly. Fast, private, and secure.",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30"
  },
  {
    id: 3,
    title: "Introducing Aura Score & Incognito Confessions",
    category: "Feature",
    date: "October 28, 2026",
    excerpt: "Your social reputation is now quantifiable. Plus, an exclusive space for your deepest campus secrets.",
    content: "Think of it as a CIBIL score for your dating profile. Your Aura Score is a dynamic trust rating out of 100 based on your interactions. High vibes, high score. \n\nWe've also launched the Confessions feed. By toggling 'Incognito Mode' on your profile, you can access an exclusive, anonymous 'Spotted' board to post secrets and read the latest campus drama without leaving a trace.",
    gradient: "from-indigo-500/20 to-blue-500/10",
    border: "border-indigo-500/30"
  },
  {
    id: 4,
    title: "The Mathematics of Vibes: Vertical Matchability",
    category: "Release",
    date: "October 15, 2026",
    excerpt: "We scrapped the boring left/right swiping mechanics for a premium, immersive vertical feed powered by semantic embeddings.",
    content: "Why swipe on random zip codes when you can match on actual energy? Our new matchmaking engine calculates a precise Matchability Factor™ out of 100%. We map your Academic Year, Branch, Routine, and Hot Takes using vector embeddings to find students with the exact same sense of humor. The highest matches are instantly pushed to the top of your vertical feed. Stop swiping, start scrolling.",
    gradient: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/30"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-white hover:scale-105 transition-transform">
          CampusEngage.
        </Link>
        <Link href="/" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition">
          Return Home
        </Link>
      </nav>

      <main className="pt-32 pb-24 px-4 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-block border border-white/10 rounded-full px-4 py-1.5 mb-6 bg-white/5 backdrop-blur-md">
            <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Changelog</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            Building the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-700">Perfect Network.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            Product updates, feature drops, and the engineering behind the most exclusive matchmaking algorithm on campus.
          </p>
        </motion.div>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className={`bg-zinc-950 rounded-3xl p-8 md:p-10 border ${post.border} relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md">
                    {post.category}
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">
                    {post.date}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-white">
                  {post.title}
                </h2>
                
                <p className="text-zinc-400 text-sm md:text-base mb-6 font-medium">
                  {post.excerpt}
                </p>
                
                <div className="w-full h-px bg-white/10 mb-6" />
                
                <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
      
    </div>
  );
}
