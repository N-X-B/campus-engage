const PROJECT_ID = "project-f784e72e-e435-42c2-bff";

async function testFetch() {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users`;
  const res = await fetch(url);
  const json = await res.json();
  console.log("REST Users:", JSON.stringify(json, null, 2));
}
testFetch();
