"use server";

import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getMissedConnections() {
  try {
    const q = query(collection(db, "missedConnections"), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    const posts: any[] = [];
    snap.forEach((doc: any) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, posts };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch missed connections via Web SDK:", err);
    return { success: false, error: err.message };
  }
}

export async function postMissedConnection(data: any) {
  try {
    await addDoc(collection(db, "missedConnections"), data);
    return { success: true };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to post missed connection via Web SDK:", err);
    return { success: false, error: err.message };
  }
}
