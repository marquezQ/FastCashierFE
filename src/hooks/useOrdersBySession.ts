import { useQuery } from '@tanstack/react-query';
import { orderService } from '../api/orderService';

export const useOrdersBySession = (sessionId: number | undefined) => {
    return useQuery({
        queryKey: ['orders', 'session', sessionId],
        queryFn: () => orderService.getOrdersBySession(sessionId!),
        enabled: !!sessionId,
        staleTime: 1000 * 60, // 1 minute
    });
};
