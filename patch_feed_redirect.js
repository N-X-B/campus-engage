const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');

const target = `             if (!currentUserData.onboarded) {
                window.location.href = '/onboarding';
                return;
             }`;

const replacement = `             if (currentUserData.incognito) {
                window.location.href = '/missed-connections';
                return;
             }
             if (!currentUserData.onboarded) {
                window.location.href = '/onboarding';
                return;
             }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/app/feed/page.tsx', code);
