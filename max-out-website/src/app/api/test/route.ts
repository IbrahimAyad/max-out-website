import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  return NextResponse.json({ 
    message: 'POST test endpoint working',
    timestamp: new Date().toISOString(),
    receivedBody: body
  });
}