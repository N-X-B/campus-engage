const fs = require('fs');
let code = fs.readFileSync('src/app/actions/matchmaking.ts', 'utf8');
const append = `
export async function deleteUserEmbedding(uid: string) {
  try {
    const pinecone = getPinecone();
    const index = pinecone.index(PINECONE_INDEX_NAME);
    await index.deleteOne(uid);
    return { success: true };
  } catch (error: any) {
    console.error("Delete Embedding Error:", error);
    return { success: false, error: error.message };
  }
}
`;
fs.appendFileSync('src/app/actions/matchmaking.ts', append);
