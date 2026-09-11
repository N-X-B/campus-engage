const fs = require('fs');

let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const badMatch = `if (userDoc.exists()) {
             currentUserData = userDoc.data();
             setUserData(currentUserData);
          }`;

const goodMatch = `if (userDoc.exists()) {
             currentUserData = userDoc.data();
             if (!currentUserData.onboarded) {
                window.location.href = '/onboarding';
                return;
             }
             setUserData(currentUserData);
          } else {
             window.location.href = '/onboarding';
             return;
          }`;

code = code.replace(badMatch, goodMatch);

fs.writeFileSync('src/app/feed/page.tsx', code);
