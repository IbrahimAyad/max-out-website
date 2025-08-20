import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, generateFileName } from '@/lib/cloudflare/r2-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';
    const metadataStr = formData.get('metadata') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse metadata if provided
    let metadata = {};
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Generate unique filename
    const fileName = generateFileName(file.name);
    const key = `${category}/${fileName}`;
    
    // Upload to R2
    const url = await uploadToR2(arrayBuffer, key, file.type);
    
    return NextResponse.json({
      success: true,
      key,
      url,
      metadata,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Support OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}