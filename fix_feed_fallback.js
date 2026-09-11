const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const timeoutHelper = `
const timeoutPromise = (ms: number, message: string) => 
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
`;

if (!code.includes("timeoutPromise")) {
  code = code.replace("export default function FeedPage() {", timeoutHelper + "\nexport default function FeedPage() {");
}

const replacement = `
      const loadProfiles = async () => {
        let fetchedProfiles: any[] = [];
        
        if (isDemoMode) {
          fetchedProfiles = demoDb.users;
        } else {
          try {
            console.log("[FEED] Fetching profiles from Firestore...");
            const querySnapshot = (await Promise.race([
              getDocs(collection(db, 'users')),
              timeoutPromise(3000, "Firestore connection timed out")
            ])) as any;
            fetchedProfiles = querySnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
          } catch (err) {
            console.warn("[FEED] Failed to load from Firestore (network blocked?). Falling back to Demo Mode.", err);
            fetchedProfiles = demoDb.users;
          }
        }
`;

code = code.replace(/const loadProfiles = async \(\) => \{[\s\S]*?fetchedProfiles = querySnapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\);\n        \}/, replacement.trim());
fs.writeFileSync('src/app/feed/page.tsx', code);

// Fix onboarding navigation
let onboardingCode = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');
onboardingCode = onboardingCode.replace(/router\.push\('\/feed'\);/g, "window.location.href = '/feed';");
fs.writeFileSync('src/app/onboarding/page.tsx', onboardingCode);

