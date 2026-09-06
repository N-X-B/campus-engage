"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { isDemoMode, demoDb } from '@/lib/demo-backend';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

const ICEBREAKERS = [
  "What's the most overrated dining hall on campus?",
  "If you had to study in one library forever, which one?",
  "What is your most controversial campus opinion?",
  "Best spot for a late-night food run?",
  "What's the hardest class you've taken so far?"
];

export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [icebreakerText, setIcebreakerText] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      try {
        if (isDemoMode) {
          setProfiles(await demoDb.getProfiles());
          setFetching(false);
          return;
        }

        const q = query(collection(db, "users"), where("uid", "!=", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedProfiles: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProfiles.push({ id: doc.id, ...doc.data() });
        });
        setProfiles(fetchedProfiles.filter(p => p.onboarded));
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfiles();
  }, [user]);

  const generateIcebreaker = () => {
    const random = ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)];
    alert("Generated Prompt: " + random + "\n\n(In the real app, this will paste into their chat box!)");
  };

  const reportUser = (name: string) => {
    alert(`Thank you. ${name} has been reported to moderation.`);
  };

  if (loading || fetching) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <Navigation />
      
      <main className="max-w-5xl mx-auto p-6 mt-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Discover</h1>
            <p className="text-slate-500 mt-1">Find your next connection.</p>
          </div>
          {isDemoMode && <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">DEMO MODE</span>}
        </div>
        
        {profiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">No profiles found yet.</h3>
            <p className="text-slate-500 mt-2">Invite some friends to join the campus network!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-1">
                <div className="aspect-[4/5] bg-slate-200 relative flex items-center justify-center">
                  {p.photos && p.photos.length > 0 ? (
                    <img src={p.photos[0]} alt={p.name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-slate-400">No Photo</span>
                  )}
                  {/* Action Badges */}
                  <div className="absolute top-4 right-4">
                    <button onClick={() => reportUser(p.name)} className="bg-black/40 hover:bg-red-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md transition-colors" title="Report Profile">
                      Report
                    </button>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{p.name}</h2>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap">
                      Year {p.year}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-3">{p.branch || 'Unknown Major'}</p>
                  
                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    "{p.bio}"
                  </p>
                  
                  <div className="mt-auto space-y-2">
                    <button onClick={generateIcebreaker} className="w-full bg-slate-100 text-slate-700 rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-200 transition">
                      🎲 Generate Icebreaker
                    </button>
                    <Link href="/chat" className="block">
                      <button className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-800 transition shadow-sm">
                        Send Message
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
