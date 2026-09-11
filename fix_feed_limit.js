const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// We need to grab userData in feed to check referrals/icebreaker count!
if (!code.includes('const [userData, setUserData] = useState<any>(null);')) {
  const feedStateStart = `  const [fetching, setFetching] = useState(true);`;
  const newFeedState = `  const [fetching, setFetching] = useState(true);
  const [userData, setUserData] = useState<any>(null);`;
  code = code.replace(feedStateStart, newFeedState);
}

// Fetch userData inside useEffect
if (!code.includes('setUserData(d.data())')) {
  const fetchProfilesStart = `    const fetchProfiles = async () => {\n      if (!user) return;\n      try {`;
  const fetchProfilesWithUserData = `    const fetchProfiles = async () => {
      if (!user) return;
      try {
        if (!isDemoMode) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) setUserData(userDoc.data());
        }`;
  code = code.replace(fetchProfilesStart, fetchProfilesWithUserData);
}

// Ensure getDoc is imported
if (!code.includes('getDoc')) {
  code = code.replace(/import \{ doc, updateDoc \} from 'firebase\/firestore';/, "import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';");
}


// Replace openIcebreaker to enforce limit
const openIcebreakerOld = `  const openIcebreaker = (p: any) => {
    setSelectedUser(p);
    
    // Generate 3 random, slightly edgy college icebreakers
    const shuffled = [...icebreakerPool].sort(() => 0.5 - Math.random());
    setPromptOptions(shuffled.slice(0, 3));
    
    setIcebreakerModal(true);
  };`;

const openIcebreakerNew = `  const openIcebreaker = async (p: any) => {
    // 1. Enforce Referral/Daily Limit Logic
    if (userData && !isDemoMode) {
      const referralCount = userData.referredUsers?.length || userData.referralCount || 0;
      const hasUnlimited = referralCount >= 5;
      
      const today = new Date().toISOString().split('T')[0];
      const lastDate = userData.lastIcebreakerDate || "";
      const sentToday = lastDate === today ? (userData.icebreakersSentToday || 0) : 0;
      
      if (!hasUnlimited && sentToday >= 3) {
        alert(\`🧊 You're out of Icebreakers for today!\\n\\nYou have referred \${referralCount} out of 5 friends.\\nInvite \${5 - referralCount} more friends from your campus to unlock unlimited daily messages forever.\\n\\nHead to your Profile to copy your invite link.\`);
        return; // BLOCK!
      }
      
      // Update usage count in DB (fire and forget)
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastIcebreakerDate: today,
          icebreakersSentToday: sentToday + 1
        });
        // Optimistic update locally
        setUserData({ ...userData, lastIcebreakerDate: today, icebreakersSentToday: sentToday + 1 });
      } catch (err) {
        console.error("Failed to update icebreaker usage", err);
      }
    }

    setSelectedUser(p);
    // Generate 3 random, slightly edgy college icebreakers
    const shuffled = [...icebreakerPool].sort(() => 0.5 - Math.random());
    setPromptOptions(shuffled.slice(0, 3));
    setIcebreakerModal(true);
  };`;

code = code.replace(openIcebreakerOld, openIcebreakerNew);

fs.writeFileSync('src/app/feed/page.tsx', code);
