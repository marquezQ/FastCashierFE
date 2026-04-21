import { useQuery } from '@tanstack/react-query';
import { reportService } from '../api/reportService';
import type { ReportPeriod } from '../types/reports';

export const useSalesReport = (period: ReportPeriod) => {
  return useQuery({
    queryKey: ['salesReport', period],
    queryFn: () => reportService.getSalesReport(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
