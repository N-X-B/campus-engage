const fs = require('fs');
let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

const imports = `import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';`;

code = code.replace("import Link from 'next/link';\nimport { useAuth } from '@/lib/AuthContext';\nimport { usePathname } from 'next/navigation';", imports);

const hookLogic = `  const { user } = useAuth();
  const pathname = usePathname();
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Listen for new pending invitations
    const q = query(
      collection(db, 'conversations'),
      where('receiverId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // If there's at least one pending invitation, show the red dot
      setHasNotification(!snapshot.empty);
    }, (error) => {
      console.warn("Notification listener error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;`;

code = code.replace(`  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;`, hookLogic);

const navItemDesktopOld = `{item.name}
            </Link>`;

const navItemDesktopNew = `{item.name}
              {item.name === 'Inbox' && hasNotification && (
                 <span className="absolute -top-1 -right-3 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
              )}
            </Link>`;

code = code.replace(navItemDesktopOld, navItemDesktopNew);

// Desktop Link needs relative class
code = code.replace("className={`text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 ${", "className={`relative text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:-translate-y-1 ${");

const navItemMobileOld = `{/* Visual Dot indicator for active tab */}
            <div className={\`w-1 h-1 rounded-full \${pathname === item.path ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,1)]' : 'bg-transparent'}\`} />
            {item.name}
          </Link>`;

const navItemMobileNew = `{/* Visual Dot indicator for active tab */}
            <div className={\`w-1 h-1 rounded-full \${pathname === item.path ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,1)]' : 'bg-transparent'}\`} />
            <div className="relative">
              {item.name}
              {item.name === 'Inbox' && hasNotification && (
                 <span className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />
              )}
            </div>
          </Link>`;

code = code.replace(navItemMobileOld, navItemMobileNew);

fs.writeFileSync('src/components/Navigation.tsx', code);
