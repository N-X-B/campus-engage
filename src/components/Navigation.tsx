import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { haptic } from '@/lib/haptics';

export function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [hasNotification, setHasNotification] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Listen for new pending invitations
    const q = query(
      collection(db, 'conversations'),
      where('receiverId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribeConvs = onSnapshot(q, (snapshot) => {
      setHasNotification(!snapshot.empty);
    }, (error) => {
      console.warn("Notification listener error:", error);
    });

    // Listen for incognito status
    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const incognito = docSnap.data().incognito === true;
        setIsIncognito(incognito);
        
        // Route Guard: If incognito and trying to access blocked pages, kick them to spotted
        if (incognito && (pathname === '/feed' || pathname === '/inbox')) {
           router.replace('/missed-connections');
        }
      }
    });

    return () => {
      unsubscribeConvs();
      unsubscribeUser();
    };
  }, [user, pathname, router]);

  if (!user) return null;

  let navItems = [
    { name: 'Discover', path: '/feed' },
    { name: 'Spotted', path: '/missed-connections' },
    { name: 'Inbox', path: '/inbox' },
    { name: 'Profile', path: '/profile' },
  ];

  if (isIncognito) {
    navItems = [
      { name: 'Confessions', path: '/missed-connections' },
      { name: 'Profile', path: '/profile' },
    ];
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="w-full px-6 py-5 bg-black/50 backdrop-blur-xl border-b border-white/5 flex justify-between items-center sticky top-0 z-50">
        <Link href="/feed" className="text-xl font-bold tracking-tight text-white hover:scale-105 transition-transform">
          CampusEngage.
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => haptic.light()}
              className={`relative text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 ${
                pathname === item.path 
                  ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]' 
                  : 'text-zinc-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
              }`}
            >
              {item.name}
              {item.name === 'Inbox' && hasNotification && (
                 <span className="absolute -top-1 -right-3 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
              )}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/5 flex justify-around p-5 z-50 pb-safe">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex flex-col items-center gap-1 hover:-translate-y-1 hover:text-white ${
              pathname === item.path 
                ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                : 'text-zinc-600'
            }`}
          >
            {/* Visual Dot indicator for active tab */}
            <div className={`w-1 h-1 rounded-full ${pathname === item.path ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,1)]' : 'bg-transparent'}`} />
            <div className="relative">
              {item.name}
              {item.name === 'Inbox' && hasNotification && (
                 <span className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
