import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    { name: 'Discover', path: '/feed' },
    { name: 'Spotted', path: '/missed-connections' },
    { name: 'Inbox', path: '/inbox' },
    { name: 'Profile', path: '/profile' },
  ];

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
              className={`text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 ${
                pathname === item.path 
                  ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]' 
                  : 'text-zinc-500 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
              }`}
            >
              {item.name}
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
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
}
