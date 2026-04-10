const fs = require('fs');
const pdf = require('pdf-parse');

async function readPdf() {
    let dataBuffer = fs.readFileSync('BNS.pdf');
    
    try {
        const data = await pdf(dataBuffer);
        console.log("PDF Pages:", data.numpages);
        console.log("PDF Text Preview (first 5000 chars):");
        console.log("-----------------------------------------");
        console.log(data.text.substring(0, 5000));
        console.log("-----------------------------------------");
    } catch (error) {
        console.error("Error parsing PDF:", error);
    }
}

readPdf();
