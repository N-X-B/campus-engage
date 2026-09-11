const fs = require('fs');

let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');

const badLoginActionMatch = /console\.log\("\[LOGIN\] Fetching user doc via Server Action\.\.\."\);[\s\S]*?try \{[\s\S]*?const result = await getUserOnServer\(user\.uid\);[\s\S]*?if \(!result\.success\) throw new Error\(result\.error\);[\s\S]*?userData = result\.data;[\s\S]*?\} catch \(dbErr\) \{[\s\S]*?\}/;

const goodClientRead = `console.log("[LOGIN] Fetching user doc directly from Firestore...");
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
           userData = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (dbErr) {
        console.warn("[LOGIN] Database read failed. Network blocked? Proceeding to feed as fallback.", dbErr);
        dbFailed = true;
      }`;

code = code.replace(badLoginActionMatch, goodClientRead);

// Ensure getDoc and doc are imported
if (!code.includes('getDoc')) {
  code = code.replace("import { auth } from '@/lib/firebase';", "import { auth, db } from '@/lib/firebase';\nimport { doc, getDoc } from 'firebase/firestore';");
}

code = code.replace(/import \{ getUserOnServer \} from '@\/app\/actions\/profile';\n/, '');

fs.writeFileSync('src/app/login/page.tsx', code);
