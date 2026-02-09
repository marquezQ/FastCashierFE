import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/api/orderService';

export const useKitchenOrders = () => {
    return useQuery({
        queryKey: ['kitchen-orders'],
        queryFn: orderService.getKitchenOrders,
        refetchInterval: 10000, // Refetch every 10 seconds for real-time updates cambiar cuando haya websockets
    });
};
