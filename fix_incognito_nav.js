const fs = require('fs');

let code = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

// Add useRouter and doc
if (!code.includes("useRouter")) {
  code = code.replace("import { usePathname } from 'next/navigation';", "import { usePathname, useRouter } from 'next/navigation';");
}
if (!code.includes("doc,")) {
  code = code.replace("collection, query, where, onSnapshot", "collection, query, where, onSnapshot, doc");
}

// Update hook logic
const oldHook = `  const { user } = useAuth();
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

  if (!user) return null;

  const navItems = [
    { name: 'Discover', path: '/feed' },
    { name: 'Spotted', path: '/missed-connections' },
    { name: 'Inbox', path: '/inbox' },
    { name: 'Profile', path: '/profile' },
  ];`;


const newHook = `  const { user } = useAuth();
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
      { name: 'Spotted', path: '/missed-connections' },
      { name: 'Profile', path: '/profile' },
    ];
  }`;

code = code.replace(oldHook, newHook);

fs.writeFileSync('src/components/Navigation.tsx', code);
