"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "users"), where("uid", "!=", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedProfiles: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProfiles.push({ id: doc.id, ...doc.data() });
        });
        setProfiles(fetchedProfiles);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfiles();
  }, [user]);

  if (loading || fetching) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="w-full px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
        <Link href="/" className="text-xl font-semibold tracking-tight">CampusEngage.</Link>
        <div className="text-sm font-medium text-slate-500">Welcome, {user?.displayName || "User"}</div>
      </header>
      
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Discover</h1>
        
        {profiles.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No profiles found yet. Invite some friends!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="aspect-[3/4] bg-slate-200 relative flex items-center justify-center">
                  {p.photos && p.photos.length > 0 ? (
                    <img src={p.photos[0]} alt={p.name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-slate-400">No Photo</span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-slate-900">{p.name}</h2>
                  <p className="text-sm text-slate-500">{p.branch || 'Unknown Major'} • Year {p.year || 'Unknown'}</p>
                  <p className="text-sm mt-2 text-slate-700 line-clamp-2">{p.bio}</p>
                  <Link href="/chat"><button className="w-full mt-4 bg-slate-900 text-white rounded-md py-2 font-medium hover:bg-slate-800 transition">
                    Send Icebreaker
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
