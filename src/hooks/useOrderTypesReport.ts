import { useQuery } from '@tanstack/react-query';
import { reportService } from '../api/reportService';
import type { ReportPeriod } from '../types/reports';

export const useOrderTypesReport = (period: ReportPeriod) => {
  return useQuery({
    queryKey: ['orderTypesReport', period],
    queryFn: () => reportService.getOrderTypesReport(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
