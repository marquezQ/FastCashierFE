import { useQuery } from '@tanstack/react-query';
import { cashierSessionService } from '../api/cashierSessionService';

export const useSessionStatistics = (sessionId?: number) => {
    return useQuery({
        queryKey: ['cashier-session-statistics', sessionId],
        queryFn: () => cashierSessionService.getSessionStatistics(sessionId!),
        enabled: !!sessionId,
        refetchInterval: 60000, // Refetch every minute to keep stats fresh
    });
};
