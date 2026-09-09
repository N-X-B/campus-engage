"use client";

import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function InboxPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
  const handleAccept = async (convId: string, prompt: string, senderId: string) => {
    try {
      await updateDoc(doc(db, 'conversations', convId), {
        status: 'active',
        lastMessage: prompt,
        lastUpdated: Date.now()
      });
      // Add the prompt as the first actual message
      await addDoc(collection(db, `conversations/${convId}/messages`), {
         text: prompt,
         senderId: senderId,
         senderName: 'Connection',
         timestamp: Date.now()
      });
    } catch(err) {
      console.error("Failed to accept", err);
    }
  };

    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    if (isDemoMode) {
      setConversations(demoDb.getConversations());
      demoDb.getProfiles().then(setAllUsers);
      return;
    }

    // Load all users to get names/photos for the inbox
    getDocs(collection(db, 'users')).then(snapshot => {
      const users: any[] = [];
      snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
      setAllUsers(users);
    });

    // Listen to real conversations
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
       const convos: any[] = [];
       snapshot.forEach(d => {
          const data = d.data();
          const otherUserId = data.participants?.find((id: string) => id !== user.uid);
          convos.push({
             id: d.id,
             otherUserId,
             status: data.status || 'active',
             senderId: data.senderId,
             receiverId: data.receiverId,
             icebreakerPrompt: data.icebreakerPrompt,
             lastMessage: data.lastMessage,
             lastUpdated: data.lastUpdated || 0,
             read: true
          });
       });
       // Sort correctly to have latest at the top
       convos.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
       setConversations(convos);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-0 font-sans selection:bg-white/20">
      <Navigation />
      
      <main className="max-w-3xl mx-auto p-4 sm:p-6 mt-4">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">Messages</h1>
          <p className="text-zinc-500 mt-2 text-lg">Your campus connections.</p>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-32 bg-zinc-950 rounded-[2rem] border border-white/5">
            <div className="text-6xl mb-4 opacity-50 grayscale">🧊</div>
            <h3 className="text-2xl font-bold text-white mb-2">It's quiet here...</h3>
            <p className="text-zinc-500 mb-8">Go to Discover and break the ice with someone.</p>
            <Link href="/feed" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition">
              Discover Matches
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv, i) => {
              const otherUser = allUsers.find(u => u.id === (isDemoMode ? conv.id.replace('conv-', '') : conv.otherUserId));
              
              return (
                <Link href={`/chat/${conv.id}`} key={conv.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center p-4 bg-zinc-900/50 hover:bg-zinc-800/80 backdrop-blur-md rounded-3xl border border-white/5 transition-colors group cursor-none md:cursor-auto"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 mr-5 flex-shrink-0 border border-white/10 relative">
                      {otherUser?.photos?.[0] ? (
                        <img src={otherUser.photos[0]} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                      )}
                      {!conv.read && <div className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-black" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-xl font-bold text-white truncate">{otherUser?.name || 'Campus Match'}</h3>
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider ml-2">
                          {new Date(conv.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conv.read ? 'text-zinc-500' : 'text-white font-bold'}`}>
                        {conv.lastMessage || "Start the conversation..."}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
