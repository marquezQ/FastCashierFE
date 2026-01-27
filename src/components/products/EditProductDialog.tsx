import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditProductForm } from './EditProductForm';
import type { UpdateProductFormValues } from '@/schemas/products.schema';
import type { Category, Product } from '@/types/products';

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  onSubmit: (data: UpdateProductFormValues) => Promise<void>;
  isLoading: boolean;
}

export const EditProductDialog = ({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
  isLoading,
}: EditProductDialogProps) => {
  const handleClose = (isOpen: boolean) => {
    if (!isOpen && !isLoading) {
      onOpenChange(false);
    } else if (isOpen) {
      onOpenChange(true);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Modifica la información del producto. Solo se enviarán los campos que hayas cambiado.
          </DialogDescription>
        </DialogHeader>

        <EditProductForm
          product={product}
          categories={categories}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
