"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Navigation } from '@/components/Navigation';

export default function AdminEmailsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [incompleteUsers, setIncompleteUsers] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return; // Wait for login
    
    const fetchEmails = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const active: string[] = [];
        const incomplete: string[] = [];

        snap.forEach(docSnap => {
          const data = docSnap.data();
          if (data.email) {
            // Check if they are fully onboarded (have photos + onboarded flag)
            const hasPhoto = data.photos && Array.isArray(data.photos) && data.photos.length > 0;
            if (data.onboarded && hasPhoto) {
              active.push(data.email);
            } else {
              incomplete.push(data.email);
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

  const copyToClipboard = (emails: string[]) => {
    navigator.clipboard.writeText(emails.join(', '));
    alert("Copied to clipboard! You can paste this directly into Gmail's BCC field.");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-10">
        <h1 className="text-3xl font-black mb-2 text-rose-500">Admin Email Exporter</h1>
        <p className="text-zinc-400 mb-8">
          This is a secret page to extract your user emails for marketing campaigns.
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
          <div className="text-zinc-500 font-bold animate-pulse">Scanning database for emails...</div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Active Users */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
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
                value={activeUsers.join(', ')} 
                className="w-full h-32 bg-black border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 mb-4 focus:outline-none"
              />
              
              <button 
                onClick={() => copyToClipboard(activeUsers)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Copy for "Updates" Email
              </button>
            </div>

            {/* Incomplete Profiles */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
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
                value={incompleteUsers.join(', ')} 
                className="w-full h-32 bg-black border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 mb-4 focus:outline-none"
              />
              
              <button 
                onClick={() => copyToClipboard(incompleteUsers)}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Copy for "Complete Profile" Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
