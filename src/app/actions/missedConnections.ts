"use server";

const PROJECT_ID = "project-f784e72e-e435-42c2-bff";
const API_KEY = "AIzaSyD4uG7W2_m1bZgB18x26b9e8bjZnPKRSCQ";

function toFirestore(obj: any): any {
  if (obj === undefined) return undefined;
  const result: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    if (typeof val === 'string') result[key] = { stringValue: val };
    else if (typeof val === 'number') result[key] = { integerValue: val.toString() };
    else if (typeof val === 'boolean') result[key] = { booleanValue: val };
    else if (Array.isArray(val)) result[key] = { arrayValue: { values: val.map(v => toFirestore({_:v})._) } };
    else if (val === null) result[key] = { nullValue: null };
    else if (typeof val === 'object') result[key] = { mapValue: { fields: toFirestore(val) } };
  }
  return result;
}

function fromFirestore(fields: any): any {
  if (!fields) return {};
  const result: any = {};
  for (const [key, val] of Object.entries(fields)) {
    if ('stringValue' in val as any) result[key] = (val as any).stringValue;
    else if ('integerValue' in val as any) result[key] = parseInt((val as any).integerValue);
    else if ('booleanValue' in val as any) result[key] = (val as any).booleanValue;
    else if ('arrayValue' in val as any) result[key] = ((val as any).arrayValue.values || []).map((v: any) => fromFirestore({_:v})._);
    else if ('mapValue' in val as any) result[key] = fromFirestore((val as any).mapValue.fields);
    else if ('nullValue' in val as any) result[key] = null;
  }
  return result;
}

export async function getMissedConnections() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents/missedConnections?key=${API_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) throw new Error("REST API Error fetching missed connections");

    const json = await res.json();
    const posts: any[] = [];
    
    if (json.documents) {
      for (const doc of json.documents) {
        const parts = doc.name.split('/');
        const id = parts[parts.length - 1];
        posts.push({ id, ...fromFirestore(doc.fields) });
      }
    }
    
    return { success: true, posts: posts.sort((a,b) => b.timestamp - a.timestamp) };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch missed connections:", err);
    return { success: false, error: err.message };
  }
}

export async function postMissedConnection(data: any) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents/missedConnections?key=${API_KEY}`;
    
    const payload = {
      fields: toFirestore(data)
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("REST API Error posting missed connection");
    
    return { success: true };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to post missed connection:", err);
    return { success: false, error: err.message };
  }
}
