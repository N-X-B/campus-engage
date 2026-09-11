const fs = require('fs');

let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');

const badLoginActionMatch = /try \{\s*console\.log\("\[LOGIN\] Fetching user doc via Server Action\.\.\."\);[\s\S]*?\} catch \(dbErr\) \{[\s\S]*?dbFailed = true;\s*\}/;

const goodClientRead = `try {
        console.log("[LOGIN] Fetching user doc directly from Firestore...");
        const docSnap = await getDoc(doc(db, "users", userCredential.user.uid));
        if (docSnap.exists()) {
           userData = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (dbErr) {
        console.warn("[LOGIN] Database read failed. Network blocked? Proceeding to feed as fallback.", dbErr);
        dbFailed = true;
      }`;

code = code.replace(badLoginActionMatch, goodClientRead);

fs.writeFileSync('src/app/login/page.tsx', code);
