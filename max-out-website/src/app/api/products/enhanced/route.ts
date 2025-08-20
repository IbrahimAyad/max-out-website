// Enhanced Products API - CRUD operations for enhanced products system
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EnhancedProduct, EnhancedProductQuery } from '@/lib/products/enhanced/types';

// GET - Search/List Enhanced Products
export async function GET(request: NextRequest) {
  try {
    // Check environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { 
          error: 'Database configuration error',
          message: 'Supabase environment variables are not configured',
          hint: 'Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel'
        },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    
    if (!supabase) {
      console.error('Failed to create Supabase client');
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          message: 'Could not establish connection to database'
        },
        { status: 503 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const query: EnhancedProductQuery = {
      category: searchParams.get('category') || undefined,
      subcategory: searchParams.get('subcategory') || undefined,
      brand: searchParams.get('brand') || undefined,
      status: (searchParams.get('status') as EnhancedProduct['status']) || 'active',
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      trending: searchParams.get('trending') === 'true' ? true : undefined,
      customizable: searchParams.get('customizable') === 'true' ? true : undefined,
      in_stock_only: searchParams.get('in_stock_only') === 'true' ? true : undefined,
      search_term: searchParams.get('search') || undefined,
      sort_by: (searchParams.get('sort_by') as EnhancedProductQuery['sort_by']) || 'created_at',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    };

    // Build Supabase query - use the actual table, not the view
    let supabaseQuery = supabase
      .from('products_enhanced')
      .select('*');

    // Apply filters
    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }

    if (query.category) {
      supabaseQuery = supabaseQuery.eq('category', query.category);
    }

    if (query.subcategory) {
      supabaseQuery = supabaseQuery.eq('subcategory', query.subcategory);
    }

    if (query.brand) {
      supabaseQuery = supabaseQuery.eq('brand', query.brand);
    }

    if (query.min_price) {
      supabaseQuery = supabaseQuery.gte('base_price', query.min_price);
    }

    if (query.max_price) {
      supabaseQuery = supabaseQuery.lte('base_price', query.max_price);
    }

    if (query.featured !== undefined) {
      supabaseQuery = supabaseQuery.eq('featured', query.featured);
    }

    if (query.trending !== undefined) {
      supabaseQuery = supabaseQuery.eq('trending', query.trending);
    }

    if (query.in_stock_only) {
      supabaseQuery = supabaseQuery.gt('total_available_stock', 0);
    }

    if (query.search_term) {
      supabaseQuery = supabaseQuery.textSearch('name,description,short_description', query.search_term);
    }

    if (query.pricing_tier) {
      const tiers = Array.isArray(query.pricing_tier) ? query.pricing_tier : [query.pricing_tier];
      // This would need a more complex query for JSONB pricing_tiers
      // For now, we'll skip this filter and implement it post-query
    }

    // Apply sorting
    const sortColumn = query.sort_by === 'price' ? 'base_price' : 
                      query.sort_by === 'popularity' ? 'total_available_stock' :
                      query.sort_by || 'created_at';
    
    supabaseQuery = supabaseQuery.order(sortColumn, { ascending: query.sort_order === 'asc' });

    // Apply pagination
    const limit = Math.min(query.limit || 20, 100); // Max 100 items per page
    const offset = ((query.page || 1) - 1) * limit;
    
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    // Execute query with count
    const { data: products, error, count } = await supabaseQuery;

    if (error) {
      console.error('Supabase error fetching enhanced products:', error);
      
      // Check for common RLS errors
      if (error.message?.includes('permission denied')) {
        return NextResponse.json(
          { 
            error: 'Database permission error', 
            details: 'RLS policies need to be configured for products_enhanced table',
            hint: 'Run: CREATE POLICY "Allow public read" ON products_enhanced FOR SELECT USING (true);'
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = query.page || 1;

    return NextResponse.json({
      products: products || [],
      pagination: {
        current_page: currentPage,
        total_pages: totalPages,
        total_count: totalCount,
        limit,
        has_more: currentPage < totalPages
      },
      query_info: {
        filters_applied: Object.keys(query).filter(key => query[key as keyof EnhancedProductQuery] !== undefined).length,
        sort_by: query.sort_by,
        sort_order: query.sort_order
      }
    });

  } catch (error) {
    console.error('Unexpected error in enhanced products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create New Enhanced Product
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'base_price', 'description', 'images'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', missing_fields: missingFields },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Set default values
    const productData = {
      ...body,
      status: body.status || 'draft',
      featured: body.featured || false,
      trending: body.trending || false,
      currency: 'USD',
      inventory: body.inventory || {
        total_stock: 0,
        reserved_stock: 0,
        available_stock: 0,
        low_stock_threshold: 5,
        allow_backorder: false
      },
      seo: body.seo || {},
      metadata: body.metadata || {}
    };

    // Insert into database
    const { data: product, error } = await supabase
      .from('products_enhanced')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating enhanced product:', error);
      
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      product,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error creating enhanced product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}