const fs = require('fs');
let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Add import
code = code.replace("import { auth, db } from '@/lib/firebase';", "import { auth, db } from '@/lib/firebase';\nimport { saveProfileOnServer } from '@/app/actions/profile';");

const replacement = `
      console.log("[REGISTER] Saving profile to Firestore via Server Action...");
      try {
        const result = await saveProfileOnServer(user.uid, {
            name,
            email,
            createdAt: new Date().toISOString(),
            onboardingComplete: false,
            referralCount: 0,
            referredBy: referralId || null
        });
        if (!result.success) throw new Error(result.error);
        console.log("[REGISTER] Server Action save complete!");
      } catch (dbErr) {
        console.warn("[REGISTER] Server Action failed, but account was created in Auth. Proceeding anyway...", dbErr);
      }
`;

code = code.replace(/console\.log\("\[REGISTER\] Saving profile to Firestore\.\.\."\);[\s\S]*?console\.warn\("\[REGISTER\] Firestore failed or timed out, but account was created in Auth\. Proceeding anyway\.\.\.", dbErr\);\n\s*\}/, replacement.trim());

fs.writeFileSync('src/app/register/page.tsx', code);
