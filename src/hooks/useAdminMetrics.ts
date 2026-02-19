import { useQuery } from '@tanstack/react-query';
import { adminMetricsService } from '@/api/adminMetricsService';
import type { MetricsParams } from '@/types/adminMetrics';

export const useAdminMetrics = (params: MetricsParams, enabled = true) => {
    return useQuery({
        queryKey: ['admin-metrics', params],
        queryFn: () => adminMetricsService.getDashboardMetrics(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled
    });
};

export const useAdminCancellations = (params: MetricsParams, enabled = true) => {
    return useQuery({
        queryKey: ['admin-cancellations', params],
        queryFn: () => adminMetricsService.getCancellations(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled
    });
};
