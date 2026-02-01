import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../api/orderService';
import { useCashierStore } from '../store/useCashierStore';
import { toast } from 'sonner';

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const { clearCart } = useCashierStore();

    return useMutation({
        mutationFn: orderService.createOrder,
        onSuccess: (data) => {
            toast.success(`Pedido ${data.orderNumber} creado exitosamente`);

            // Clear the cart in the store
            clearCart();

            // Invalidate relevant queries if any (e.g., order history, session stats)
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['session-stats'] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Error al procesar el pedido';
            toast.error(errorMessage);
            console.error('Error creating order:', error);
        },
    });
};
