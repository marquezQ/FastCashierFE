import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10 dark:bg-primary/20',
  className
}: StatCardProps) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/40 dark:border-white/6 bg-card/60 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Sutil brillo de fondo */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="relative flex items-center flex-row gap-5">
        <div className={cn("shrink-0 inline-flex rounded-2xl p-3.5 shadow-sm ring-1 ring-border/5 group-hover:scale-105 transition-transform duration-300", iconBgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="admin-label-sm text-muted-foreground mb-0.5">{label}</h3>
          <p className="text-3xl font-black tracking-tight tabular-nums text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};