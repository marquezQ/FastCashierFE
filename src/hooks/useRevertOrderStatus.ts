import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/api/orderService';
import { ORDER_STATUS_LABELS } from '@/constants/order.constants';
import { getApiErrorMessage } from '@/utils/error-handlers';
import { toast } from 'sonner';

export const useRevertOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number) => orderService.revertOrderStatus(orderId),
        onSuccess: (order) => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
            queryClient.invalidateQueries({ queryKey: ['kitchen-history'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['cashier-session-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
            toast.success(`Estado retrocedido a ${ORDER_STATUS_LABELS[order.orderStatus]}`);
        },
        onError: (error: unknown) => {
            toast.error(
                getApiErrorMessage(error, 'Error al retroceder el estado de la orden')
            );
        },
    });
};
