import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateUserForm } from './CreateUserForm';
import type { CreateUserFormValues } from '@/schemas/auth.schema';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserFormValues) => Promise<void>;
  isLoading: boolean;
}

export const CreateUserDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateUserDialogProps) => {
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
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>

        <CreateUserForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
