const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  'import { getFirestore } from "firebase/firestore";',
  'import { getFirestore, initializeFirestore } from "firebase/firestore";'
);

code = code.replace(
  'db = getFirestore(app);',
  `db = initializeFirestore(app, {
    experimentalForceLongPolling: true
  });`
);

fs.writeFileSync('src/lib/firebase.ts', code);
