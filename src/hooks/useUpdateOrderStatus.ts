import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/api/orderService';
import type { OrderStatus } from '@/types/order';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus }) => {
            if (!user?.idUser) throw new Error('Usuario no autenticado');
            return orderService.updateOrderStatus(orderId, status, user.idUser);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
            queryClient.invalidateQueries({ queryKey: ['kitchen-history'] });
            toast.success('Estado de orden actualizado');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Error al actualizar el estado de la orden');
        }
    });
};
