import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateProductDialog } from '@/components/products/CreateProductDialog';
import { EditProductDialog } from '@/components/products/EditProductDialog';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProductMutations';
import type { Product } from '@/types/products';
import type { CreateProductFormValues } from '@/schemas/products.schema';
import type { UpdateProductFormValues } from '@/schemas/products.schema';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const ProductosView = () => {
  const { data: categories, isLoading, error } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (data: CreateProductFormValues) => {
    try {
      if (!data.idCategory || data.idCategory < 1) {
        throw new Error('Debe seleccionar una categoría');
      }

      await createProduct.mutateAsync({
        name: data.name,
        price: data.price,
        description: data.description,
        idCategory: data.idCategory,
        image: data.image,
        isActive: data.isActive,
      });

      toast.success('Producto creado exitosamente');
      setIsCreateDialogOpen(false);
    } catch (error) {
      let errorMessage = 'Error al crear el producto';
      if (error instanceof AxiosError) {
        const data = error.response?.data as { message?: string | string[] };
        errorMessage = Array.isArray(data?.message)
          ? data.message[0]
          : data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmit = async (data: UpdateProductFormValues) => {
    try {
      if (!selectedProduct) return;

      // Preparar datos para enviar (solo campos que cambiaron)
      const updateData: UpdateProductFormValues = {};

      if (data.name !== undefined && data.name !== selectedProduct.name) {
        updateData.name = data.name;
      }
      if (data.price !== undefined && data.price !== parseFloat(selectedProduct.price)) {
        updateData.price = data.price;
      }
      if (data.description !== undefined && data.description !== selectedProduct.description) {
        updateData.description = data.description;
      }
      if (data.idCategory !== undefined) {
        updateData.idCategory = data.idCategory;
      }
      if (data.isActive !== undefined && data.isActive !== selectedProduct.isActive) {
        updateData.isActive = data.isActive;
      }
      if (data.imageUrl !== undefined) {
        updateData.imageUrl = data.imageUrl;
      }
      if (data.image !== undefined) {
        updateData.image = data.image;
      }

      await updateProduct.mutateAsync({
        id: selectedProduct.idProduct,
        data: updateData,
      });

      toast.success('Producto actualizado exitosamente');
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      let errorMessage = 'Error al actualizar el producto';
      if (error instanceof AxiosError) {
        const data = error.response?.data as { message?: string | string[] };
        errorMessage = Array.isArray(data?.message)
          ? data.message[0]
          : data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleCreateCategory = () => {
    // TODO: Abrir modal/dialog para crear categoría
    toast.info('Funcionalidad de crear categoría próximamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-h1">Productos</h1>
          <p className="admin-subtitle">
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
          onCreateCategory={handleCreateCategory}
          onActiveTabChange={setActiveCategoryId}
        />
      )}

      <CreateProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        categories={categories || []}
        defaultCategoryId={activeCategoryId}
        onSubmit={handleCreateSubmit}
        isLoading={createProduct.isPending}
      />

      {selectedProduct && (
        <EditProductDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setSelectedProduct(null);
            }
          }}
          product={selectedProduct}
          categories={categories || []}
          onSubmit={handleUpdateSubmit}
          isLoading={updateProduct.isPending}
        />
      )}
    </div>
  );
};