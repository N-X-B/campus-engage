const fs = require('fs');
let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');

if (!code.includes("firebase/firestore")) {
  code = code.replace("import { auth } from '@/lib/firebase';", "import { auth, db } from '@/lib/firebase';\nimport { doc, getDoc } from 'firebase/firestore';");
}

code = code.replace(/await signInWithEmailAndPassword\(auth, email, password\);\n\s*setLoginState\('success'\);\n\s*setTimeout\(\(\) => \{\n\s*router\.push\('\/feed'\);\n\s*\}, 1200\);/g, `const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      setLoginState('success');
      setTimeout(() => {
        if (userData && userData.onboarded) {
          router.push('/feed');
        } else {
          router.push('/onboarding');
        }
      }, 1200);`);

fs.writeFileSync('src/app/login/page.tsx', code);
