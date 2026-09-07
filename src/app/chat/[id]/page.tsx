"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ChatRoom({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    if (isDemoMode) {
      setMessages(demoDb.getMessages(params.id));
      const interval = setInterval(() => {
        setMessages(demoDb.getMessages(params.id));
      }, 1000);
      return () => clearInterval(interval);
    }
    
    // Production: Listen to real messages
    const q = query(collection(db, `conversations/${params.id}/messages`), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
       const msgs: any[] = [];
       snapshot.forEach(d => msgs.push({ id: d.id, ...d.data() }));
       setMessages(msgs);
    });
    return () => unsubscribe();
  }, [user, params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    if (isDemoMode) {
      demoDb.sendMessage(params.id, newMessage.trim(), user.uid, user.displayName || 'Me');
      setNewMessage('');
      setMessages(demoDb.getMessages(params.id));
      return;
    }
    
    // Production: Send real message
    const msgText = newMessage.trim();
    setNewMessage(''); // optimistic clear
    
    try {
      const msgRef = collection(db, `conversations/${params.id}/messages`);
      await addDoc(msgRef, {
         text: msgText,
         senderId: user.uid,
         senderName: user.displayName || 'Anonymous',
         timestamp: Date.now()
      });

      await updateDoc(doc(db, 'conversations', params.id), {
         lastMessage: msgText,
         lastUpdated: Date.now()
      });
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;

  return (
    <div className="flex flex-col h-[100dvh] bg-black font-sans selection:bg-white/20">
      <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 p-4 sticky top-0 z-10 flex items-center">
        <Link href="/inbox" className="mr-4 text-zinc-400 hover:text-white transition w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-full border border-white/5">
          ←
        </Link>
        <div className="flex items-center">
           <div className="w-10 h-10 bg-zinc-800 rounded-full mr-3 border border-white/10 overflow-hidden flex-shrink-0">
             <div className="w-full h-full flex items-center justify-center grayscale text-xl">👤</div>
           </div>
           <div>
             <h2 className="text-lg font-bold text-white leading-tight">Match Chat</h2>
             <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Online</span>
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full opacity-40">
             <span className="text-5xl mb-4 grayscale hover:grayscale-0 transition duration-500">🧊</span>
             <p className="text-zinc-500 font-medium">Icebreaker sent. Awaiting response.</p>
           </div>
        )}
        
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user?.uid;
          const showAvatar = !isMe && (idx === 0 || messages[idx - 1].senderId !== msg.senderId);
          
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end group`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-zinc-800 mr-2 flex-shrink-0 border border-white/5 overflow-hidden">
                  {showAvatar ? <div className="w-full h-full flex items-center justify-center text-xs grayscale">👤</div> : null}
                </div>
              )}
              
              <div className={`max-w-[75%] px-5 py-3.5 rounded-[1.5rem] ${
                isMe 
                  ? 'bg-white text-black rounded-br-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                  : 'bg-zinc-900 border border-white/5 text-white rounded-bl-sm shadow-xl'
              }`}>
                <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                <div className={`text-[9px] mt-1.5 font-bold tracking-widest uppercase opacity-50`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5">
        <form onSubmit={sendMessage} className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full px-6 py-4 bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-white text-black px-8 py-4 rounded-full font-bold disabled:opacity-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
