const fs = require('fs');
let code = fs.readFileSync('src/app/inbox/page.tsx', 'utf8');

if (!code.includes("getDoc,")) {
  code = code.replace("getDocs,", "getDocs, getDoc,");
}
code = code.replace("docSnap => {", "(docSnap: any) => {");

fs.writeFileSync('src/app/inbox/page.tsx', code);
