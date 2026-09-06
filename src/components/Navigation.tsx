import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    { name: 'Discover', path: '/feed' },
    { name: 'Inbox', path: '/inbox' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <header className="w-full px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-50">
      <Link href="/feed" className="text-xl font-bold tracking-tight text-slate-900">
        CampusEngage.
      </Link>
      
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`text-sm font-medium transition-colors ${pathname === item.path ? 'text-slate-900 border-b-2 border-slate-900 pb-1' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Tab Bar (Fixed at bottom for small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-4 z-50 pb-safe">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`text-sm font-medium ${pathname === item.path ? 'text-slate-900' : 'text-slate-400'}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
