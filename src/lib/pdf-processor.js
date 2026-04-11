import { PDFParse } from 'pdf-parse';

export async function processPdf(buffer) {
  try {
    // Initialize the parser with the buffer
    const parser = new PDFParse({ data: buffer });

    // 1. Extract Text
    const textData = await parser.getText();
    const text = textData.text;
    const numPages = textData.total;

    // 2. Extract Images
    // The library supports image extraction in version 2.4.5
    const imageResult = await parser.getImage({
      imageDataUrl: true, // This will give us base64 which we can use in the UI
      imageThreshold: 100, // Skip small icons
      first: 5 // Limit to first 5 pages for performance
    });

    const images = [];
    for (const page of imageResult.pages) {
      for (const img of page.images) {
        images.push({
          page: page.pageNumber,
          width: img.width,
          height: img.height,
          dataUrl: img.dataUrl
        });
        if (images.length >= 10) break;
      }
      if (images.length >= 10) break;
    }

    return {
      text,
      summary: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
      pageCount: numPages,
      imageCount: images.length,
      images: images
    };
  } catch (error) {
    console.error('Error during PDF processing:', error);
    throw error;
  }
}
