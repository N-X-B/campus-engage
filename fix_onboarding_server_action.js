const fs = require('fs');
let code = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');

// Add import
code = code.replace("import { generateAndSaveEmbedding } from '@/app/actions/matchmaking';", "import { generateAndSaveEmbedding } from '@/app/actions/matchmaking';\nimport { saveProfileOnServer } from '@/app/actions/profile';");

const replacement = `
      console.log("[ONBOARDING] Saving profile via Server Action (bypassing firewall)...");
      try {
        const result = await saveProfileOnServer(user.uid, {
          name: user.displayName || "New User",
          year,
          branch,
          bio,
          answers,
          photos: photoUrls,
          onboarded: true
        });
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        console.log("[ONBOARDING] Server Action save complete!");
      } catch (dbErr) {
        console.warn("[ONBOARDING] Server Action save failed. Proceeding to feed anyway...", dbErr);
      }
`;

code = code.replace(/console\.log\("\[ONBOARDING\] Saving profile to Firestore\.\.\."\);[\s\S]*?console\.warn\("\[ONBOARDING\] Firestore save failed or timed out\. Proceeding to feed anyway\.\.\.", dbErr\);\n\s*\}/, replacement.trim());

fs.writeFileSync('src/app/onboarding/page.tsx', code);
