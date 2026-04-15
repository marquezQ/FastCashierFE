import { api } from './axiosConfig';
import type { DashboardSummaryResponse } from '../types/dashboard.types';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const { data } = await api.get<DashboardSummaryResponse>('/dashboard/summary');
    return data;
  }
};
