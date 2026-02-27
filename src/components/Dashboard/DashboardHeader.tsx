import { formatDateLong } from '@/utils/date.utils';

interface DashboardHeaderProps {
  userName: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const currentDate = formatDateLong();

  return (
    <div className="mb-8">
      <h1 className="admin-h1 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        Bienvenido, {userName}
      </h1>
      <p className="admin-subtitle capitalize">
        {currentDate}
      </p>
      <div className="mt-4 h-1 w-full bg-linear-to-r from-primary to-primary/30 rounded-full" />
    </div>
  );
};