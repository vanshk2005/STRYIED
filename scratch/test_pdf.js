const { PDFParse } = require('../node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs');
const fs = require('fs');

async function test() {
  try {
    // Create a very minimal valid PDF buffer
    // A minimal PDF starts with %PDF- and has cross-references etc.
    // Instead of creating one from scratch, let's see if we can find any .pdf in node_modules or elsewhere
    console.log("Testing PDFParse...");
    
    // Attempt to parse an empty buffer - should throw or fail gracefully
    const parser = new PDFParse({ data: Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources << >>\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<< /Length 12 >>\nstream\nBT /F1 12 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000193 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n253\n%%EOF') });
    
    console.log("Parser initialized");
    const text = await parser.getText();
    console.log("Text extracted:", text.text);
    
    const images = await parser.getImage();
    console.log("Images extracted:", images.pages.length);
    
    console.log("Test passed!");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
