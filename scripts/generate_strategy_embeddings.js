const { pipeline } = require('@xenova/transformers');
const fs = require('fs');
const path = require('path');
const { strategyMappings } = require('../src/data/strategyKeywords');

async function generate() {
    console.log('Loading model for strategy embeddings...');
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'strategy_embeddings.json');
    
    const results = [];
    console.log(`Generating embeddings for ${strategyMappings.length} legal strategies...`);
    
    for (let i = 0; i < strategyMappings.length; i++) {
        const item = strategyMappings[i];
        // Combine strategy name and description for semantic context
        const text = `${item.strategy}: ${item.description}. Keywords: ${item.keywords.join(', ')}`;
        
        try {
            const output = await extractor(text, { pooling: 'mean', normalize: true });
            results.push({
                label: item.strategy,
                embedding: Array.from(output.data)
            });
            console.log(`Completed: ${item.strategy}`);
        } catch (err) {
            console.error(`Error embedding strategy ${item.strategy}:`, err.message);
        }
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(results));
    console.log('Strategy embeddings generated successfully at ' + outputPath);
    process.exit(0);
}

generate().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
