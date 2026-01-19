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
    <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50">
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center gap-4">
        <div className={`rounded-lg ${iconBgColor} p-3 shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};