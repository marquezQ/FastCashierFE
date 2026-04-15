import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import type { DashboardSummaryResponse } from '@/types/dashboard.types';

export const OperationalPerformance = ({ data }: { data: DashboardSummaryResponse['performance7d'] }) => {
  const isFaster = data.kitchenTimeTrendPercentage < 0;
  const trendText = isFaster ? 'más rápido' : 'más lento';
  const trendColor = isFaster ? 'text-emerald-500' : 'text-destructive';
  const trendValue = Math.abs(data.kitchenTimeTrendPercentage);

  return (
    <Card className="rounded-3xl border-border/40 p-6 shadow-sm dark:border-border/60 bg-card/60 dark:bg-card backdrop-blur-md flex flex-col justify-between h-full">
      <div>
        <div className="mb-6 flex items-center justify-between shrink-0">
          <h2 className="admin-h2 text-foreground">Rendimiento Operativo</h2>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2 shrink-0">Últimos 7d</span>
        </div>

        {/* Tiempo Cocina */}
        <div className="mb-8 rounded-2xl bg-secondary/50 p-4 border border-border/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-orange-500/10 p-2">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="admin-label-sm">Tiempo Promedio Cocina</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black tabular-nums tracking-tight">{data.avgKitchenTimeMinutes}</span>
                <span className="text-sm font-bold text-muted-foreground">min</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-2">
            El tiempo de preparación es <span className={`${trendColor} font-bold`}>{trendValue}% {trendText}</span> que la semana pasada.
          </p>
        </div>
      </div>

      {/* Canales de Venta */}
      <div>
        <h3 className="admin-label-sm mb-4">Distribución por Canales</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold">Salón (Dine-in)</span>
              <span className="text-sm font-black tabular-nums">{data.channels.dineInPercentage}%</span>
            </div>
            <Progress value={data.channels.dineInPercentage} className="h-2 bg-primary/10" indicatorClassName="bg-primary" />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold">Para Llevar (Takeout)</span>
              <span className="text-sm font-black tabular-nums">{data.channels.takeoutPercentage}%</span>
            </div>
            <Progress value={data.channels.takeoutPercentage} className="h-2 bg-amber-500/10" indicatorClassName="bg-amber-500" />
          </div>
        </div>
      </div>
    </Card>
  );
};
