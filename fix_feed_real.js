const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const originalFetch = `
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      try {
        let fetchedProfiles: any[] = [];
        
        if (isDemoMode) {
          fetchedProfiles = await demoDb.getProfiles();
        } else {
          const q = collection(db, "users");
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            fetchedProfiles.push({ id: doc.id, ...doc.data() });
          });
        }
`;

const newFetch = `
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      try {
        let fetchedProfiles: any[] = [];
        
        if (isDemoMode) {
          fetchedProfiles = await demoDb.getProfiles();
        } else {
          try {
            const q = collection(db, "users");
            const querySnapshot = (await Promise.race([
              getDocs(q),
              timeoutPromise(800, "Firestore connection timed out")
            ])) as any;
            querySnapshot.forEach((doc: any) => {
              fetchedProfiles.push({ id: doc.id, ...doc.data() });
            });
          } catch (err) {
            console.warn("[FEED] Failed to load from Firestore. Falling back to Demo Mode.", err);
            fetchedProfiles = await demoDb.getProfiles();
          }
        }
`;

code = code.replace(originalFetch.trim(), newFetch.trim());
fs.writeFileSync('src/app/feed/page.tsx', code);
