const fs = require('fs');

// 1. Give onboarding enough time to upload Base64 strings (8 seconds)
let onboardingCode = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');
onboardingCode = onboardingCode.replace(/timeoutPromise\(1500, "Database save timed out!"\)/g, 'timeoutPromise(8000, "Database save timed out!")');
fs.writeFileSync('src/app/onboarding/page.tsx', onboardingCode);

// 2. If Feed successfully fetches 0 users, fall back to demo mode so the screen isn't empty!
let feedCode = fs.readFileSync('src/app/feed/page.tsx', 'utf8');
const feedReplacement = `
            querySnapshot.forEach((doc: any) => {
              fetchedProfiles.push({ id: doc.id, ...doc.data() });
            });
            
            // If the database is completely empty (no users saved), fall back to Demo profiles so the feed isn't blank
            if (fetchedProfiles.length <= 1) {
              console.warn("[FEED] Database is empty. Injecting Demo users.");
              fetchedProfiles = await demoDb.getProfiles();
            }
`;
feedCode = feedCode.replace(/querySnapshot\.forEach\(\(doc: any\) => \{\n\s*fetchedProfiles\.push\(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\);\n\s*\}\);/, feedReplacement.trim());
fs.writeFileSync('src/app/feed/page.tsx', feedCode);
