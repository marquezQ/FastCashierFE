import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { UserWithRole } from '@/types/auth';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole | null;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DeleteUserDialog = ({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading,
}: DeleteUserDialogProps) => {
  const handleClose = (isOpen: boolean) => {
    if (!isOpen && !isLoading) {
      onOpenChange(false);
    } else if (isOpen) {
      onOpenChange(true);
    }
  };

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Eliminar Usuario</DialogTitle>
              <DialogDescription className="mt-1">
                Esta acción no se puede deshacer
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <span className="font-semibold text-foreground">{user.fullName}</span> (
            <span className="font-medium">{user.email}</span>)?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta acción eliminará permanentemente el usuario del sistema.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar Usuario'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
