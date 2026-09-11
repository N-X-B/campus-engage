const fs = require('fs');

let code = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');

const badServerActionMatch = /console\.log\("\[ONBOARDING\] Saving profile via Server Action[\s\S]*?try \{[\s\S]*?const result = await saveProfileOnServer\(user\.uid, \{[\s\S]*?onboarded: true\s*\}\);[\s\S]*?if \(!result\.success\) \{[\s\S]*?\}[\s\S]*?console\.log\("\[ONBOARDING\] Server Action save complete!"\);[\s\S]*?\} catch \(dbErr\) \{[\s\S]*?console\.warn\("\[ONBOARDING\] Server Action save failed\. Proceeding to feed anyway\.\.\.", dbErr\);[\s\S]*?\}/;

const goodClientWrite = `console.log("[ONBOARDING] Saving profile directly to Firestore...");
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "New User",
          year,
          branch,
          bio,
          answers,
          photos: photoUrls,
          onboarded: true
        }, { merge: true });
        console.log("[ONBOARDING] Profile written successfully!");
      } catch (dbErr) {
        console.warn("[ONBOARDING] Database write failed. Network blocked?", dbErr);
      }`;

code = code.replace(badServerActionMatch, goodClientWrite);

// Remove the import for saveProfileOnServer
code = code.replace(/import \{ saveProfileOnServer \} from '@\/app\/actions\/profile';\n/, '');

// Fix any missing doc/setDoc imports
if (!code.includes('setDoc')) {
  code = code.replace("import { db } from '@/lib/firebase';", "import { db } from '@/lib/firebase';\nimport { doc, setDoc } from 'firebase/firestore';");
}

fs.writeFileSync('src/app/onboarding/page.tsx', code);
