import { Loader2, Undo2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useRevertOrderStatus } from '@/hooks/useRevertOrderStatus';
import { getRevertTargetStatus, ORDER_STATUS_LABELS } from '@/constants/order.constants';
import { cn } from '@/lib/utils';
import type { Order } from '@/types/order';

interface RevertOrderStatusButtonProps {
  order: Order;
  className?: string;
}

export const RevertOrderStatusButton = ({
  order,
  className,
}: RevertOrderStatusButtonProps) => {
  const { mutate, isPending } = useRevertOrderStatus();
  const targetStatus = getRevertTargetStatus(order.orderStatus);

  if (!targetStatus) return null;

  const orderLabel = order.orderNumber?.split('-').pop() ?? '----';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          title="Retroceder estado"
          aria-label="Retroceder estado"
          className={cn(
            'border-amber-500/30 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300',
            className
          )}
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Undo2 />}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
            <Undo2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Retroceder estado
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-2 text-sm text-muted-foreground">
              <p>
                El pedido <span className="font-bold text-foreground">#{orderLabel}</span> volverá
                de{' '}
                <span className="font-bold text-foreground">
                  {ORDER_STATUS_LABELS[order.orderStatus]}
                </span>{' '}
                a{' '}
                <span className="font-bold text-foreground">
                  {ORDER_STATUS_LABELS[targetStatus]}
                </span>
                .
              </p>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 font-medium text-amber-700 dark:text-amber-300">
                Esta acción actualizará el estado en cocina y tableros en tiempo real.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 gap-3">
          <AlertDialogCancel className="h-11 rounded-xl border-2 font-bold">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate(order.idOrder)}
            disabled={isPending}
            className="h-11 rounded-xl bg-amber-600 font-bold text-white hover:bg-amber-700"
          >
            {isPending ? 'Retrocediendo...' : 'Sí, retroceder'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
