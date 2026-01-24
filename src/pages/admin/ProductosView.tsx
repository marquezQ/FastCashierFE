import { useProducts } from '@/hooks/useProducts';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Product } from '@/types/products';

export const ProductosView = () => {
  const { data: categories, isLoading, error } = useProducts();

  const handleCreate = () => {
    // TODO: Abrir modal/dialog para crear producto
    console.log('Crear nuevo producto');
  };

  const handleEdit = (product: Product) => {
    // TODO: Abrir modal/dialog para editar producto
    console.log('Editar producto:', product);
  };

  const handleDelete = (product: Product) => {
    // TODO: Abrir modal/dialog para eliminar producto
    console.log('Eliminar producto:', product);
  };

  const handleToggleStatus = (product: Product) => {
    // TODO: Implementar toggle de estado
    console.log('Toggle estado producto:', product);
  };

  const handleCreateCategory = () => {
    // TODO: Abrir modal/dialog para crear categoría
    console.log('Crear nueva categoría');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de productos e inventario
          </p>
        </div>
        <Button size="lg" onClick={handleCreate}>
          <Plus className="size-5" />
          Nuevo Producto
        </Button>
      </div>

      {isLoading && (
        <div className="rounded-lg border bg-card p-16 text-center">
          <p className="text-lg text-muted-foreground">Cargando productos...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border bg-card p-16 text-center">
          <p className="text-lg text-destructive">Error al cargar los productos</p>
        </div>
      )}

      {!isLoading && !error && categories && (
        <ProductsGrid
          categories={categories}
          onEditProduct={handleEdit}
          onDeleteProduct={handleDelete}
          onToggleProductStatus={handleToggleStatus}
          onCreateCategory={handleCreateCategory}
        />
      )}
    </div>
  );
};