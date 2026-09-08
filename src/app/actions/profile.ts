"use server";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveProfileOnServer(uid: string, data: any) {
  try {
    console.log("[SERVER ACTION] Saving profile for", uid);
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    console.log("[SERVER ACTION] Profile saved successfully.");
    return { success: true };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to save profile:", err);
    return { success: false, error: err.message };
  }
}

import { collection, getDocs, getDoc } from "firebase/firestore";

export async function getProfilesOnServer() {
  try {
    const q = collection(db, "users");
    const querySnapshot = await getDocs(q);
    const profiles: any[] = [];
    querySnapshot.forEach((doc: any) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, profiles };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch profiles:", err);
    return { success: false, error: err.message };
  }
}

export async function getUserOnServer(uid: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: true, data: null };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch user:", err);
    return { success: false, error: err.message };
  }
}
