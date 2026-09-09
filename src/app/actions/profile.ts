"use server";

import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveProfileOnServer(uid: string, data: any) {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to save profile via Web SDK:", err);
    return { success: false, error: err.message };
  }
}

export async function getProfilesOnServer() {
  try {
    const snap = await getDocs(collection(db, "users"));
    const profiles: any[] = [];
    snap.forEach(doc => profiles.push({ id: doc.id, ...doc.data() }));
    return { success: true, profiles };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch profiles via Web SDK:", err);
    return { success: false, error: err.message };
  }
}

export async function getUserOnServer(uid: string) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return { success: true, data: null };
    return { success: true, data: { id: snap.id, ...snap.data() } };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch user via Web SDK:", err);
    return { success: false, error: err.message };
  }
}
