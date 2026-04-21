import { api } from './axiosConfig';
import type { ReportPeriod, SalesReportResponse } from '../types/reports';

export const reportService = {
  getSalesReport: async (period: ReportPeriod): Promise<SalesReportResponse> => {
    const { data } = await api.get<SalesReportResponse>('/reports/sales', {
      params: { period },
    });
    return data;
  },
};
