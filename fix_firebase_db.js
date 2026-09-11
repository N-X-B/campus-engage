const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');
code = code.replace('db = getFirestore(app);', 'db = getFirestore(app, "default");');
fs.writeFileSync('src/lib/firebase.ts', code);
