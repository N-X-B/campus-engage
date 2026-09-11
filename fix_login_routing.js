const fs = require('fs');
let code = fs.readFileSync('src/app/login/page.tsx', 'utf8');

const replacement = `
      let userData = null;
      let dbFailed = false;
      try {
        const userDoc = (await Promise.race([ getDoc(doc(db, 'users', userCredential.user.uid)), timeoutPromise(1500, 'timeout') ])) as any;
        userData = userDoc.data();
      } catch (dbErr) {
        console.warn("[LOGIN] Failed to get user document. Network blocked? Proceeding to feed as fallback.", dbErr);
        dbFailed = true;
      }
      
      setLoginState('success');
      setTimeout(() => {
        // If DB fails, assume they are returning user to avoid forcing onboarding loop
        if (dbFailed || (userData && userData.onboarded)) {
          window.location.href = '/feed';
        } else {
          window.location.href = '/onboarding';
        }
      }, 500);
`;

code = code.replace(/let userData = null;[\s\S]*?\}, 1200\);/, replacement.trim());
fs.writeFileSync('src/app/login/page.tsx', code);
