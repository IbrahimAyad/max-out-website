import { NextRequest, NextResponse } from 'next/server'
import { fetchProductsWithImages, Product } from '@/lib/shared/supabase-products'
import { toEnhancedProduct } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || searchParams.get('meta')

    // Handle metadata requests
    switch (action) {
      case 'categories':
        // Return actual categories from products
        const categoryResult = await fetchProductsWithImages({ limit: 1000 })
        const categories = [...new Set(categoryResult.data.map(p => p.category).filter(Boolean))]
        return NextResponse.json({ 
          categories: categories.length > 0 ? categories : ['Suits', 'Shirts', 'Accessories', 'Shoes', 'Vest & Tie Sets'] 
        })
      
      case 'vendors':
      case 'brands':
        // Return actual vendors from products
        const vendorResult = await fetchProductsWithImages({ limit: 1000 })
        const vendors = [...new Set(vendorResult.data.map(p => p.vendor).filter(Boolean))]
        return NextResponse.json({ 
          vendors: vendors.length > 0 ? vendors : ['KCT', 'Premium Collection', 'Classic Line'] 
        })
      
      case 'colors':
        // Extract colors from product names and tags
        const colorResult = await fetchProductsWithImages({ limit: 1000 })
        const colorSet = new Set<string>()
        const commonColors = ['Black', 'Navy', 'Gray', 'Grey', 'Blue', 'White', 'Burgundy', 'Brown', 'Green', 'Red', 'Silver', 'Gold', 'Purple', 'Pink']
        
        colorResult.data.forEach(product => {
          // Check product name for colors
          commonColors.forEach(color => {
            if (product.name.toLowerCase().includes(color.toLowerCase())) {
              colorSet.add(color)
            }
          })
          
          // Check tags for colors
          if (product.tags) {
            product.tags.forEach(tag => {
              commonColors.forEach(color => {
                if (tag.toLowerCase().includes(color.toLowerCase())) {
                  colorSet.add(color)
                }
              })
            })
          }
        })
        
        return NextResponse.json({ 
          colors: Array.from(colorSet).slice(0, 10) // Limit to top 10 colors
        })
      
      case 'priceRange':
      case 'price-range':
        // Get actual price range from products
        const priceResult = await fetchProductsWithImages({ limit: 1000 })
        const prices = priceResult.data
          .map(p => p.base_price)
          .filter(p => p && p > 0)
          .map(p => p / 100) // Convert from cents to dollars
        
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000
        
        return NextResponse.json({ 
          priceRange: { 
            min: Math.floor(minPrice), 
            max: Math.ceil(maxPrice) 
          } 
        })
      
      default:
        // Fetch products using shared service
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24
        const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
        const category = searchParams.get('category')
        const vendor = searchParams.get('vendor')
        const color = searchParams.get('color')
        const minPriceFilter = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
        const maxPriceFilter = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
        const search = searchParams.get('search')
        const sortBy = searchParams.get('sortBy') || 'created_at'
        const sortOrder = searchParams.get('sortOrder') || 'desc'
        
        // First, fetch ALL products to get accurate count
        const allResult = await fetchProductsWithImages({ 
          limit: 1000, // Fetch all products for filtering/counting
          offset: 0,
          category: category || undefined,
          status: 'active'
        })
        
        if (!allResult.success) {
          throw new Error(allResult.error || 'Failed to fetch products')
        }
        
        // Convert all products to enhanced format
        let allEnhancedProducts = allResult.data.map(product => {
          return toEnhancedProduct({
            ...product,
            product_variants: product.variants || [],
            product_images: product.images || []
          } as any)
        })
        
        // Apply search filter if provided
        if (search) {
          const searchLower = search.toLowerCase()
          allEnhancedProducts = allEnhancedProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower) ||
            p.category?.toLowerCase().includes(searchLower) ||
            p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          )
        }

        // Apply category filter
        if (category && category !== 'all') {
          allEnhancedProducts = allEnhancedProducts.filter(p => 
            p.category?.toLowerCase() === category.toLowerCase()
          )
        }

        // Apply vendor filter
        if (vendor && vendor !== 'all') {
          allEnhancedProducts = allEnhancedProducts.filter(p => 
            p.vendor?.toLowerCase() === vendor.toLowerCase()
          )
        }

        // Apply color filter
        if (color && color !== 'all') {
          const colorLower = color.toLowerCase()
          allEnhancedProducts = allEnhancedProducts.filter(p => 
            p.name.toLowerCase().includes(colorLower) ||
            p.tags?.some(tag => tag.toLowerCase().includes(colorLower)) ||
            p.description?.toLowerCase().includes(colorLower)
          )
        }

        // Apply price range filter
        if (minPriceFilter !== undefined || maxPriceFilter !== undefined) {
          allEnhancedProducts = allEnhancedProducts.filter(p => {
            const price = p.price / 100 // Convert from cents to dollars
            const withinMin = minPriceFilter === undefined || price >= minPriceFilter
            const withinMax = maxPriceFilter === undefined || price <= maxPriceFilter
            return withinMin && withinMax
          })
        }
        
        // Sort all products
        allEnhancedProducts.sort((a, b) => {
          let aVal, bVal
          
          switch(sortBy) {
            case 'price':
              aVal = a.price
              bVal = b.price
              break
            case 'title':
            case 'name':
              aVal = a.name.toLowerCase()
              bVal = b.name.toLowerCase()
              break
            case 'created_at':
            default:
              aVal = new Date(a.createdAt || 0).getTime()
              bVal = new Date(b.createdAt || 0).getTime()
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
        
        // Calculate pagination from sorted/filtered results
        const totalCount = allEnhancedProducts.length
        const totalPages = Math.ceil(totalCount / limit)
        const offset = (page - 1) * limit
        const paginatedProducts = allEnhancedProducts.slice(offset, offset + limit)
        
        // Return paginated response with correct total count
        return NextResponse.json({
          products: paginatedProducts,
          totalCount: totalCount,
          currentPage: page,
          totalPages: totalPages
        })
    }
  } catch (error) {
    console.error('Error in products API:', error)
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || searchParams.get('meta')
    
    // Return appropriate empty structure based on what was requested
    switch (action) {
      case 'categories':
        return NextResponse.json({ categories: [] })
      case 'vendors':
        return NextResponse.json({ vendors: [] })
      case 'colors':
        return NextResponse.json({ colors: [] })
      case 'priceRange':
      case 'price-range':
        return NextResponse.json({ priceRange: { min: 0, max: 1000 } })
      default:
        return NextResponse.json({
          products: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          error: error instanceof Error ? error.message : 'Failed to fetch products'
        })
    }
  }
}