import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial stock level
      const data = JSON.stringify({
        productId: id,
        stock: Math.floor(Math.random() * 50) + 10,
        lastUpdated: new Date().toISOString()
      });
      
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      
      // For now, just send one update and close
      // In production, this would be a real-time subscription
      setTimeout(() => {
        controller.close();
      }, 1000);
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}