const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');
code = code.replace(
  `import { collection, getDocs, query } from 'firebase/firestore';`,
  `import { collection, getDocs, query, doc, setDoc, addDoc } from 'firebase/firestore';`
);
code = code.replace(`const { doc, setDoc, addDoc, collection } = require('firebase/firestore');`, '');
fs.writeFileSync('src/app/feed/page.tsx', code);
