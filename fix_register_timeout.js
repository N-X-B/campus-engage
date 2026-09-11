const fs = require('fs');

let code = fs.readFileSync('src/app/register/page.tsx', 'utf8');

// Replace the Promise.race
const badRaceMatch = /const userCredential = await Promise\.race\(\[[\s\S]*?createUserWithEmailAndPassword\(auth, email, password\),[\s\S]*?timeoutPromise\(2500, "Firebase Auth is not responding. Check your network or Vercel configuration."\)[\s\S]*?\]\) as any;/;
const goodAuthReplace = `const userCredential = await createUserWithEmailAndPassword(auth, email, password);`;

code = code.replace(badRaceMatch, goodAuthReplace);

// Remove the timeoutPromise function entirely
const timeoutFuncMatch = /const timeoutPromise = \(ms: number, message: string\) =>[\s\S]*?new Promise\(\(\_, reject\) => setTimeout\(\(\) => reject\(new Error\(message\)\), ms\)\);/;
code = code.replace(timeoutFuncMatch, '');

fs.writeFileSync('src/app/register/page.tsx', code);
