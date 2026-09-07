"use server";

import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// These will fail gracefully if keys are missing during build, but throw at runtime if not provided.
const getPinecone = () => {
  if (!process.env.PINECONE_API_KEY) throw new Error("Missing PINECONE_API_KEY");
  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
};

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "campusengage-matches";

export async function generateAndSaveEmbedding(uid: string, answers: any) {
  if (!uid || !answers || answers.length === 0) return { success: false, error: "Invalid data" };
  
  try {
    const openai = getOpenAI();
    const pinecone = getPinecone();
    
    // Concatenate answers into a single semantic block of text
    const textToEmbed = Object.values(answers).join(" | ");
    
    // Generate embedding using OpenAI
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: textToEmbed,
      encoding_format: "float",
    });
    
    const embedding = response.data[0].embedding;
    
    // Save to Pinecone
    const index = pinecone.index(PINECONE_INDEX_NAME);
    await index.upsert([{
      id: uid,
      values: embedding,
      metadata: {
        timestamp: Date.now()
      }
    }]);
    
    return { success: true };
  } catch (error: any) {
    console.error("Embedding Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getTopMatches(uid: string, limit: number = 20) {
  try {
    const pinecone = getPinecone();
    const index = pinecone.index(PINECONE_INDEX_NAME);
    
    // 1. Fetch the current user's embedding to use as the query vector
    const userRecord = await index.fetch([uid]);
    
    if (!userRecord.records[uid]) {
      // User hasn't been embedded yet (maybe legacy user or skipped onboarding)
      return { success: false, error: "User embedding not found", matches: [] };
    }
    
    const userVector = userRecord.records[uid].values;
    
    // 2. Query Pinecone for the closest matches using Cosine Similarity
    const queryResponse = await index.query({
      vector: userVector,
      topK: limit + 1, // +1 because the user will match with themselves
      includeMetadata: false
    });
    
    // 3. Filter out the current user and map to IDs
    const matchedUids = queryResponse.matches
      ?.filter((match: any) => match.id !== uid)
      .map(match => ({ id: match.id, score: match.score || 0 })) || [];
      
    return { success: true, matches: matchedUids };
  } catch (error: any) {
    console.error("Match Query Error:", error);
    return { success: false, error: error.message, matches: [] };
  }
}
