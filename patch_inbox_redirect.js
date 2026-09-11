const fs = require('fs');
let code = fs.readFileSync('src/app/inbox/page.tsx', 'utf8');

const target = `    // Load all users to get names/photos for the inbox
    getDocs(collection(db, 'users')).then(snapshot => {`;

const replacement = `    // Check incognito status
    getDoc(doc(db, 'users', user.uid)).then(docSnap => {
      if (docSnap.exists() && docSnap.data().incognito) {
         window.location.href = '/missed-connections';
      }
    });

    // Load all users to get names/photos for the inbox
    getDocs(collection(db, 'users')).then(snapshot => {`;

code = code.replace(target, replacement);

if (!code.includes("getDoc")) {
  code = code.replace("getDocs,", "getDocs, getDoc,");
}

fs.writeFileSync('src/app/inbox/page.tsx', code);
