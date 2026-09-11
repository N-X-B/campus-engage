const fs = require('fs');

let code = fs.readFileSync('src/app/onboarding/page.tsx', 'utf8');

// Remove timeoutPromise since it's aggressive and unnecessary
code = code.replace(/const timeoutPromise = \(ms: number, msg: string\) => new Promise\(\(\_, reject\) => setTimeout\(\(\) => reject\(new Error\(msg\)\), ms\)\);/g, '');

fs.writeFileSync('src/app/onboarding/page.tsx', code);
