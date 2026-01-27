import { useState, useEffect } from 'react';
import { Package, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from './ProductCard';
import type { ProductsGroupedByCategory } from '@/types/products';
import type { Product } from '@/types/products';

interface ProductsGridProps {
  categories: ProductsGroupedByCategory;
  onEditProduct?: (product: Product) => void;
  onCreateCategory?: () => void;
  onActiveTabChange?: (categoryId: number) => void;
}

export const ProductsGrid = ({
  categories,
  onEditProduct,
  onCreateCategory,
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
      <div className="flex items-center justify-between mb-6">
        <TabsList className="flex-1 justify-start overflow-x-auto h-10 overflow-y-hidden">
          {categories.map((category) => (
            <TabsTrigger
              key={category.idCategory}
              value={category.idCategory.toString()}
              className="flex items-center gap-2"
            >
              <Package className="size-4" />
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.productCount}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        {onCreateCategory && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateCategory}
            className="ml-4 shrink-0"
          >
            <Plus className="size-4 mr-2" />
            Nueva Categoría
          </Button>
        )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {category.products.map((product) => (
                <ProductCard
                  key={product.idProduct}
                  product={product}
                  onEdit={onEditProduct}
                />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
