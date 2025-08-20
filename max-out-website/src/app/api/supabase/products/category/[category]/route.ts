import { NextRequest, NextResponse } from 'next/server'
import { getProductsByCategory } from '@/lib/supabase/products'
import { ProductSearchParams } from '@/lib/supabase/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params
    const { searchParams } = new URL(request.url)

    // Parse search parameters
    const searchParamsObj: Omit<ProductSearchParams, 'filters'> & { filters?: Omit<ProductSearchParams['filters'], 'categories'> } = {}

    // Pagination
    if (searchParams.get('page')) {
      searchParamsObj.page = parseInt(searchParams.get('page')!)
    }
    if (searchParams.get('limit')) {
      searchParamsObj.limit = parseInt(searchParams.get('limit')!)
    }

    // Sorting
    const sortField = searchParams.get('sortField') as 'name' | 'base_price' | 'created_at' | 'trending_score'
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc'
    if (sortField && sortDirection) {
      searchParamsObj.sort = { field: sortField, direction: sortDirection }
    }

    // Filters (excluding categories since we're filtering by category in the route)
    searchParamsObj.filters = {}

    if (searchParams.get('search')) {
      searchParamsObj.filters.search = searchParams.get('search')!
    }

    if (searchParams.get('brands')) {
      searchParamsObj.filters.brands = searchParams.get('brands')!.split(',')
    }

    if (searchParams.get('colors')) {
      searchParamsObj.filters.colors = searchParams.get('colors')!.split(',')
    }

    if (searchParams.get('occasions')) {
      searchParamsObj.filters.occasions = searchParams.get('occasions')!.split(',')
    }

    if (searchParams.get('tags')) {
      searchParamsObj.filters.tags = searchParams.get('tags')!.split(',')
    }

    if (searchParams.get('minPrice') && searchParams.get('maxPrice')) {
      searchParamsObj.filters.priceRange = {
        min: parseInt(searchParams.get('minPrice')!),
        max: parseInt(searchParams.get('maxPrice')!)
      }
    }

    if (searchParams.get('inStock')) {
      searchParamsObj.filters.inStock = searchParams.get('inStock') === 'true'
    }

    if (searchParams.get('featured')) {
      searchParamsObj.filters.featured = searchParams.get('featured') === 'true'
    }

    const result = await getProductsByCategory(decodeURIComponent(category), searchParamsObj)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}