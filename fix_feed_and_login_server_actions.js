const fs = require('fs');

// 1. Update feed/page.tsx
let feedCode = fs.readFileSync('src/app/feed/page.tsx', 'utf8');
feedCode = feedCode.replace("import { getTopMatches } from '@/app/actions/matchmaking';", "import { getTopMatches } from '@/app/actions/matchmaking';\nimport { getProfilesOnServer } from '@/app/actions/profile';");

const feedReplacement = `
          try {
            console.log("[FEED] Fetching profiles via Server Action (bypassing firewall)...");
            const result = await getProfilesOnServer();
            if (result.success && result.profiles) {
               fetchedProfiles = result.profiles;
               
               if (fetchedProfiles.length <= 1) {
                 console.warn("[FEED] Database is empty. Injecting Demo users.");
                 fetchedProfiles = await demoDb.getProfiles();
               }
            } else {
               throw new Error(result.error || "Server Action Failed");
            }
          } catch (err) {
            console.warn("[FEED] Server Action failed. Falling back to Demo Mode.", err);
            fetchedProfiles = await demoDb.getProfiles();
          }
`;

feedCode = feedCode.replace(/try \{\n\s*const q = collection\(db, "users"\);[\s\S]*?fetchedProfiles = await demoDb\.getProfiles\(\);\n\s*\}\n\s*\}/, feedReplacement.trim() + "\n        }");

fs.writeFileSync('src/app/feed/page.tsx', feedCode);

// 2. Update login/page.tsx
let loginCode = fs.readFileSync('src/app/login/page.tsx', 'utf8');
loginCode = loginCode.replace("import { auth, db } from '@/lib/firebase';", "import { auth, db } from '@/lib/firebase';\nimport { getUserOnServer } from '@/app/actions/profile';");

const loginReplacement = `
      let userData = null;
      let dbFailed = false;
      try {
        console.log("[LOGIN] Fetching user doc via Server Action...");
        const result = await getUserOnServer(userCredential.user.uid);
        if (result.success) {
          userData = result.data;
        } else {
          throw new Error(result.error);
        }
      } catch (dbErr) {
        console.warn("[LOGIN] Server Action failed. Network blocked? Proceeding to feed as fallback.", dbErr);
        dbFailed = true;
      }
`;

loginCode = loginCode.replace(/let userData = null;\n\s*let dbFailed = false;\n\s*try \{[\s\S]*?dbFailed = true;\n\s*\}/, loginReplacement.trim());

fs.writeFileSync('src/app/login/page.tsx', loginCode);

