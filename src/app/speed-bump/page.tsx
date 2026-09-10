"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '@/components/LoadingScreen';
import { haptic } from '@/lib/haptics';
import confetti from 'canvas-confetti';

const SUPERLATIVES = [
  "Most likely to become a CEO? 💼",
  "Who has the best smile? 😊",
  "Most likely to survive a zombie apocalypse? 🧟",
  "Main Character Energy ✨",
  "Most likely to sleep through a final exam 😴",
  "Best dressed on campus 👗",
  "Always knows the campus gossip ☕",
  "Most likely to go viral on TikTok 📱",
  "Who carries the group project? 📚",
  "Who would you want to be stranded on an island with? 🏝️"
];

export default function SpeedBumpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
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
        const q = query(collection(db, 'users'), where('onboarded', '==', true));
        const snap = await getDocs(q);
        let users: any[] = [];
        snap.forEach(d => {
          if (d.id !== user.uid && d.data().status !== 'under_review') {
            users.push({ id: d.id, ...d.data() });
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
    if (votesCast >= 5) {
      setIsDone(true);
      return;
    }
    
    const shuffledPrompt = SUPERLATIVES[Math.floor(Math.random() * SUPERLATIVES.length)];
    setCurrentPrompt(shuffledPrompt);
    
    const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 4);
    setOptions(selected);
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
                <span className="text-indigo-500 font-bold tracking-widest text-xs uppercase mb-2 block">Speed Bump {votesCast + 1} / 5</span>
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
                    }`}
                  >
                    <img 
                      src={opt.photos?.[0] || 'https://via.placeholder.com/300'} 
                      alt={opt.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <p className="font-bold text-white text-lg drop-shadow-md">{opt.name?.split(' ')[0]}</p>
                      <p className="text-xs font-medium text-white/70 drop-shadow-md">{opt.branch}</p>
                    </div>

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
