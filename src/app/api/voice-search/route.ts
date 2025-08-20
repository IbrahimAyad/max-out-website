import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate - safely handle missing token
let replicate: Replicate | null = null;
try {
  if (process.env.REPLICATE_API_TOKEN) {
    replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
} catch (error) {

}

export async function POST(request: NextRequest) {
  try {
    // Check if Replicate is configured
    if (!replicate) {
      return NextResponse.json(
        { 
          error: 'Voice search not configured',
          message: 'REPLICATE_API_TOKEN not found in environment variables'
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64 or upload to temporary storage
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // For demo purposes, we'll use a data URL
    // In production, you'd upload to cloud storage and use the URL
    const audioDataUrl = `data:${audioFile.type};base64,${buffer.toString('base64')}`;

    // Call Replicate Whisper API
    const output = await replicate.run(
      "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c",
      {
        input: {
          audio: audioDataUrl,
          batch_size: 64,
          language: "en", // Optional: specify language
          timestamp: "chunk", // Optional: include timestamps
          diarisation: false, // Optional: speaker identification
        }
      }
    );

    // Extract text from output (Whisper returns an object with 'text' property)
    const outputData = output as any;
    const transcribedText = typeof outputData === 'string' ? outputData : outputData?.text || '';

    // Log for analytics

    return NextResponse.json({
      success: true,
      text: transcribedText,
      confidence: outputData?.confidence || null,
      language: outputData?.language || 'en',
      timestamp: new Date().toISOString()
    });

  } catch (error) {

    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for checking service status
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      service: 'Voice Search API',
      status: 'operational',
      model: 'incredibly-fast-whisper',
      supportedFormats: ['wav', 'mp3', 'webm', 'ogg'],
      maxFileSize: '25MB',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Service check failed' },
      { status: 500 }
    );
  }
}