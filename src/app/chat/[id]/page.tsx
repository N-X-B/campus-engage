"use client";

import { useState, useEffect, useRef } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot, addDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

export default function ChatRoom({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    // First check if the user is authorized for this specific chat
    const verifyAccess = async () => {
      try {
        const convSnap = await getDoc(doc(db, 'conversations', params.id));
        if (!convSnap.exists()) {
           setIsAuthorized(false);
           return;
        }
        
        const data = convSnap.data();
        if (!data.participants || !data.participants.includes(user.uid)) {
           setIsAuthorized(false); // Unauthorized!
           return;
        }

        setIsAuthorized(true);

        // Fetch other user profile
        const otherId = data.participants.find((id: string) => id !== user.uid);
        if (otherId) {
          const uSnap = await getDoc(doc(db, 'users', otherId));
          if (uSnap.exists()) {
             setOtherUser({ id: uSnap.id, ...uSnap.data() });
          }
        }
      } catch (err) {
        setIsAuthorized(false);
      }
    };

    verifyAccess();
  }, [user, params.id]);

  useEffect(() => {
    if (isAuthorized !== true || !user) return;
    
    // Listen to real messages strictly bound to this conversation ID
    const q = query(collection(db, `conversations/${params.id}/messages`), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
       const msgs: any[] = [];
       snapshot.forEach(d => msgs.push({ id: d.id, ...d.data() }));
       setMessages(msgs);
       setTimeout(() => {
         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
       }, 100);
    });

    return () => unsubscribe();
  }, [isAuthorized, params.id, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!newMessage.trim() || !user || isAuthorized !== true) return;

    const text = newMessage.trim();
    const lowerText = text.toLowerCase();
    
    // Strict regex rules to prevent off-platform sharing
    const blockRules = [
      // Phone numbers (e.g. 123-456-7890, 1234567890, 123 456 7890)
      /(?:\d[\s\-\.]*){10}/,
      // Emails
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      // Instagram / Snapchat keywords
      /insta|instagram|ig\s+@|ig\s*:|snapchat|snap\s+me|snap\s+@|sc\s*:|add\s+my\s+snap/i,
      // Naked handles (anything starting with @)
      /@[\w\.\_]+/
    ];

    for (const rule of blockRules) {
      if (rule.test(lowerText)) {
        setErrorMsg("⚠️ For your safety, sharing Instagram, Snapchat, Phone Numbers, or Emails is not allowed.");
        return;
      }
    }

    // Secondary heuristic: Words that sound like phone numbers spelled out
    const numberWords = ["zero","one","two","three","four","five","six","seven","eight","nine"];
    let numCount = 0;
    numberWords.forEach(w => {
       const regex = new RegExp("\\b" + w + "\\b", "g");
       const matches = lowerText.match(regex);
       if (matches) numCount += matches.length;
    });
    if (numCount >= 7) {
       setErrorMsg("⚠️ For your safety, sharing phone numbers is not allowed.");
       return;
    }
    setNewMessage(''); // optimistic clear

    try {
      await addDoc(collection(db, `conversations/${params.id}/messages`), {
        text,
        senderId: user.uid,
        senderName: user.displayName || 'You',
        timestamp: Date.now() // Use Date.now for simpler sorting
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (loading || isAuthorized === null) return <LoadingScreen />;

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
         <div className="text-6xl mb-6">🔒</div>
         <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
         <p className="text-zinc-500 mb-8 text-center max-w-sm">This is a strictly secure 1-on-1 private chat. You are not a participant.</p>
         <Link href="/inbox" className="bg-white text-black px-8 py-3 rounded-full font-bold">Return to Inbox</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-black selection:bg-white/20 text-white relative">
      
      {/* Header */}
      <div className="px-4 py-4 sm:py-6 flex justify-between items-center bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 shrink-0">
         <div className="flex items-center gap-4">
           <Link href="/inbox" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors border border-white/10">
             ←
           </Link>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                {otherUser?.photos?.[0] ? <img src={otherUser.photos[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">👤</div>}
             </div>
             <div>
               <h2 className="font-bold text-lg leading-tight">{otherUser?.name || 'Loading...'}</h2>
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{otherUser?.major || 'Student'}</p>
             </div>
           </div>
         </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth custom-scrollbar relative">
         {/* Background subtle glow */}
         <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[400px] max-h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="max-w-2xl mx-auto flex flex-col gap-3 relative z-10">
           {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-zinc-500 font-medium">It's quiet here. Break the ice!</p>
              </div>
           ) : (
             messages.map((msg, idx) => {
               const isMe = msg.senderId === user?.uid;
               return (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.2 }}
                   key={msg.id || idx} 
                   className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                 >
                   <div 
                     className={`max-w-[80%] px-5 py-3 rounded-2xl ${isMe 
                       ? 'bg-indigo-500 text-white rounded-br-sm shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                       : 'bg-zinc-900 border border-white/5 text-zinc-200 rounded-bl-sm'}`}
                   >
                     <p className="leading-relaxed break-words">{msg.text}</p>
                   </div>
                 </motion.div>
               );
             })
           )}
           <div ref={messagesEndRef} />
         </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/5 shrink-0 safe-area-pb">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto relative flex items-end">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message..."
            className="w-full bg-zinc-900 border border-white/10 rounded-3xl py-4 pl-6 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-[120px] overflow-y-auto"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="absolute right-2 bottom-2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
