const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// I will manually reconstruct the whole fetchProfiles function to be absolutely sure it's perfect.
const functionMatch = /const fetchProfiles = async \(\) => \{[\s\S]*?\};\n    fetchProfiles\(\);/;

const optimizedFunction = `const fetchProfiles = async () => {
      if (!user) return;
      try {
        let fetchedProfiles: any[] = [];
        let currentUserData = null;
        
        if (isDemoMode) {
          fetchedProfiles = await demoDb.getProfiles();
        } else {
          // Parallelize network requests!
          const userDocPromise = getDoc(doc(db, 'users', user.uid));
          const querySnapshotPromise = getDocs(query(collection(db, 'users'), where('onboarded', '==', true)));
          // Server action API call can also run in parallel
          const aiMatchesPromise = getTopMatches(user.uid, 50).catch(e => {
             console.error("AI Matchmaking skipped/failed:", e);
             return { success: false, matches: [] };
          });
          
          const [userDoc, querySnapshot, aiMatches] = await Promise.all([
             userDocPromise, 
             querySnapshotPromise,
             aiMatchesPromise
          ]);
          
          if (userDoc.exists()) {
             currentUserData = userDoc.data();
             setUserData(currentUserData);
          }
          
          querySnapshot.forEach(doc => {
             const d = doc.data();
             if (d.onboarded && doc.id !== user.uid) {
               fetchedProfiles.push({ id: doc.id, ...d });
             }
          });
          
          let scoredProfiles = [];
          
          if (aiMatches && aiMatches.success && aiMatches.matches.length > 0) {
              const aiScoreMap = new Map();
              aiMatches.matches.forEach((m: any) => aiScoreMap.set(m.id, m.score));
              
              scoredProfiles = fetchedProfiles
                .filter(p => aiScoreMap.has(p.id))
                .map(p => ({
                  ...p,
                  matchScore: Math.round(aiScoreMap.get(p.id) * 100)
                }))
                .sort((a, b) => b.matchScore - a.matchScore);
          }
          
          if (scoredProfiles.length === 0) {
              scoredProfiles = fetchedProfiles
                .map(p => ({
                  ...p,
                  matchScore: calculateMatchScore(currentUserData, p)
                }))
                .sort((a, b) => b.matchScore - a.matchScore);
          }
          
          // Seed logic
          const today = new Date().toISOString().split('T')[0];
          const seedStr = user.uid + today;
          let seed = 0;
          for (let i = 0; i < seedStr.length; i++) {
            seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
            seed = seed & seed;
          }
          const dailyLimit = 15 + (Math.abs(seed) % 11);
          const limitedProfiles = scoredProfiles.slice(0, dailyLimit);
          
          setAllFetchedProfiles(limitedProfiles);
          setProfiles(limitedProfiles);
        }
        
      } catch (err) {
        console.error("Error fetching profiles:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfiles();`;

code = code.replace(functionMatch, optimizedFunction);

fs.writeFileSync('src/app/feed/page.tsx', code);
