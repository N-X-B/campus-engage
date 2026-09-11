const fs = require('fs');

// 1. Fix Navigation
let navCode = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const oldNavArray = `  let navItems = [
    { name: 'Discover', path: '/feed' },
    { name: 'Confessions', path: '/missed-connections' },
    { name: 'Inbox', path: '/inbox' },
    { name: 'Profile', path: '/profile' },
  ];`;

const newNavArray = `  let navItems = [
    { name: 'Discover', path: '/feed' },
    { name: 'Spotted', path: '/missed-connections' },
    { name: 'Inbox', path: '/inbox' },
    { name: 'Profile', path: '/profile' },
  ];`;

navCode = navCode.replace(oldNavArray, newNavArray);

fs.writeFileSync('src/components/Navigation.tsx', navCode);

// 2. Fix Missed Connections page
let pageCode = fs.readFileSync('src/app/missed-connections/page.tsx', 'utf8');

const importReplacement = `import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';`;

pageCode = pageCode.replace(/import \{ useAuth \}.*from 'react';/s, importReplacement);

const hookReplacement = `  const { user, loading } = useAuth();
  const router = useRouter();
  const [isIncognito, setIsIncognito] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then(d => {
        if (d.exists()) {
          setIsIncognito(d.data().incognito === true);
        }
      });
    }
  }, [user, loading, router]);`;

pageCode = pageCode.replace(/  const \{ user, loading \} = useAuth\(\);\n  const router = useRouter\(\);\n\n  useEffect\(\(\) => \{\n    if \(\!loading && \!user\) router\.push\('\/login'\);\n  \}, \[user, loading, router\]\);/s, hookReplacement);

const uiTarget = `            <h1 className="text-3xl font-extrabold text-white tracking-tight">Confessions</h1>
            <p className="text-zinc-400 mt-1">Missed connections on campus.</p>
          </div>
        </div>
        
        <div className="space-y-4">
           <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
             <div className="text-4xl mb-4">🚧</div>
             <h3 className="text-xl font-bold text-white mb-2">Undergoing Renovations</h3>
             <p className="text-zinc-500 text-sm px-4">The confessions section and posting have been temporarily disabled for a major upgrade.</p>`;

const uiReplacement = `            <h1 className="text-3xl font-extrabold text-white tracking-tight">{isIncognito ? 'Confessions' : 'Spotted'}</h1>
            <p className="text-zinc-400 mt-1">{isIncognito ? 'Anonymous campus confessions.' : 'Missed connections on campus.'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
           <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
             <div className="text-4xl mb-4">🚧</div>
             <h3 className="text-xl font-bold text-white mb-2">Undergoing Renovations</h3>
             <p className="text-zinc-500 text-sm px-4">The {isIncognito ? 'confessions' : 'spotted'} section and posting have been temporarily disabled for a major upgrade.</p>`;

pageCode = pageCode.replace(uiTarget, uiReplacement);

fs.writeFileSync('src/app/missed-connections/page.tsx', pageCode);

