import { NextResponse } from 'next/server';
import { performAnalysis } from '@/lib/analyzer';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Case text is required' }, { status: 400 });
    }

    const results = await performAnalysis(text);
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Error analyzing case:', error);
    return NextResponse.json({ error: 'Failed to analyze case' }, { status: 500 });
  }
}
