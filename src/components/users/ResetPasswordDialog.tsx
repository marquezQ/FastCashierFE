import { KeyRound, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { UserWithRole } from '@/types/auth';

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithRole | null;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const ResetPasswordDialog = ({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading,
}: ResetPasswordDialogProps) => {
  const handleClose = (isOpen: boolean) => {
    if (!isOpen && !isLoading) {
      onOpenChange(false);
    } else if (isOpen) {
      onOpenChange(true);
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // El hook de la mutación ya muestra el mensaje de error
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <DialogTitle>Restablecer contraseña</DialogTitle>
              <DialogDescription className="mt-1">
                El usuario deberá iniciar sesión nuevamente
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Se restablecerá la contraseña de{' '}
            <span className="font-semibold text-foreground">{user.fullName}</span> (
            <span className="font-medium">{user.email}</span>).
          </p>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">
              Contraseña temporal
            </p>
            <p className="mt-1 font-mono text-2xl font-black tracking-widest text-amber-700 dark:text-amber-300">
              123456
            </p>
            <p className="mt-2 text-xs font-medium text-amber-700/80 dark:text-amber-300/80">
              Compártela con el usuario para que pueda volver a ingresar al sistema.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-amber-600 text-white hover:bg-amber-700 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Restableciendo...
              </>
            ) : (
              'Restablecer contraseña'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
