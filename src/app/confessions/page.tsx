"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, doc } from 'firebase/firestore';

const VULGAR_WORDS = ['fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'slut', 'whore', 'cunt', 'nigger', 'faggot', 'rape'];

export default function ConfessionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [confessions, setConfessions] = useState<any[]>([]);
  const [newConfession, setNewConfession] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [isIncognito, setIsIncognito] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    
    // Check if they are actually in Incognito Mode
    getDoc(doc(db, 'users', user.uid)).then(docSnap => {
      if (docSnap.exists() && docSnap.data().incognito) {
        setIsIncognito(true);
      } else {
        router.push('/profile'); // Kick them out if not incognito
      }
    });

    const q = query(collection(db, 'confessions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
       const docs: any[] = [];
       snapshot.forEach(d => docs.push({ id: d.id, ...d.data() }));
       setConfessions(docs);
    });

    return () => unsubscribe();
  }, [user, router]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newConfession.trim().length < 10) {
      setError("Confession must be at least 10 characters.");
      return;
    }

    // Basic Vulgarity Check
    const lowerText = newConfession.toLowerCase();
    for (const word of VULGAR_WORDS) {
      if (lowerText.includes(word)) {
        setError("Please keep it clean. Vulgar or highly offensive language is not allowed.");
        return;
      }
    }

    setIsPosting(true);
    try {
      await addDoc(collection(db, 'confessions'), {
        text: newConfession.trim(),
        timestamp: serverTimestamp()
      });
      setNewConfession('');
    } catch (err) {
      setError("Failed to post confession.");
    } finally {
      setIsPosting(false);
    }
  };

  if (!isIncognito) return null; // Wait until incognito is verified

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 pb-20 text-white">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-8 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-2">
            🎭 Campus Confessions
          </h1>
          <p className="text-zinc-400">100% anonymous. Post your deepest campus secrets, hot takes, or missed connections.</p>
        </div>

        <form onSubmit={handlePost} className="mb-12">
          <textarea
            value={newConfession}
            onChange={(e) => setNewConfession(e.target.value)}
            placeholder="I have a confession to make..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-[2rem] p-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none min-h-[120px] mb-4"
          />
          {error && <p className="text-rose-400 text-sm mb-4 font-medium">{error}</p>}
          <button 
            type="submit" 
            disabled={isPosting}
            className="w-full bg-indigo-500 text-white py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-indigo-400 transition-colors"
          >
            {isPosting ? 'Posting...' : 'Post Anonymously'}
          </button>
        </form>

        <div className="space-y-6">
          {confessions.length === 0 ? (
            <p className="text-center text-zinc-500 italic">No confessions yet. Be the first.</p>
          ) : (
            confessions.map((confession, idx) => (
              <motion.div
                key={confession.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-black border border-white/10 rounded-[2rem] p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
                    🕵️
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Anonymous</h4>
                    <p className="text-xs text-zinc-500">
                       {confession.timestamp?.seconds ? new Date(confession.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  "{confession.text}"
                </p>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
