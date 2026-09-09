"use server";

const PROJECT_ID = "project-f784e72e-e435-42c2-bff";

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

export async function saveProfileOnServer(uid: string, data: any) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents/users/${uid}`;
    
    // We do a PATCH to merge data
    // To merge in REST, we must pass updateMask.fieldPaths for every key we want to update
    const maskParams = Object.keys(data).map(k => `updateMask.fieldPaths=${k}`).join('&');
    const fullUrl = `${url}?${maskParams}`;

    const payload = {
      name: `projects/${PROJECT_ID}/databases/default/documents/users/${uid}`,
      fields: toFirestore(data)
    };

    const res = await fetch(fullUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error("REST API Error: " + errText);
    }
    
    return { success: true };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to save profile:", err);
    return { success: false, error: err.message };
  }
}

export async function getProfilesOnServer() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents/users`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
       throw new Error("REST API Error");
    }

    const json = await res.json();
    const profiles: any[] = [];
    
    if (json.documents) {
      for (const doc of json.documents) {
        // Extract the UID from the document name (last segment)
        const parts = doc.name.split('/');
        const id = parts[parts.length - 1];
        profiles.push({ id, ...fromFirestore(doc.fields) });
      }
    }
    
    return { success: true, profiles };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch profiles:", err);
    return { success: false, error: err.message };
  }
}

export async function getUserOnServer(uid: string) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/default/documents/users/${uid}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (res.status === 404) {
      return { success: true, data: null };
    }
    if (!res.ok) {
      throw new Error("REST API Error");
    }
    
    const json = await res.json();
    return { success: true, data: fromFirestore(json.fields) };
  } catch (err: any) {
    console.error("[SERVER ACTION] Failed to fetch user:", err);
    return { success: false, error: err.message };
  }
}
