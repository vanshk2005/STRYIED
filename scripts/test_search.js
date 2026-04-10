const { pipeline } = require('@xenova/transformers');
const fs = require('fs');

async function test() {
    console.log('Testing semantic search...');
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    const embeddings = JSON.parse(fs.readFileSync('src/data/bns_embeddings.json', 'utf8'));
    
    const query = 'someone stole my car from the garage';
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
        section: item.section,
        score: cosineSimilarity(userEmbedding, item.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
    
    console.log('Top matches for: ' + query);
    console.log(results);
}

test();
