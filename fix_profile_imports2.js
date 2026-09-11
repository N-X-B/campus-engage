const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

code = code.replace("import { doc, deleteDoc, getDoc } from 'firebase/firestore';", "import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';");

fs.writeFileSync('src/app/profile/page.tsx', code);
