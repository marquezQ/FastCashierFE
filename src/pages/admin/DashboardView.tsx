import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { StatsGrid } from '@/components/Dashboard/StatsGrid';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import { Loader2 } from 'lucide-react';

interface DashboardViewProps {
  userName: string;
}

export const DashboardView = ({ userName }: DashboardViewProps) => {
  const { data, isLoading, isError } = useDashboardSummary();

  return (
    <div className="space-y-6">
      <DashboardHeader userName={userName} />
      
      {isLoading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError || !data ? (
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-destructive font-bold">Error al cargar los datos del dashboard.</p>
        </div>
      ) : (
        <StatsGrid data={data} />
      )}
    </div>
  );
};