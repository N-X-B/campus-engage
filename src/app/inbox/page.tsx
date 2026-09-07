"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import { Navigation } from '@/components/Navigation';

export default function InboxPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    if (isDemoMode) {
      setConversations(demoDb.getConversations());
      return;
    }

    // In a real app, this would be an onSnapshot listener on the 'conversations' collection
    // where participants array contains user.uid
    // For MVP, we will show demo conversations if no real data is set up yet
    setConversations([]);
  }, [user]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="max-w-3xl mx-auto p-6 mt-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inbox</h1>
            <p className="text-slate-500 mt-1">Your matches and conversations.</p>
          </div>
          {isDemoMode && <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">DEMO MODE</span>}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No conversations yet. Go to the feed and send an icebreaker!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {conversations.map((conv) => (
                <Link key={conv.id} href={`/chat/${conv.id}`} className="block hover:bg-slate-50 transition-colors">
                  <div className="flex items-center p-4 sm:p-5 gap-4">
                    <div className="relative">
                      <img src={conv.otherUserPhoto} alt={conv.otherUserName} className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                      {conv.unread && (
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`text-base truncate ${conv.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {conv.otherUserName}
                        </h3>
                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conv.unread ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                        {conv.lastMessageText}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
