const fs = require('fs');
let code = fs.readFileSync('src/lib/demo-backend.ts', 'utf8');
code = code.replace(/export const isDemoMode = .*/, 'export const isDemoMode = false; // FORCE DISABLED');
fs.writeFileSync('src/lib/demo-backend.ts', code);
