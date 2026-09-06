"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import Link from 'next/link';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    
    if (isDemoMode) {
      // Setup demo polling
      setMessages(demoDb.getMessages());
      const interval = setInterval(() => {
        setMessages(demoDb.getMessages());
      }, 1000);
      return () => clearInterval(interval);
    }

    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      const userMsgs = msgs.filter(m => m.senderId === user.uid || m.receiverId === user.uid || m.receiverId === "GLOBAL");
      setMessages(userMsgs);
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      if (isDemoMode) {
        demoDb.sendMessage(newMessage, user.uid, user.displayName || 'Unknown');
        setNewMessage('');
        return;
      }

      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || 'Unknown',
        receiverId: "GLOBAL", 
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="w-full px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
        <Link href="/feed" className="text-xl font-semibold tracking-tight text-slate-900 hover:text-slate-600 transition">
          &larr; Back to Feed
        </Link>
        <div className="flex items-center gap-4">
           {isDemoMode && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold">DEMO MODE</span>}
           <div className="text-sm font-medium text-slate-500">Your Messages</div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No messages yet. Send an icebreaker from the feed!</div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex flex-col max-w-[80%] ${msg.senderId === user?.uid ? 'self-end items-end' : 'self-start items-start'}`}>
              <span className="text-xs text-slate-500 mb-1 px-1">{msg.senderName}</span>
              <div className={`px-4 py-3 rounded-2xl ${msg.senderId === user?.uid ? 'bg-slate-900 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-slate-50"
          />
          <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition-colors">
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
