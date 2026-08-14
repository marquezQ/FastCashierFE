import { useState } from 'react';
import { Package } from 'lucide-react';
import type { ProductsGroupedByCategory } from '@/types/products';
import type { Product } from '@/types/products';
import { MobileProductCard } from './MobileProductCard';
import { cn } from '@/lib/utils';

interface MobileProductsGridProps {
  categories: ProductsGroupedByCategory;
  onEditProduct?: (product: Product) => void;
  onActiveTabChange?: (categoryId: number) => void;
}

/**
 * Mobile-optimized products grid for the admin.
 * - Full-width horizontal scrollable category chips
 * - 2-column compact product grid
 * - Tap-to-edit cards with density-first design
 */
export const MobileProductsGrid = ({
  categories,
  onEditProduct,
  onActiveTabChange,
}: MobileProductsGridProps) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    categories[0]?.idCategory.toString() || ''
  );

  const activeTab = selectedTab || (categories[0]?.idCategory.toString() || '');

  const handleSelectCategory = (categoryId: string) => {
    setSelectedTab(categoryId);
    onActiveTabChange?.(Number(categoryId));
  };

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-10 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No hay categorías disponibles</p>
      </div>
    );
  }

  const activeCategory = categories.find((c) => c.idCategory.toString() === activeTab);
  const products = activeCategory?.products || [];

  return (
    <div className="flex flex-col">
      {/* Category Chips — Full-width horizontal scroll */}
      <div className="relative shrink-0 px-1 pt-1 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.idCategory}
              onClick={() => handleSelectCategory(category.idCategory.toString())}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold',
                'border transition-all duration-200 active:scale-95 whitespace-nowrap',
                activeTab === category.idCategory.toString()
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                  : 'bg-muted/50 text-muted-foreground border-border/40 hover:bg-muted'
              )}
            >
              <Package className="h-3 w-3 shrink-0" />
              <span>{category.name}</span>
              <span className="opacity-70">· {category.productCount}</span>
            </button>
          ))}
        </div>
        {/* Fade hint on the right edge — indicates there are more categories */}
        <div className="pointer-events-none absolute inset-y-1 right-0 w-8 bg-linear-to-l from-background to-transparent" />
      </div>

      {/* Product Grid — 2 columns */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <Package className="h-10 w-10 mb-3 opacity-20" />
          <p className="text-sm">No hay productos en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {products.map((product) => (
            <MobileProductCard
              key={product.idProduct}
              product={product}
              onEdit={onEditProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};