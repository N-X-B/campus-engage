const fs = require('fs');
let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');

const replacement = `
      let userData = null;
      try {
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        userData = userDoc.data();
      } catch (dbErr) {
        console.warn("[LOGIN] Failed to get user document. Network blocked? Proceeding to onboarding as fallback.", dbErr);
      }
      
      setLoginState('success');
      setTimeout(() => {
        if (userData && userData.onboarded) {
          router.push('/feed');
        } else {
          router.push('/onboarding');
        }
      }, 1200);
`;

code = code.replace(/const userDoc = await getDoc[\s\S]*?\}, 1200\);/, replacement.trim());
fs.writeFileSync('src/app/login/page.tsx', code);
