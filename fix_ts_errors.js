const fs = require('fs');

// Fix feed page
let feed = fs.readFileSync('src/app/feed/page.tsx', 'utf8');
feed = feed.replace('let currentUserData = null;', 'let currentUserData: any = null;');
fs.writeFileSync('src/app/feed/page.tsx', feed);

// Fix login page
let login = fs.readFileSync('src/app/login/page.tsx', 'utf8');
login = login.replace('if (userData.onboarded) {', 'if ((userData as any).onboarded) {');
fs.writeFileSync('src/app/login/page.tsx', login);

// Fix match algorithm
let matchAlg = fs.readFileSync('src/lib/matchAlgorithm.ts', 'utf8');
matchAlg = matchAlg.replace('words1.filter(w =>', 'words1.filter((w: string) =>');
fs.writeFileSync('src/lib/matchAlgorithm.ts', matchAlg);

