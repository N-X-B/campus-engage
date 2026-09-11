const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

if (!code.includes('updateDoc')) {
  code = code.replace(/getDoc \} from 'firebase\/firestore';/, "getDoc, updateDoc } from 'firebase/firestore';");
}

fs.writeFileSync('src/app/profile/page.tsx', code);
