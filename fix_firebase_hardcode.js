const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

const replacement = `
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "project-f784e72e-e435-42c2-bff.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "project-f784e72e-e435-42c2-bff",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "project-f784e72e-e435-42c2-bff.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "38583279350",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:38583279350:web:252b7c8bef0151e0cb16d7",
};
`;

code = code.replace(/const firebaseConfig = \{[\s\S]*?\};/, replacement.trim());
fs.writeFileSync('src/lib/firebase.ts', code);
