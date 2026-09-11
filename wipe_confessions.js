const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ",
  authDomain: "project-f784e72e-e435-42c2-bff.firebaseapp.com",
  projectId: "project-f784e72e-e435-42c2-bff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function wipe() {
  console.log("Fetching confessions...");
  const snapshot = await getDocs(collection(db, 'confessions'));
  console.log(`Found ${snapshot.size} confessions. Deleting...`);
  
  let deleted = 0;
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, 'confessions', document.id));
    deleted++;
  }
  
  // also wipe 'spotted' if it's there
  const snapshot2 = await getDocs(collection(db, 'spotted'));
  console.log(`Found ${snapshot2.size} spotted posts. Deleting...`);
  for (const document of snapshot2.docs) {
    await deleteDoc(doc(db, 'spotted', document.id));
    deleted++;
  }
  
  console.log(`Deleted ${deleted} total documents.`);
  process.exit(0);
}

wipe().catch(console.error);
