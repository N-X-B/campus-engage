"use server";

import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'local-db.json');

// Initialize local DB if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }));
}

function readDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { users: {} };
  }
}

function writeDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function saveProfileOnServer(uid: string, data: any) {
  try {
    console.log("[SERVER ACTION] Saving profile locally for", uid);
    const db = readDb();
    
    // Merge existing data if any
    db.users[uid] = {
      ...(db.users[uid] || {}),
      ...data,
      id: uid
    };
    
    writeDb(db);
    return { success: true };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to save profile locally:", err);
    return { success: false, error: err.message };
  }
}

export async function getProfilesOnServer() {
  try {
    console.log("[SERVER ACTION] Fetching all profiles from local DB");
    const db = readDb();
    const profiles = Object.values(db.users);
    
    return { success: true, profiles };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch profiles locally:", err);
    return { success: false, error: err.message };
  }
}

export async function getUserOnServer(uid: string) {
  try {
    const db = readDb();
    const user = db.users[uid] || null;
    return { success: true, data: user };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch user locally:", err);
    return { success: false, error: err.message };
  }
}
