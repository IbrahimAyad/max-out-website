import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
  listName?: string;
}

export function ProductGrid({ products, columns = 3, listName = 'product_grid' }: ProductGridProps) {
  const gridCols = columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          listName={listName}
          index={index}
        />
      ))}
    </div>
  );
}