import { api } from './axiosConfig';
import type { DashboardMetricsResponse, CancellationAuditResponse, MetricsParams } from '../types/adminMetrics';

export const adminMetricsService = {
    getDashboardMetrics: async (params: MetricsParams): Promise<DashboardMetricsResponse> => {
        const { data } = await api.get<DashboardMetricsResponse>('/orders/metrics/dashboard', { params });
        return data;
    },

    getCancellations: async (params: MetricsParams): Promise<CancellationAuditResponse> => {
        const { data } = await api.get<CancellationAuditResponse>('/orders/metrics/cancellations', { params });
        return data;
    }
};
