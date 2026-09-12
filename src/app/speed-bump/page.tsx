"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '@/components/LoadingScreen';
import { haptic } from '@/lib/haptics';
import confetti from 'canvas-confetti';

type Question = { type: 'profile', text: string } | { type: 'text', text: string, answers: string[] };

const QUESTIONS: Question[] = [
  // Spicy Profile Questions (Thrilling)
  { type: 'profile', text: "Most likely to break a heart this semester 💔" },
  { type: 'profile', text: "Who is definitely hiding a crazy side? 😈" },
  { type: 'profile', text: "Who would you trust with your deepest secret? 🤫" },
  { type: 'profile', text: "Who has the most unspoken rizz on campus? 🫦" },
  { type: 'profile', text: "Intimidatingly good looking 🧿" },
  { type: 'profile', text: "Who are you double-taking in the hallway? 👀" },
  { type: 'profile', text: "Most likely to steal your hoodie and never return it 🧥" },
  { type: 'profile', text: "Who would you secretly want to match with? 🎯" },
  { type: 'profile', text: "Most likely to leave you on delivered for 3 days 📱" },
  { type: 'profile', text: "Main Character Energy ✨" },
  
  // Non-Profile "Hot Take" Questions
  { type: 'text', text: "Biggest ick on a first date? 🚩", answers: ["Being rude to waiters", "Talking about their ex", "Being on their phone", "No ambition"] },
  { type: 'text', text: "What's the most attractive major? 📚", answers: ["Engineering/CS", "Business/Finance", "Arts/Humanities", "Pre-Med"] },
  { type: 'text', text: "What's your toxic trait? 💅", answers: ["Ghosting people", "Overthinking everything", "Falling in love too fast", "Never texting back"] },
  { type: 'text', text: "Best late-night campus food? 🍕", answers: ["Pizza", "Taco Bell", "Diner/Waffle House", "Instant Noodles"] },
  { type: 'text', text: "Ideal Friday night? 🌙", answers: ["Massive Frat Party", "Small group of friends", "Bingeing Netflix alone", "Late night drive"] }
];

export default function SpeedBumpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  
  const [votesCast, setVotesCast] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), where('onboarded', '==', true), limit(50));
        const snap = await getDocs(q);
        let users: any[] = [];
        snap.forEach(d => {
          const data = d.data();
          if (d.id !== user.uid && data.status !== 'under_review') {
            users.push({ id: d.id, ...data });
          }
        });
        
        users = users.sort(() => 0.5 - Math.random());
        setCandidates(users);
        
        if (users.length >= 4) {
          generatePoll(users);
        } else {
          setIsDone(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  const generatePoll = (pool: any[]) => {
    if (votesCast >= 12) {
      setIsDone(true);
      return;
    }
    
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    setCurrentQuestion(q);
    setCurrentPrompt(q.text);
    
    if (q.type === 'profile') {
      const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 4);
      setOptions(selected);
    } else {
      // It's a text poll, map answers to options format
      const selected = q.answers.map((ans, i) => ({
        id: `text_${i}`,
        isText: true,
        text: ans,
      }));
      setOptions(selected);
    }
    setSelectedId(null);
  };

  const handleVote = async (winnerId: string) => {
    if (selectedId) return; // Prevent double taps
    setSelectedId(winnerId);
    haptic.success();
    
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#4f46e5', '#a855f7', '#ffffff'],
        disableForReducedMotion: true
      });
    } catch(e) {}

    try {
      if (currentQuestion?.type === 'profile') {
        await updateDoc(doc(db, 'users', winnerId), {
           auraScore: increment(2),
           superlativeWins: increment(1)
        });
        
        await addDoc(collection(db, 'superlative_votes'), {
           voterId: user!.uid,
           receiverId: winnerId,
           prompt: currentPrompt,
           timestamp: serverTimestamp(),
           status: 'unread'
        });
      } else {
        // Just record the global hot take answer if needed, or do nothing.
        // For now, we just give them the token.
      }
    } catch (err) {
      console.error("Failed to save vote", err);
    }
    
    setTimeout(() => {
      setVotesCast(prev => prev + 1);
      generatePoll(candidates);
    }, 1200);
  };

  if (loading || fetching) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 pb-20 text-white">
      <Navigation />

      <main className="max-w-lg mx-auto px-4 sm:px-6 pt-12 flex flex-col items-center">
        
        {isDone ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-20"
          >
            <div className="text-6xl mb-6">🏆</div>
            <h1 className="text-3xl font-black mb-2">You're out of bumps!</h1>
            <p className="text-zinc-400 mb-8">Thanks for gassing up your peers. More prompts drop tomorrow.</p>
            <button 
              onClick={() => router.push('/feed')}
              className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
            >
              Back to Discover
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={votesCast}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-10 w-full">
                <span className="text-indigo-500 font-bold tracking-widest text-xs uppercase mb-2 block flex items-center justify-center gap-2">
                  <span>Speed Bump {votesCast + 1} / 12</span>
                  <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">💰 {votesCast * 10} Coins</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{currentPrompt}</h1>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {options.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote(opt.id)}
                    disabled={selectedId !== null}
                    className={`relative aspect-square rounded-3xl overflow-hidden border-2 transition-all duration-300 group ${
                      selectedId === opt.id 
                        ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] z-10 scale-105'
                        : selectedId !== null 
                          ? 'border-white/5 opacity-40 scale-95 grayscale' 
                          : 'border-white/10 hover:border-white/30'
                    } ${opt.isText ? 'bg-zinc-900 flex items-center justify-center p-4' : ''}`}
                  >
                    {!opt.isText ? (
                      <>
                        <img 
                          src={opt.photos?.[0] || 'https://via.placeholder.com/300'} 
                          alt={opt.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4 text-left">
                          <p className="font-bold text-white text-lg tracking-tight">{opt.name}</p>
                          <p className="text-zinc-300 text-xs font-medium">{opt.year ? `Year ${opt.year}` : 'Student'}</p>
                        </div>
                      </>
                    ) : (
                      <p className="font-bold text-white text-xl text-center leading-tight tracking-tight">{opt.text}</p>
                    )}

                    {/* Floating Reward Animation */}
                    <AnimatePresence>
                      {selectedId === opt.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20, scale: 0.5 }}
                          animate={{ opacity: 1, y: -40, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <span className="bg-indigo-500 text-white font-black text-2xl px-4 py-2 rounded-full shadow-2xl border-2 border-white/20">
                            +10 💰
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {selectedId === opt.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-indigo-500/30 backdrop-blur-sm"
                      >
                        <span className="text-5xl">🔥</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
