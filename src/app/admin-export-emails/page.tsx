"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Navigation } from '@/components/Navigation';

type UserExport = {
  name: string;
  email: string;
  gender: string;
  photoCount: number;
};

export default function AdminEmailsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<UserExport[]>([]);
  const [incompleteUsers, setIncompleteUsers] = useState<UserExport[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return; // Wait for login
    
    const fetchEmails = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const active: UserExport[] = [];
        const incomplete: UserExport[] = [];

        snap.forEach(docSnap => {
          const data = docSnap.data();
          if (data.email) {
            const hasPhoto = data.photos && Array.isArray(data.photos) && data.photos.length > 0;
            const u: UserExport = {
               name: data.displayName || data.name || "Unknown",
               email: data.email,
               gender: data.gender || "Unknown",
               photoCount: data.photos?.length || 0
            };
            
            if (data.onboarded && hasPhoto) {
              active.push(u);
            } else {
              incomplete.push(u);
            }
          }
        });

        setActiveUsers(active);
        setIncompleteUsers(incomplete);
      } catch (err: any) {
        console.error(err);
        setError("Could not fetch users. Make sure you are logged in and Firestore rules allow reading users.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [user]);

  const copyToClipboard = (users: UserExport[]) => {
    navigator.clipboard.writeText(users.map(u => u.email).join(', '));
    alert("Copied to clipboard! You can paste this directly into Gmail's BCC field.");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-10">
        <h1 className="text-3xl font-black mb-2 text-rose-500">Admin Dashboard</h1>
        <p className="text-zinc-400 mb-8">
          View all registered users and extract their emails for marketing campaigns.
        </p>

        {!user && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 font-bold">
            Please log into the app first so Firebase allows you to read the database.
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 mb-6">
            {error}
          </div>
        )}

        {loading && user && (
          <div className="text-zinc-500 font-bold animate-pulse">Scanning database for users...</div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Active Users */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col h-full max-h-[800px]">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-emerald-400">Active Profiles</h2>
                  <p className="text-xs text-zinc-500">Completed onboarding</p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 font-black px-3 py-1 rounded-full">
                  {activeUsers.length}
                </span>
              </div>
              
              <textarea 
                readOnly 
                value={activeUsers.map(u => u.email).join(', ')} 
                className="w-full h-24 bg-black border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 mb-4 focus:outline-none shrink-0"
              />
              
              <button 
                onClick={() => copyToClipboard(activeUsers)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors mb-6 shrink-0"
              >
                Copy for "Updates" Email
              </button>

              <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                 {activeUsers.map((u, i) => (
                    <div key={i} className="bg-black border border-white/5 p-3 rounded-lg flex justify-between items-center">
                       <div>
                          <p className="text-sm font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-zinc-500">{u.email}</p>
                       </div>
                       <div className="text-right">
                          <span className="text-xs text-emerald-400 capitalize bg-emerald-400/10 px-2 py-1 rounded-md">{u.gender}</span>
                          <p className="text-[10px] text-zinc-600 mt-1">{u.photoCount} photos</p>
                       </div>
                    </div>
                 ))}
              </div>
            </div>

            {/* Incomplete Profiles */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col h-full max-h-[800px]">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-amber-400">Abandoned Signups</h2>
                  <p className="text-xs text-zinc-500">Incomplete or missing photos</p>
                </div>
                <span className="bg-amber-500/10 text-amber-400 font-black px-3 py-1 rounded-full">
                  {incompleteUsers.length}
                </span>
              </div>
              
              <textarea 
                readOnly 
                value={incompleteUsers.map(u => u.email).join(', ')} 
                className="w-full h-24 bg-black border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 mb-4 focus:outline-none shrink-0"
              />
              
              <button 
                onClick={() => copyToClipboard(incompleteUsers)}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors mb-6 shrink-0"
              >
                Copy for "Complete Profile" Email
              </button>

              <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                 {incompleteUsers.map((u, i) => (
                    <div key={i} className="bg-black border border-white/5 p-3 rounded-lg flex justify-between items-center">
                       <div>
                          <p className="text-sm font-bold text-white">{u.name}</p>
                          <p className="text-[10px] text-zinc-500">{u.email}</p>
                       </div>
                       <div className="text-right">
                          <span className="text-xs text-amber-400 capitalize bg-amber-400/10 px-2 py-1 rounded-md">{u.gender}</span>
                          <p className="text-[10px] text-zinc-600 mt-1">{u.photoCount} photos</p>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
