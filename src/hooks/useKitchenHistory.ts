import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/api/orderService';

export const useKitchenHistory = () => {
    return useQuery({
        queryKey: ['kitchen-history'],
        queryFn: orderService.getKitchenHistory,
        refetchInterval: 30000, // Refetch history every 30 seconds
    });
};
