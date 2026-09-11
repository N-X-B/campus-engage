const fs = require('fs');
let code = fs.readFileSync('src/app/actions/profile.ts', 'utf8');
code = code.replace("const DB_PATH = path.join(process.cwd(), 'local-db.json');", "const DB_PATH = process.env.VERCEL ? '/tmp/local-db.json' : path.join(process.cwd(), 'local-db.json');");
fs.writeFileSync('src/app/actions/profile.ts', code);
