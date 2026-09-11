const fs = require('fs');
let code = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');

const replacement = `
      console.log("[ONBOARDING] Saving profile to Firestore...");
      try {
        await Promise.race([
          setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || "New User",
            year,
            branch,
            bio,
            answers,
            photos: photoUrls,
            onboarded: true
          }, { merge: true }),
          timeoutPromise(3000, "Database save timed out!")
        ]);
        console.log("[ONBOARDING] Firestore save complete!");
      } catch (dbErr) {
        console.warn("[ONBOARDING] Firestore save failed or timed out. Proceeding to feed anyway...", dbErr);
      }
      
      // Fire-and-forget AI embedding
      generateAndSaveEmbedding(user.uid, answers).catch(e => console.error("Embedding generation skipped:", e));
`;

code = code.replace(/\/\/ Race database save against a 10-second timeout[\s\S]*?generateAndSaveEmbedding\(user\.uid, answers\)\.catch\(e => console\.error\("Embedding generation skipped \(missing keys\?\):", e\)\);/, replacement.trim());
fs.writeFileSync('src/app/onboarding/page.tsx', code);
