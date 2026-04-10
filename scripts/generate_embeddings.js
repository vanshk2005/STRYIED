const { pipeline } = require('@xenova/transformers');
const fs = require('fs');
const path = require('path');

async function generate() {
    console.log('Loading model...');
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    const dataPath = path.join(__dirname, '..', 'src', 'data', 'bns_dataset.json');
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'bns_embeddings.json');
    
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    const results = [];
    console.log(`Generating embeddings for ${data.length} sections...`);
    
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        // Combine title and description for better semantic context
        const text = `${item.section}: ${item.title}. ${item.description}`;
        
        try {
            const output = await extractor(text, { pooling: 'mean', normalize: true });
            results.push({
                section: item.section,
                embedding: Array.from(output.data)
            });
        } catch (err) {
            console.error(`Error embedding section ${item.section}:`, err.message);
        }
        
        if (i % 100 === 0) {
            console.log(`Progress: ${Math.round((i / data.length) * 100)}% (${i}/${data.length})`);
        }
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(results));
    console.log('Embeddings generated successfully at ' + outputPath);
    process.exit(0);
}

generate().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
