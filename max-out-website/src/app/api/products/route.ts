import { NextRequest, NextResponse } from 'next/server';
import { APIResponse, ProductsResponse } from '@/lib/types/api';
import { Product } from '@/lib/types';

const ADMIN_API_KEY = process.env.ADMIN_BACKEND_API_KEY || '0aadbad87424e6f468ce0fdb18d1462fd03b133c1b48fd805fab14d4bac3bd75';

export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<ProductsResponse>>> {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  const products: Product[] = [
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
  ].filter(product => !category || category === 'all' || product.category === category);
  
  const response: APIResponse<ProductsResponse> = {
    success: true,
    data: {
      products,
      total: products.length,
      hasMore: false,
      filters: {
        availableColors: ['navy', 'charcoal', 'light-grey', 'black'],
        availableSizes: ['36R', '38R', '40R', '42R', '44R', '46R'],
        priceRange: { min: 549.99, max: 899.99 }
      }
    },
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(response);
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