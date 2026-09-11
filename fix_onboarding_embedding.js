const fs = require('fs');
let code = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');

if (!code.includes("generateAndSaveEmbedding")) {
  code = code.replace("import { doc, setDoc } from 'firebase/firestore';", 
    "import { doc, setDoc } from 'firebase/firestore';\nimport { generateAndSaveEmbedding } from '@/app/actions/matchmaking';");
}

const replacement = `
      // Race database save against a 10-second timeout
      await Promise.race([
        setDoc(doc(db, 'users', user.uid), {
          year,
          branch,
          bio,
          answers,
          photos: photoUrls,
          onboarded: true
        }, { merge: true }),
        timeoutPromise(10000, "Database save timed out! Please double check that your Vercel Environment Variables have no typos.")
      ]);
      
      // Fire-and-forget: Generate AI Embedding for the user's vibe check answers
      // We don't await this blocking the UI, but it saves to Pinecone in the background.
      generateAndSaveEmbedding(user.uid, answers).catch(e => console.error("Embedding generation skipped (missing keys?):", e));
`;

code = code.replace(/\/\/ Race database save against a 10-second timeout[\s\S]*?\]\);\s*/m, replacement + '\n      ');
fs.writeFileSync('src/app/onboarding/page.tsx', code);
