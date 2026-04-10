import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // 'all', 'bns', 'bnss', 'bsa'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    
    const filePath = path.join(process.cwd(), 'src', 'data', 'bns_dataset.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const sectionsData = JSON.parse(fileContents);
    
    // Filter by type and query
    let filteredData = sectionsData;
    
    if (type !== 'all') {
      filteredData = filteredData.filter(item => {
        if (item.type && item.type.toLowerCase() === type.toLowerCase()) return true;
        const prefix = item.section.split(' ')[0].toLowerCase();
        return prefix === type.toLowerCase();
      });
    }
    
    if (query) {
      const q = query.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.section.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return NextResponse.json({
      sections: paginatedData,
      totalCount: filteredData.length,
      totalPages: Math.ceil(filteredData.length / limit),
      currentPage: page
    });
    
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}
