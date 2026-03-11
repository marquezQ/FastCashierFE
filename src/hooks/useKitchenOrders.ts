import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/api/orderService';

export const useKitchenOrders = () => {
    return useQuery({
        queryKey: ['kitchen-orders'],
        queryFn: orderService.getKitchenOrders,
    });
};
