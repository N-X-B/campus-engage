"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import Link from 'next/link';

export default function PrivateChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !conversationId) return;
    
    if (isDemoMode) {
      setMessages(demoDb.getMessages(conversationId));
      const interval = setInterval(() => {
        setMessages(demoDb.getMessages(conversationId));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [user, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversationId) return;

    try {
      if (isDemoMode) {
        demoDb.sendMessage(conversationId, newMessage, user.uid, user.displayName || 'Unknown');
        setNewMessage('');
        return;
      }
      // Firebase real-time send logic goes here for production
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="w-full px-6 py-4 bg-white border-b border-slate-100 flex items-center shrink-0 sticky top-0 z-10">
        <Link href="/inbox" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="ml-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border border-slate-200">
             {/* For demo, using a static image based on ID. In prod, fetch user data */}
             <img src={conversationId === 'conv-2' ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80"} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{conversationId === 'conv-2' ? 'Mike Chen' : 'Sarah Jenkins'}</h2>
            <p className="text-xs text-slate-500">Active now</p>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">Say hi to start the conversation!</div>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex flex-col max-w-[80%] ${msg.senderId === user?.uid ? 'self-end items-end' : 'self-start items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.senderId === user?.uid ? 'bg-slate-900 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white border-t border-slate-100 shrink-0 pb-safe">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-slate-50 transition-colors"
          />
          <button type="submit" disabled={!newMessage.trim()} className="bg-slate-900 text-white p-3 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
