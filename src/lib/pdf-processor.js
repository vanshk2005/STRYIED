import { PDFParse } from 'pdf-parse';

/**
 * Extract text from a PDF buffer using pdf-parse v2.x.
 * pdf-parse v2 exports a PDFParse class (requires verbosity option).
 */
export async function processPdf(buffer) {
  try {
    const parser = new PDFParse({ verbosity: 0 });

    // Load the buffer into the parser
    await parser.load(buffer);

    // Extract text
    const textData = await parser.getText();
    const text = textData.text || '';
    const numPages = textData.total || 0;

    return {
      text,
      summary: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
      pageCount: numPages,
      imageCount: 0,
      images: []
    };
  } catch (error) {
    console.error('Error during PDF processing:', error);
    throw error;
  }
}
