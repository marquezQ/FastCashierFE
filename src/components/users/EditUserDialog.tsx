import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditUserForm } from './EditUserForm';
import type { UpdateUserFormValues } from '@/schemas/auth.schema';
import type { UserWithRole } from '@/types/auth';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole | null;
  onSubmit: (data: UpdateUserFormValues) => Promise<void>;
  isLoading: boolean;
}

export const EditUserDialog = ({
  open,
  onOpenChange,
  user,
  onSubmit,
  isLoading,
}: EditUserDialogProps) => {
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

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica la información del usuario {user.fullName}.
          </DialogDescription>
        </DialogHeader>

        <EditUserForm
          user={user}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
