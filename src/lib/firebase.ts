import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "project-f784e72e-e435-42c2-bff.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "project-f784e72e-e435-42c2-bff",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "project-f784e72e-e435-42c2-bff.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "38583279350",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:38583279350:web:252b7c8bef0151e0cb16d7",
};

let app;
let auth: any;
let db: any;
let storage: any;
let messaging: any;

try {
  const apps = getApps();
  if (!apps.length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, "default");
  } else {
    app = getApp();
    db = getFirestore(app);
  }
  
  auth = getAuth(app);
  storage = getStorage(app);
  
  if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported) {
        messaging = getMessaging(app);
      }
    });
  }
} catch (e) {
  console.warn("Firebase initialization failed.", e);
}

export { app, auth, db, storage, messaging };
