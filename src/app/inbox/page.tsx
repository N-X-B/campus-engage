"use client";

import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function InboxPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [view, setView] = useState<'messages' | 'invitations'>('messages');
  const [isWiping, setIsWiping] = useState(false);

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

  const wipeAllChats = async () => {
    if (!confirm("Are you sure you want to delete ALL your chats? This is irreversible.")) return;
    setIsWiping(true);
    try {
       for (const conv of conversations) {
          await deleteDoc(doc(db, 'conversations', conv.id));
       }
       alert("All chats wiped successfully.");
    } catch(err) {
       console.error("Failed to wipe", err);
    } finally {
       setIsWiping(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

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
       convos.sort((a, b) => b.lastUpdated - a.lastUpdated);
       setConversations(convos);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading || !user) return <LoadingScreen />;

  const activeChats = conversations.filter(c => c.status === 'active');
  const pendingRequests = conversations.filter(c => c.status === 'pending' && c.receiverId === user.uid);
  const sentRequests = conversations.filter(c => c.status === 'pending' && c.senderId === user.uid);

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-white/20 pb-20">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Inbox</h1>
            <p className="text-zinc-500 font-medium">Your campus connections.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button onClick={wipeAllChats} disabled={isWiping} className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-1 rounded border border-rose-500/30 uppercase tracking-widest font-bold hover:bg-rose-500/40">
              {isWiping ? 'Wiping...' : 'Wipe All Chats'}
            </button>
            <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setView('messages')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === 'messages' ? 'bg-indigo-500 text-white' : 'text-zinc-500 hover:text-white'}`}
              >
                Messages
              </button>
              <button 
                onClick={() => setView('invitations')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors relative ${view === 'invitations' ? 'bg-indigo-500 text-white' : 'text-zinc-500 hover:text-white'}`}
              >
                Invitations
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {view === 'messages' && (
             activeChats.length === 0 ? (
               <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl">
                 <div className="text-4xl mb-4">👻</div>
                 <h3 className="text-white font-bold mb-2">No active chats</h3>
                 <p className="text-zinc-500 text-sm">Send some icebreakers to get started!</p>
               </div>
             ) : (
               activeChats.map((chat, idx) => {
                 const otherUser = allUsers.find(u => u.id === chat.otherUserId);
                 return (
                   <motion.div
                     key={chat.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.2, delay: idx * 0.05 }}
                   >
                     <Link href={`/chat/${chat.id}`} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-white/5">
                       <div className="relative">
                         <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 border border-white/10">
                           {otherUser?.photos?.[0] ? (
                             <img src={otherUser.photos[0]} alt="Profile" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                           )}
                         </div>
                       </div>
                       
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-baseline mb-1">
                           <h3 className="text-white font-bold truncate pr-4">{otherUser?.name || 'Unknown User'}</h3>
                           <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase flex-shrink-0">
                             {new Date(chat.lastUpdated).toLocaleDateString()}
                           </span>
                         </div>
                         <p className="text-zinc-400 text-sm truncate">{chat.lastMessage || 'Say hi!'}</p>
                       </div>
                     </Link>
                   </motion.div>
                 );
               })
             )
          )}

          {view === 'invitations' && (
            <>
              {pendingRequests.length === 0 && sentRequests.length === 0 && (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl">
                 <div className="text-4xl mb-4">📭</div>
                 <h3 className="text-white font-bold mb-2">No pending invitations</h3>
                 <p className="text-zinc-500 text-sm">Your inbox is clear.</p>
               </div>
              )}

              {pendingRequests.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Received Requests</h3>
                  {pendingRequests.map((chat, idx) => {
                    const otherUser = allUsers.find(u => u.id === chat.otherUserId);
                    return (
                      <motion.div key={chat.id} initial={{opacity:0}} animate={{opacity:1}} className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-3xl mb-3 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                             {otherUser?.photos?.[0] ? <img src={otherUser.photos[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">👤</div>}
                           </div>
                           <div>
                             <h4 className="text-white font-bold">{otherUser?.name || 'Someone'}</h4>
                             <p className="text-xs text-indigo-300 mt-1">Wants to break the ice!</p>
                           </div>
                         </div>
                         <button 
                           onClick={() => handleAccept(chat.id, chat.icebreakerPrompt || 'Hey!', chat.senderId)}
                           className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                         >
                           Accept Request
                         </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {sentRequests.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Sent Requests (Pending)</h3>
                  {sentRequests.map((chat) => {
                    const otherUser = allUsers.find(u => u.id === chat.otherUserId);
                    return (
                      <div key={chat.id} className="bg-zinc-900/30 border border-white/5 p-4 rounded-3xl mb-3 flex items-center gap-4 opacity-70">
                         <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                           {otherUser?.photos?.[0] ? <img src={otherUser.photos[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">👤</div>}
                         </div>
                         <div>
                           <h4 className="text-zinc-300 font-bold text-sm">{otherUser?.name || 'Someone'}</h4>
                           <p className="text-xs text-zinc-500">Waiting for them to accept...</p>
                         </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
