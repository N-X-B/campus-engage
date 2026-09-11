const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ",
  authDomain: "project-f784e72e-e435-42c2-bff.firebaseapp.com",
  projectId: "project-f784e72e-e435-42c2-bff",
  storageBucket: "project-f784e72e-e435-42c2-bff.firebasestorage.app",
  messagingSenderId: "38583279350",
  appId: "1:38583279350:web:252b7c8bef0151e0cb16d7"
};

const app = initializeApp(firebaseConfig);
// Specify the database named 'default'
const db = getFirestore(app, "default");

async function run() {
  console.log("Connecting to Firestore 'default' via Web SDK...");
  try {
    const snap = await getDocs(collection(db, 'users'));
    console.log("Success! Users count:", snap.size);
    process.exit(0);
  } catch (e) {
    console.log("Error:", e.message);
    process.exit(1);
  }
}
run();
