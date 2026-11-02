import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ordersSocket } from '@/lib/socket';
import { toast } from 'sonner';
import type { Order } from '@/types/order';

export const useKitchenSocket = () => {
    const queryClient = useQueryClient();

    const invalidateOrderQueries = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
        queryClient.invalidateQueries({ queryKey: ['kitchen-history'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['cashier-session-statistics'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    }, [queryClient]);

    const handleNewOrder = useCallback((order: Order) => {
        // Refresca todas las vistas afectadas por un nuevo pedido
        invalidateOrderQueries();

        // Optionally show a notification
        toast.success(`Nuevo Pedido #${order.orderNumber}`, {
            description: `Cliente: ${order.customer || 'Mostrador'}`,
        });
    }, [invalidateOrderQueries]);

    const handleOrderStatusUpdated = useCallback((order: Order) => {
        // Refresca tablero, historial y vistas que dependen del estado
        invalidateOrderQueries();

        // If the order was cancelled, show a high-priority alert
        if (order.orderStatus === 'CANCELLED') {
            toast.error(`¡PEDIDO CANCELADO! #${order.orderNumber}`, {
                description: `Cliente: ${order.customer || 'Mostrador'}. Detener preparación inmediatamente.`,
                duration: 8000,
            });
        }
    }, [invalidateOrderQueries]);

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
