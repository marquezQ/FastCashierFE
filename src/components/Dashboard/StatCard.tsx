import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor: string;
  iconBgColor: string;
}

export const StatCard = ({ icon: Icon, label, value, iconColor, iconBgColor }: StatCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className={`rounded-full ${iconBgColor} p-3`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};