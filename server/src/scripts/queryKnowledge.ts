import { index } from "../services/pineconeClient";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// @ts-ignore
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/text-embedding-004" });

async function searchKnowledge(query: string, topK = 3) {
  try {
    console.log(`🔍 Searching for: "${query}"...`);

    const embeddingResponse = await model.embedContent(query);
    const queryEmbedding = embeddingResponse.embedding.values;

    if (!queryEmbedding || !Array.isArray(queryEmbedding))
      throw new Error("Invalid query embedding.");

    const response = await index.namespace("knowledge").query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    const results = response.matches?.map((match) => ({
      text: match.metadata?.text,
      score: match.score,
    }));

    console.log(`✅ Found ${results?.length || 0} matches.`);
    return results;
  } catch (error) {
    console.error("❌ Error searching:", error);
    return [];
  }
}

// Example usage 1
(async () => {
  const query = "Who is David Nguyen?";
  const results = await searchKnowledge(query);
  console.log("🔹 Most relevant results:", results);
})();

// Example usage 2
(async () => {
  const query = "What projects has Son Nguyen worked on?";
  const results = await searchKnowledge(query, 5);
  console.log("🔹 Most relevant results:", results);
})();

// Example usage 3
(async () => {
  const query = "What are Son Nguyen's skills?";
  const results = await searchKnowledge(query, 10);
  console.log("🔹 Most relevant results:", results);
})();

// Example usage 4
(async () => {
  const query = "What is Lumina?";
  const results = await searchKnowledge(query, 1);
  console.log("🔹 Most relevant results:", results);
})();

// Example usage 5
(async () => {
  const query = "What is Pinecone?";
  const results = await searchKnowledge(query, 2);
  console.log("🔹 Most relevant results:", results);
})();

export { searchKnowledge };
