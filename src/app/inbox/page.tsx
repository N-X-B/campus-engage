"use client";
import { SonarBackground } from '@/components/SonarBackground';

import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, onSnapshot, getDocs, getDoc, updateDoc, doc, addDoc, deleteDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScrambleText } from '@/components/ScrambleText';
import { TokenBadge } from '@/components/TokenBadge';

export default function InboxPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [crushes, setCrushes] = useState<any[]>([]);
  
  // Dopamine Loop State
  const [tokens, setTokens] = useState(0);
  const [unlockedCrushes, setUnlockedCrushes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTokens(parseInt(localStorage.getItem('revealTokens') || '0', 10));
    setUnlockedCrushes(JSON.parse(localStorage.getItem('unlockedCrushes') || '{}'));
    
    const handleTokenUpdate = () => {
      setTokens(parseInt(localStorage.getItem('revealTokens') || '0', 10));
    };
    window.addEventListener('tokensUpdated', handleTokenUpdate);
    return () => window.removeEventListener('tokensUpdated', handleTokenUpdate);
  }, []);

  const [view, setView] = useState<'messages' | 'invitations' | 'crushes'>('messages');
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
  const handleReject = async (convId: string, senderId: string) => {
    try {
      if (window.confirm("Report and block this user?")) {
        // Drop creep's aura score
        const targetDoc = await getDoc(doc(db, 'users', senderId));
        if (targetDoc.exists()) {
           const currentAura = targetDoc.data().auraScore || 20;
           await updateDoc(doc(db, 'users', senderId), {
             auraScore: Math.max(0, currentAura - 50)
           });
        }
        
        // Add to blocked array
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            blockedUsers: arrayUnion(senderId)
          });
        }

        await updateDoc(doc(db, 'conversations', convId), {
          status: 'rejected',
          lastUpdated: Date.now()
        });
      }
    } catch(err) {
      console.error("Failed to reject", err);
    }
  };

  const wipeAllChats = async () => {
    if (!confirm("DEV OVERRIDE: Are you sure you want to nuke EVERY chat from ALL users?")) return;
    setIsWiping(true);
    try {
       // Fetch literally all conversations in the database
       const allConvs = await getDocs(collection(db, 'conversations'));
       for (const document of allConvs.docs) {
          await deleteDoc(doc(db, 'conversations', document.id));
       }
       alert("GLOBAL NUKE COMPLETE: All chats from all users have been erased.");
       setConversations([]);
    } catch(err) {
       console.error("Failed to global wipe", err);
       alert("Failed to wipe all. You might have security rules blocking it. Check console.");
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

    // Check incognito status
    getDoc(doc(db, 'users', user.uid)).then((docSnap: any) => {
      if (docSnap.exists() && docSnap.data().incognito) {
         window.location.href = '/missed-connections';
      }
    });

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
             unreadCount: data[`unread_${user.uid}`] || 0
          });
       });
       // Sort correctly to have latest at the top
       convos.sort((a, b) => b.lastUpdated - a.lastUpdated);
       setConversations(convos);
    });

    // Listen to secret crushes
    const qCrush = query(collection(db, 'secret_crushes'), where('receiverId', '==', user.uid));
    const unsubscribeCrush = onSnapshot(qCrush, (snapshot) => {
      const crushList: any[] = [];
      snapshot.forEach(d => crushList.push({ id: d.id, ...d.data() }));
      crushList.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
      setCrushes(crushList);
    });

    return () => {
      unsubscribe();
      unsubscribeCrush();
    };
  }, [user]);

  if (loading || !user) return <LoadingScreen />;

  const activeChats = conversations.filter(c => c.status === 'active');
  const pendingRequests = conversations.filter(c => c.status === 'pending' && c.receiverId === user.uid);
  const sentRequests = conversations.filter(c => c.status === 'pending' && c.senderId === user.uid);

  return (
    <>
      <SonarBackground />
      <div className="min-h-screen relative z-10 font-sans selection:bg-white/20 pb-20">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Inbox</h1>
              <p className="text-zinc-500 font-medium">Your campus connections.</p>
            </div>
            <div className="ml-auto md:ml-4">
              <TokenBadge tokens={tokens} />
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <button onClick={wipeAllChats} disabled={isWiping} className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-1 rounded border border-rose-500/30 uppercase tracking-widest font-bold hover:bg-rose-500/40">
              {isWiping ? 'Wiping...' : 'Wipe All Chats'}
            </button>
            <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5 overflow-x-auto w-full md:w-auto no-scrollbar">
              <button 
                onClick={() => setView('messages')}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${view === 'messages' ? 'bg-indigo-500 text-white' : 'text-zinc-500 hover:text-white'}`}
              >
                Messages
              </button>
              <button 
                onClick={() => setView('invitations')}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-colors relative whitespace-nowrap ${view === 'invitations' ? 'bg-indigo-500 text-white' : 'text-zinc-500 hover:text-white'}`}
              >
                Invitations
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setView('crushes')}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-bold transition-colors relative whitespace-nowrap ${view === 'crushes' ? 'bg-rose-500 text-white' : 'text-zinc-500 hover:text-white'}`}
              >
                Crushes
                {crushes.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-rose-500 rounded-full text-[10px] flex items-center justify-center font-black">
                    {crushes.length}
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
                    <Link href={`/chat/${chat.id}`} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-zinc-900/50 transition-all hover:scale-[1.02] hover:shadow-2xl border border-transparent hover:border-white/10 z-10 relative">
                      <div className="relative">
                         <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 border border-white/10">
                           {otherUser?.photos?.[0] ? (
                             <img src={otherUser.photos[0]} alt="Profile" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                           )}
                         </div>
                       </div>
                       
                       <div className="flex-1 min-w-0 flex items-center justify-between">
                         <div className="flex-1 min-w-0 pr-4">
                           <div className="flex justify-between items-baseline mb-1">
                             <h3 className={`font-bold truncate pr-4 ${chat.unreadCount > 0 ? 'text-white' : 'text-zinc-300'}`}>{otherUser?.name || 'Unknown User'}</h3>
                             <span className={`text-[10px] font-bold tracking-widest uppercase flex-shrink-0 ${chat.unreadCount > 0 ? 'text-indigo-400' : 'text-zinc-500'}`}>
                               {new Date(chat.lastUpdated).toLocaleDateString()}
                             </span>
                           </div>
                           <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-white font-medium' : 'text-zinc-400'}`}>{chat.lastMessage || 'Say hi!'}</p>
                         </div>
                         {chat.unreadCount > 0 && (
                           <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shrink-0">
                             {chat.unreadCount}
                           </div>
                         )}
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
                         <div className="flex gap-2">
                           <button 
                             onClick={() => handleReject(chat.id, chat.senderId)}
                             className="text-xs font-medium text-zinc-500 hover:text-rose-500 transition-colors uppercase tracking-wider px-2 flex items-center"
                           >
                             Block
                           </button>
                           <button 
                             onClick={() => handleAccept(chat.id, chat.icebreakerPrompt || 'Hey!', chat.senderId)}
                             className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                           >
                             Accept Request
                           </button>
                         </div>
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

          {view === 'crushes' && (
             crushes.length === 0 ? (
               <div className="space-y-3">
                 <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 border border-white/5 p-5 rounded-3xl relative overflow-hidden"
                 >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[50px] pointer-events-none" />
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl shadow-inner">
                         {unlockedCrushes['teaser'] ? '👀' : '🤫'}
                       </div>
                       <div>
                         <h4 className="text-rose-400 font-bold text-sm tracking-widest uppercase">Secret Admirer</h4>
                         <span className="text-[10px] text-zinc-500">Just now</span>
                       </div>
                     </div>
                     {!unlockedCrushes['teaser'] && (
                       <button 
                         onClick={() => {
                           if (tokens >= 1) {
                             const newTokens = tokens - 1;
                             localStorage.setItem('revealTokens', newTokens.toString());
                             window.dispatchEvent(new Event('tokensUpdated'));
                             
                             const newUnlocked = { ...unlockedCrushes, ['teaser']: true };
                             localStorage.setItem('unlockedCrushes', JSON.stringify(newUnlocked));
                             setUnlockedCrushes(newUnlocked);
                           } else {
                             alert("Not enough Reveal Tokens! Go to the Feed and vote in Speed Bumps to earn them.");
                           }
                         }}
                         className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                       >
                         <span>Unlock</span>
                         <span className="opacity-75">(-1 🪙)</span>
                       </button>
                     )}
                   </div>
                   
                   {unlockedCrushes['teaser'] ? (
                     <div className="text-white font-medium italic text-lg leading-snug">
                       &quot;<ScrambleText text="Someone in your cs class thinks you have great vibes." />&quot;
                     </div>
                   ) : (
                     <div className="relative">
                       <p className="text-white font-medium italic text-lg leading-snug blur-md select-none opacity-50">&quot;xxxxxxx xx xxxx xx xxxxx xxxxxx xxx xxxx xxxxx xxxxx.&quot;</p>
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase text-white shadow-xl flex items-center gap-2">
                           <span>🔒</span> Locked Message
                         </div>
                       </div>
                     </div>
                   )}
                 </motion.div>

                 <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl mt-6">
                   <div className="text-4xl mb-4">🔗</div>
                   <h3 className="text-white font-bold mb-2">Want more Secret Crushes?</h3>
                   <p className="text-zinc-500 text-sm">Post your link on Instagram to get real ones!</p>
                 </div>
               </div>
             ) : (
               <div className="space-y-3">
                 {crushes.map((crush, idx) => {
                   const isUnlocked = unlockedCrushes[crush.id];
                   return (
                     <motion.div
                      key={crush.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="bg-zinc-900 border border-white/5 p-5 rounded-3xl relative overflow-hidden"
                     >
                       <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[50px] pointer-events-none" />
                       <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl shadow-inner">
                             {isUnlocked ? '👀' : '🤫'}
                           </div>
                           <div>
                             <h4 className="text-rose-400 font-bold text-sm tracking-widest uppercase">Secret Admirer</h4>
                             <span className="text-[10px] text-zinc-500">
                               {crush.timestamp ? new Date(crush.timestamp.toMillis()).toLocaleDateString() : 'Just now'}
                             </span>
                           </div>
                         </div>
                         {!isUnlocked && (
                           <button 
                             onClick={() => {
                               if (tokens >= 1) {
                                 const newTokens = tokens - 1;
                                 localStorage.setItem('revealTokens', newTokens.toString());
                                 window.dispatchEvent(new Event('tokensUpdated'));
                                 
                                 const newUnlocked = { ...unlockedCrushes, [crush.id]: true };
                                 localStorage.setItem('unlockedCrushes', JSON.stringify(newUnlocked));
                                 setUnlockedCrushes(newUnlocked);
                               } else {
                                 alert("Not enough Reveal Tokens! Go to the Feed and vote in Speed Bumps to earn them.");
                               }
                             }}
                             className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                           >
                             <span>Unlock</span>
                             <span className="opacity-75">(-1 🪙)</span>
                           </button>
                         )}
                       </div>
                       
                       {isUnlocked ? (
                         <div className="text-white font-medium italic text-lg leading-snug">
                           &quot;<ScrambleText text={crush.message} />&quot;
                         </div>
                       ) : (
                         <div className="relative">
                           <p className="text-white font-medium italic text-lg leading-snug blur-md select-none opacity-50">&quot;{crush.message.replace(/[a-zA-Z]/g, 'x')}&quot;</p>
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase text-white shadow-xl flex items-center gap-2">
                               <span>🔒</span> Locked Message
                             </div>
                           </div>
                         </div>
                       )}
                     </motion.div>
                   );
                 })}
               </div>
             )
          )}
        </div>
      </main>
    </div>
    </>
  );
}
