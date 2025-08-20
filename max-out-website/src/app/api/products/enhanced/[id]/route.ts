// Enhanced Product Individual API - CRUD operations for single enhanced product
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Get Single Enhanced Product by ID or Slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Determine if ID is a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    // Query by appropriate field - use the actual table, not the view
    let query = supabase
      .from('products_enhanced')
      .select('*');
    
    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }
    
    // Only show active products for public API (unless admin)
    // TODO: Add auth check for admin access to draft/archived products
    query = query.eq('status', 'active');
    
    const { data: product, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching enhanced product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product', details: error.message },
        { status: 500 }
      );
    }

    // Fetch related data
    const [variantsResult, reviewsResult, collectionsResult] = await Promise.all([
      // Get product variants
      supabase
        .from('product_variants_enhanced')
        .select('*')
        .eq('product_id', product.id)
        .eq('active', true)
        .order('variant_type')
        .order('variant_value'),
      
      // Get recent reviews
      supabase
        .from('product_reviews_enhanced')
        .select('*')
        .eq('product_id', product.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Get collections this product belongs to
      supabase
        .from('collection_products_enhanced')
        .select(`
          collection_id,
          sort_order,
          product_collections_enhanced:collection_id (
            id,
            name,
            slug,
            collection_type
          )
        `)
        .eq('product_id', product.id)
    ]);

    // Combine all data
    const enhancedProduct = {
      ...product,
      variants: variantsResult.data || [],
      reviews: reviewsResult.data || [],
      collections: collectionsResult.data?.map(cp => cp.product_collections_enhanced) || [],
      // Add computed fields
      computed: {
        in_stock: (product.total_available_stock || 0) > 0,
        low_stock: (product.total_available_stock || 0) <= (product.inventory?.low_stock_threshold || 5),
        current_pricing_tier: product.pricing_tiers ? 
          (Array.isArray(product.pricing_tiers) ? 
            product.pricing_tiers.find((tier: any) => 
              product.base_price >= tier.price_range.min && 
              product.base_price <= tier.price_range.max
            ) : null
          ) : null
      }
    };

    return NextResponse.json({
      product: enhancedProduct
    });

  } catch (error) {
    console.error('Unexpected error fetching enhanced product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update Enhanced Product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();
    
    // Remove read-only fields
    const { id: _, created_at, updated_at, ...updateData } = body;
    
    // Determine if ID is UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let query = supabase
      .from('products_enhanced')
      .update(updateData)
      .select();
    
    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }
    
    const { data: product, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
      
      console.error('Error updating enhanced product:', error);
      return NextResponse.json(
        { error: 'Failed to update product', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      product,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Unexpected error updating enhanced product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete Enhanced Product (soft delete by setting status to archived)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Determine if ID is UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    // Soft delete by setting status to archived
    let query = supabase
      .from('products_enhanced')
      .update({ status: 'archived' })
      .select('id, name, slug');
    
    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }
    
    const { data: product, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      console.error('Error deleting enhanced product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product archived successfully',
      product: product
    });

  } catch (error) {
    console.error('Unexpected error deleting enhanced product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}