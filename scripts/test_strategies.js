const { pipeline } = require('@xenova/transformers');
const fs = require('fs');

async function test() {
    console.log('Testing semantic strategy matching...');
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    const embeddings = JSON.parse(fs.readFileSync('src/data/strategy_embeddings.json', 'utf8'));
    
    const query = 'I have been falsely accused in a dowry case by my wife family. The FIR is malicious.';
    const output = await extractor(query, { pooling: 'mean', normalize: true });
    const userEmbedding = Array.from(output.data);
    
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
    
    const results = embeddings.map(item => ({
        strategy: item.label,
        score: cosineSimilarity(userEmbedding, item.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => ({
        ...s,
        confidence: Math.round(Math.max(0.1, Math.min(0.99, (s.score - 0.2) * 1.5)) * 100)
    }));
    
    console.log('Top strategies for: ' + query);
    console.log(results);
}

test();
