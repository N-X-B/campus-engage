const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

// Replace the getProfilesOnServer logic with standard client-side Firebase logic
const badFetchMatch = /if \(isDemoMode\) \{[\s\S]*?fetchedProfiles = await demoDb\.getProfiles\(\);\s*\} else \{[\s\S]*?\} catch \(err\) \{[\s\S]*?\}\s*\}/;

const fastFetchReplace = `if (isDemoMode) {
          fetchedProfiles = await demoDb.getProfiles();
        } else {
          const querySnapshot = await getDocs(query(collection(db, 'users'), where('onboarded', '==', true)));
          querySnapshot.forEach(doc => {
             const d = doc.data();
             if (d.onboarded && doc.id !== user.uid) {
               fetchedProfiles.push({ id: doc.id, ...d });
             }
          });
        }`;

code = code.replace(badFetchMatch, fastFetchReplace);

// Remove the getProfilesOnServer import if it exists to clean up
code = code.replace(/import \{ getProfilesOnServer \} from '@\/app\/actions\/profile';\n/, '');

fs.writeFileSync('src/app/feed/page.tsx', code);
