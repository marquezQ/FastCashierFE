import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ordersSocket } from '@/lib/socket';
import { toast } from 'sonner';
import type { Order } from '@/types/order';

export const useKitchenSocket = () => {
    const queryClient = useQueryClient();

    const handleNewOrder = useCallback((order: Order) => {
        // Invalidate the kitchen orders query to fetch the latest data
        queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });

        // Optionally show a notification
        toast.success(`Nuevo Pedido #${order.orderNumber}`, {
            description: `Cliente: ${order.customer || 'Mostrador'}`,
        });
    }, [queryClient]);

    const handleOrderStatusUpdated = useCallback(() => {
        // Invalidate the kitchen orders query when a status changes
        queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    }, [queryClient]);

    useEffect(() => {
        // Setup event listeners
        ordersSocket.on('new_order', handleNewOrder);
        ordersSocket.on('order_status_updated', handleOrderStatusUpdated);

        // Error handling
        ordersSocket.on('connect_error', (error) => {
            // Solo loguear si no es un error de desconexión manual
            if (ordersSocket.active) {
                console.error('Socket connection error:', error);
            }
        });

        return () => {
            // Cleanup on unmount
            ordersSocket.off('new_order', handleNewOrder);
            ordersSocket.off('order_status_updated', handleOrderStatusUpdated);
        };
    }, [handleNewOrder, handleOrderStatusUpdated]);

    return {
        isConnected: ordersSocket.connected,
    };
};
