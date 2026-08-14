import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from './ProductCard';
import type { ProductsGroupedByCategory } from '@/types/products';
import type { Product } from '@/types/products';

interface ProductsGridProps {
  categories: ProductsGroupedByCategory;
  onEditProduct?: (product: Product) => void;
  onActiveTabChange?: (categoryId: number) => void;
}

export const ProductsGrid = ({
  categories,
  onEditProduct,
  onActiveTabChange,
}: ProductsGridProps) => {
  const [activeTab, setActiveTab] = useState(categories[0]?.idCategory.toString() || '');

  // Actualizar tab activo cuando cambien las categorías
  useEffect(() => {
    if (categories.length > 0 && !categories.find((c) => c.idCategory.toString() === activeTab)) {
      setActiveTab(categories[0].idCategory.toString());
    }
  }, [categories, activeTab]);

  // Notificar cambio de tab activo
  useEffect(() => {
    if (activeTab && onActiveTabChange) {
      onActiveTabChange(Number(activeTab));
    }
  }, [activeTab, onActiveTabChange]);

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-16 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No hay categorías disponibles</p>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-full flex-1 min-w-0">
          <div className="overflow-x-auto overflow-y-hidden">
            <TabsList className="inline-flex! justify-start! h-10 w-max! p-1!">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.idCategory}
                  value={category.idCategory.toString()}
                  className="flex-none! flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Package className="size-4 shrink-0" />
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.length > 12 ? `${category.name.substring(0, 12)}...` : category.name}</span>
                  <Badge variant="secondary" className="ml-1 shrink-0">
                    {category.productCount}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
      </div>

      {categories.map((category) => (
        <TabsContent
          key={category.idCategory}
          value={category.idCategory.toString()}
          className="mt-0"
        >
          {category.products.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/50 p-16 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-2">No hay productos en esta categoría</p>
              <p className="text-sm text-muted-foreground">
                Agrega productos para comenzar a gestionar tu inventario
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.idProduct}
                    product={product}
                    onEdit={onEditProduct}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
