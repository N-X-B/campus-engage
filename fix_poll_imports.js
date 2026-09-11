const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const importStatement = `import { doc, getDoc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';`;

if (!code.includes("arrayUnion")) {
  code = code.replace(/import \{ doc, getDoc, updateDoc.*\} from 'firebase\/firestore';/, importStatement);
}

// Ensure it replaced successfully, if not, force inject it
if (!code.includes("arrayUnion")) {
  code = code.replace("import { db } from '@/lib/firebase';", "import { db } from '@/lib/firebase';\n" + importStatement);
}

fs.writeFileSync('src/app/profile/page.tsx', code);
