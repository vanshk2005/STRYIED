const fs = require('fs');
const pdf = require('pdf-parse');

async function readPdf() {
    let dataBuffer = fs.readFileSync('BNS.pdf');
    
    try {
        const data = await pdf(dataBuffer);
        // Write text to a temp file so I can examine it properly
        fs.writeFileSync('bns_text_full.txt', data.text);
        console.log("PDF Pages:", data.numpages);
        console.log("Full text written to bns_text_full.txt");
        
        // Let's also output a bit more of the beginning to see the index
        console.log("First 10000 chars of text:");
        console.log("-----------------------------------------");
        console.log(data.text.substring(0, 10000));
        console.log("-----------------------------------------");
    } catch (error) {
        console.error("Error parsing PDF:", error);
    }
}

readPdf();
