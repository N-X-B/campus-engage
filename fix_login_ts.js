const fs = require('fs');
let login = fs.readFileSync('src/app/login/page.tsx', 'utf8');
login = login.replace('if (dbFailed || (userData && userData.onboarded)) {', 'if (dbFailed || (userData && (userData as any).onboarded)) {');
fs.writeFileSync('src/app/login/page.tsx', login);
