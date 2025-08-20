# Premium E-commerce Product Components

A collection of premium React components built for KCT Menswear's e-commerce platform, featuring modern design, smooth animations, and excellent mobile experience.

## Components Overview

### 1. SupabaseProductCard
Premium product card with hover effects, wishlist integration, and responsive design.

**Features:**
- 3:4 aspect ratio product images
- Dual image hover effects
- Wishlist button integration
- Quick add to cart
- Quick view functionality
- Stock status indicators
- Discount badges
- Color variant previews
- Occasion tags
- Premium animations and transitions

**Props:**
```typescript
interface SupabaseProductCardProps {
  product: EnhancedProduct;
  className?: string;
  showQuickAdd?: boolean;
  showWishlist?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  onQuickView?: (product: EnhancedProduct) => void;
}
```

**Usage:**
```tsx
import { SupabaseProductCard } from '@/components/products/SupabaseProductCard';

<SupabaseProductCard
  product={product}
  variant="default"
  onQuickView={handleQuickView}
  showQuickAdd={true}
  showWishlist={true}
/>
```

### 2. ProductFiltersPanel
Elegant sidebar filter panel with collapsible sections and advanced filtering options.

**Features:**
- Collapsible filter sections
- Multiple filter types (categories, price, colors, occasions, brands)
- Product count indicators
- Color swatches
- Price range filters
- Clear all functionality
- Responsive mobile design

**Props:**
```typescript
interface ProductFiltersPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
  productCounts?: {
    categories: Record<string, number>;
    colors: Record<string, number>;
    occasions: Record<string, number>;
    brands: Record<string, number>;
    totalProducts: number;
  };
}
```

**Usage:**
```tsx
import { ProductFiltersPanel } from '@/components/products/ProductFiltersPanel';

<ProductFiltersPanel
  filters={filters}
  onFiltersChange={setFilters}
  productCounts={productCounts}
/>
```

### 3. CategoryPills
Horizontal scrolling category pills with badge counts and premium styling.

**Features:**
- Horizontal scroll on mobile
- Category badges with product counts
- Three visual variants (default, minimal, premium)
- Smooth scroll buttons
- Active state indicators
- Mobile-optimized touch targets

**Props:**
```typescript
interface CategoryPillsProps {
  categories?: CategoryPill[];
  selectedCategory?: string;
  onCategorySelect: (category: string | null) => void;
  className?: string;
  showCounts?: boolean;
  variant?: 'default' | 'minimal' | 'premium';
}
```

**Usage:**
```tsx
import { CategoryPills } from '@/components/products/CategoryPills';

<CategoryPills
  selectedCategory={selectedCategory}
  onCategorySelect={setSelectedCategory}
  variant="premium"
  showCounts={true}
/>
```

### 4. ProductSkeleton
Beautiful loading skeletons with shimmer animations and gold accents.

**Features:**
- Multiple skeleton variants
- Shimmer animations with gold accent
- Responsive grid layouts
- Filter panel skeleton
- Category pills skeleton
- Customizable count and layout

**Props:**
```typescript
interface ProductSkeletonProps {
  variant?: 'default' | 'compact' | 'featured' | 'list';
  count?: number;
  className?: string;
  showFilters?: boolean;
}
```

**Usage:**
```tsx
import { ProductSkeleton } from '@/components/products/ProductSkeleton';

<ProductSkeleton
  variant="default"
  count={12}
  showFilters={true}
/>
```

## Design System

### Colors
- **Gold Primary**: `#D4AF37` - Used for primary actions, selected states, and accents
- **Gold Variants**: Extended palette from `gold-50` to `gold-900`
- **Neutral Grays**: Professional gray scale for text and backgrounds
- **Status Colors**: Red for out of stock, green for in stock

### Typography
- **Primary Font**: Inter (sans-serif)
- **Secondary Font**: Playfair Display (serif) for premium headings
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Animations
- **Hover Scale**: `scale-[1.02]` for subtle lift effect
- **Hover Translate**: `-translate-y-1` for depth
- **Transition Duration**: `300ms` to `700ms` for different elements
- **Easing**: `ease-out` for natural feel
- **Shimmer**: Custom shimmer animation for loading states

### Responsive Breakpoints
- **Mobile**: `<768px` - 2 columns for products
- **Tablet**: `768px-1024px` - 3 columns
- **Desktop**: `1024px-1280px` - 4 columns
- **Large Desktop**: `>1280px` - 5-6 columns for compact view

## Integration Guide

### 1. Supabase Types
Ensure you have the `EnhancedProduct` type from `/lib/supabase/types.ts`:

```typescript
import { EnhancedProduct, ProductFilters } from '@/lib/supabase/types';
```

### 2. Cart Integration
Components integrate with the existing cart system:

```typescript
import { useCart } from '@/lib/hooks/useCart';
const { addToCart } = useCart();
```

### 3. Wishlist Integration
Uses the existing wishlist system:

```typescript
import { WishlistButton } from './WishlistButton';
```

### 4. Price Formatting
Utilizes the format utility:

```typescript
import { formatPrice } from '@/lib/utils/format';
```

## Complete Shop Page Example

See `ShopPageExample.tsx` for a complete implementation showing how all components work together:

```tsx
import { ShopPageExample } from '@/components/products/ShopPageExample';

<ShopPageExample
  products={products}
  isLoading={isLoading}
/>
```

## Accessibility Features

- **ARIA Labels**: All interactive elements have proper ARIA labels
- **Keyboard Navigation**: Full keyboard support for all components
- **Screen Reader Support**: Semantic HTML and proper roles
- **Focus Management**: Visible focus indicators with gold accent
- **Color Contrast**: WCAG AA compliant color combinations

## Performance Optimizations

- **Image Optimization**: Next.js Image component with proper sizing
- **Lazy Loading**: Images load as needed
- **Virtual Scrolling**: Efficient handling of large product lists
- **Memoization**: Components prevent unnecessary re-renders
- **Bundle Splitting**: Components can be imported individually

## Mobile Optimizations

- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Natural swipe behavior for categories
- **Responsive Images**: Optimized sizes for different viewports
- **Fast Interactions**: 60fps animations on mobile devices
- **Progressive Enhancement**: Works without JavaScript

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

## Custom Styling

All components accept `className` props and use the `cn()` utility for class merging. You can customize styling by:

1. Passing custom classes via `className`
2. Extending Tailwind configuration
3. Using CSS variables for theme customization
4. Overriding component styles with higher specificity

## Testing

Components are built with testing in mind:

- **Unit Tests**: Test individual component behavior
- **Integration Tests**: Test component interactions
- **Visual Tests**: Screenshot testing for UI consistency
- **Accessibility Tests**: Automated a11y testing

## Migration from Existing Components

If migrating from existing product components:

1. Update import paths to new components
2. Replace old prop names with new interface
3. Update styling classes to use new design system
4. Test functionality with your product data
5. Update any custom styling or overrides