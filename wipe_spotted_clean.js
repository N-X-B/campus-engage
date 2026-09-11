const fs = require('fs');

const code = `"use client";

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { useEffect } from 'react';

export default function MissedConnectionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-indigo-500/30 pb-24">
      <Navigation />

      <main className="max-w-md mx-auto p-4 sm:p-6 mt-4">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Spotted</h1>
            <p className="text-zinc-400 mt-1">Missed connections on campus.</p>
          </div>
        </div>
        
        <div className="space-y-4">
           <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
             <div className="text-4xl mb-4">🚧</div>
             <h3 className="text-xl font-bold text-white mb-2">Undergoing Renovations</h3>
             <p className="text-zinc-500 text-sm px-4">The spotted section and posting have been temporarily disabled for a major upgrade.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync('src/app/missed-connections/page.tsx', code);
