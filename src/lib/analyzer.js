import fs from 'fs';
import path from 'path';
import { strategyMappings } from '@/data/strategyKeywords';
import { pipeline } from '@xenova/transformers';

// Cache for the embedding pipeline
let extractor = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function performAnalysis(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('Case text is required for analysis');
  }

  // 1. Semantic Search for Sections using Embeddings
  const datasetPath = path.join(process.cwd(), 'src', 'data', 'bns_dataset.json');
  const embeddingsPath = path.join(process.cwd(), 'src', 'data', 'bns_embeddings.json');
  
  const sectionsData = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  const embeddingsData = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
  
  const extractorInstance = await getExtractor();
  const output = await extractorInstance(text, { pooling: 'mean', normalize: true });
  const userEmbedding = Array.from(output.data);
  
  // Calculate similarities
  const scoredSections = embeddingsData.map(item => {
    const similarity = cosineSimilarity(userEmbedding, item.embedding);
    return {
      section: item.section,
      score: similarity
    };
  });
  
  // Sort by score and take top 10
  const topMatches = scoredSections
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .filter(item => item.score > 0.3) // Filter out low quality matches
    .map(match => {
      const fullEntry = sectionsData.find(s => s.section === match.section);
      return {
        ...fullEntry,
        confidence: Math.round(match.score * 100)
      };
    });
  
  // 2. Semantic Search for Legal Strategies
  const strategyEmbeddingsPath = path.join(process.cwd(), 'src', 'data', 'strategy_embeddings.json');
  const strategyEmbeddingsData = JSON.parse(fs.readFileSync(strategyEmbeddingsPath, 'utf8'));
  
  // Calculate similarities for strategies
  const scoredStrategies = strategyEmbeddingsData.map(item => {
    const similarity = cosineSimilarity(userEmbedding, item.embedding);
    return {
      label: item.label,
      score: similarity
    };
  });
  
  // Sort and return top 3 professional strategies
  const topStrategies = scoredStrategies
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => {
      const fullStrategy = strategyMappings.find(sm => sm.strategy === s.label);
      return {
        ...s,
        description: fullStrategy ? fullStrategy.description : '',
        // Normalize score to look more 'confident' for relevant matches (0.4 to 0.95 range)
        score: Math.max(0.1, Math.min(0.99, (s.score - 0.2) * 1.5))
      };
    });
    
  return {
    sections: topMatches,
    strategies: topStrategies
  };
}
