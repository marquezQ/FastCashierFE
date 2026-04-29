import { useQuery } from '@tanstack/react-query';
import { reportService } from '../api/reportService';
import type { ReportPeriod } from '../types/reports';

export const usePaymentMethodsReport = (period: ReportPeriod) => {
  return useQuery({
    queryKey: ['paymentMethodsReport', period],
    queryFn: () => reportService.getPaymentMethodsReport(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
