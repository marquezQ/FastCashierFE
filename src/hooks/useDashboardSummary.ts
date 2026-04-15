import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/api/dashboardService';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardService.getSummary,
  });
};
