const fs = require('fs');

let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Replace the Server Action with direct client-side setDoc
const badServerActionMatch = /console\.log\("\[REGISTER\] Saving profile to Firestore via Server Action\.\.\."\);[\s\S]*?try \{[\s\S]*?const result = await saveProfileOnServer\(user\.uid, \{[\s\S]*?\}\);[\s\S]*?\} catch \(dbErr\) \{[\s\S]*?\}/;

const goodClientWrite = `console.log("[REGISTER] Saving profile directly to Firestore...");
      try {
        await setDoc(doc(db, "users", user.uid), {
            name,
            email,
            createdAt: new Date().toISOString(),
            onboardingComplete: false,
            referralCount: 0,
            referredBy: referralId || null
        }, { merge: true });
        console.log("[REGISTER] Document written successfully!");
      } catch (dbErr) {
        console.warn("[REGISTER] Database write failed, but Auth succeeded. Continuing...", dbErr);
      }`;

code = code.replace(badServerActionMatch, goodClientWrite);

// Ensure setDoc and doc are imported
if (!code.includes('setDoc')) {
  code = code.replace("import { auth } from '@/lib/firebase';", "import { auth, db } from '@/lib/firebase';\nimport { doc, setDoc } from 'firebase/firestore';");
}

// Remove saveProfileOnServer import to clean up
code = code.replace(/import \{ saveProfileOnServer \} from '@\/app\/actions\/profile';\n/, '');

fs.writeFileSync('src/app/register/page.tsx', code);
