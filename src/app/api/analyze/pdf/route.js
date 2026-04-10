import { NextResponse } from 'next/server';
import { processPdf } from '@/lib/pdf-processor';
import { performAnalysis } from '@/lib/analyzer';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Process PDF (Extract text/images)
    const pdfData = await processPdf(buffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
    }

    // 2. Run Analysis on extracted text
    const analysisResults = await performAnalysis(pdfData.text);

    return NextResponse.json({
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      pdfData,
      ...analysisResults
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Failed to process PDF case file' }, { status: 500 });
  }
}
