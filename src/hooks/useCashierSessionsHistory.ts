import { useQuery } from '@tanstack/react-query';
import { cashierSessionService } from '@/api/cashierSessionService';

interface UseCashierSessionsHistoryParams {
    period?: '7d' | 'this-month';
    startDate?: string;
    endDate?: string;
}

export const useCashierSessionsHistory = (params: UseCashierSessionsHistoryParams, enabled = true) => {
    return useQuery({
        queryKey: ['cashier-sessions-history', params],
        queryFn: () => cashierSessionService.getSessionsHistory(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled
    });
};
