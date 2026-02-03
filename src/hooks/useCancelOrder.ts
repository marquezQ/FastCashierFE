import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/api/orderService';
import { toast } from 'sonner';

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, reason }: { orderId: number; reason?: string }) =>
            orderService.cancelOrder(orderId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders', 'session'] });
            toast.success('Pedido anulado correctamente');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error al anular el pedido');
        },
    });
};
