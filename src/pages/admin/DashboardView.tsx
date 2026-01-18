import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { StatsGrid } from '@/components/Dashboard/StatsGrid';

interface DashboardViewProps {
  userName: string;
}

export const DashboardView = ({ userName }: DashboardViewProps) => {
  return (
    <div className="space-y-6">
      <DashboardHeader userName={userName} />
      <StatsGrid />
    </div>
  );
};