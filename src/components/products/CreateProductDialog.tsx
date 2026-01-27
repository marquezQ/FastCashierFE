import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateProductForm } from './CreateProductForm';
import type { CreateProductFormValues } from '@/schemas/products.schema';
import type { Category } from '@/types/products';

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  defaultCategoryId?: number;
  onSubmit: (data: CreateProductFormValues) => Promise<void>;
  isLoading: boolean;
}

export const CreateProductDialog = ({
  open,
  onOpenChange,
  categories,
  defaultCategoryId,
  onSubmit,
  isLoading,
}: CreateProductDialogProps) => {
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo producto en el sistema.
          </DialogDescription>
        </DialogHeader>

        <CreateProductForm
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
