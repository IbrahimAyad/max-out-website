import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = [
    {
      id: "NVY-SUIT-001",
      sku: "NVY-SUIT-001",
      name: "Navy Blue Classic Suit",
      price: 599.99,
      images: ["/images/suits/navy-classic.jpg"],
      category: "suits" as const,
      stock: {
        "36R": 10,
        "38R": 15,
        "40R": 20,
        "42R": 18,
        "44R": 12,
        "46R": 8
      },
      variants: [
        { size: "36R", stock: 10 },
        { size: "38R", stock: 15 },
        { size: "40R", stock: 20 },
        { size: "42R", stock: 18 },
        { size: "44R", stock: 12 },
        { size: "46R", stock: 8 }
      ]
    },
    {
      id: "CHR-SUIT-002",
      sku: "CHR-SUIT-002",
      name: "Charcoal Grey Business Suit",
      price: 649.99,
      images: ["/images/suits/charcoal-business.jpg"],
      category: "suits" as const,
      stock: {
        "38R": 12,
        "40R": 18,
        "42R": 15,
        "44R": 10
      },
      variants: [
        { size: "38R", stock: 12 },
        { size: "40R", stock: 18 },
        { size: "42R", stock: 15 },
        { size: "44R", stock: 10 }
      ]
    },
    {
      id: "GRY-SUIT-003",
      sku: "GRY-SUIT-003",
      name: "Light Grey Summer Suit",
      price: 549.99,
      images: ["/images/suits/light-grey-summer.jpg"],
      category: "suits" as const,
      stock: {
        "36R": 8,
        "38R": 12,
        "40R": 14,
        "42R": 10
      },
      variants: [
        { size: "36R", stock: 8 },
        { size: "38R", stock: 12 },
        { size: "40R", stock: 14 },
        { size: "42R", stock: 10 }
      ]
    },
    {
      id: "BLK-TUX-001",
      sku: "BLK-TUX-001",
      name: "Black Peak Lapel Tuxedo",
      price: 899.99,
      images: ["/images/tuxedos/black-peak-lapel.jpg"],
      category: "suits" as const,
      stock: {
        "38R": 6,
        "40R": 10,
        "42R": 12,
        "44R": 8,
        "46R": 5
      },
      variants: [
        { size: "38R", stock: 6 },
        { size: "40R", stock: 10 },
        { size: "42R", stock: 12 },
        { size: "44R", stock: 8 },
        { size: "46R", stock: 5 }
      ]
    }
  ];

  const product = products.find(p => p.id === id);
  
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  return NextResponse.json(product);
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