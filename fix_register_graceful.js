const fs = require('fs');
let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

const replacement = `
      console.log("[REGISTER] Saving profile to Firestore...");
      try {
        await Promise.race([
          setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            createdAt: new Date().toISOString(),
            onboardingComplete: false,
            referralCount: 0,
            referredBy: referralId || null
          }),
          timeoutPromise(3000, "Database connection timed out. Firestore is hanging.")
        ]);
        console.log("[REGISTER] Firestore save complete!");
      } catch (dbErr) {
        console.warn("[REGISTER] Firestore failed or timed out, but account was created in Auth. Proceeding anyway...", dbErr);
      }
`;

code = code.replace(/console\.log\("\[REGISTER\] Saving profile to Firestore\.\.\."\);[\s\S]*?console\.log\("\[REGISTER\] Firestore save complete!"\);/, replacement.trim());
fs.writeFileSync('src/app/register/page.tsx', code);

let firebaseCode = fs.readFileSync('src/lib/firebase.ts', 'utf8');
firebaseCode = firebaseCode.replace(/db = initializeFirestore\(app, \{[\s\S]*?\}\);/, "db = getFirestore(app);");
fs.writeFileSync('src/lib/firebase.ts', firebaseCode);

