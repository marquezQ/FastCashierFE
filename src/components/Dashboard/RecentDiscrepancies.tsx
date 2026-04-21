import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatPrice } from '@/utils/product.utils';
import { cn } from '@/lib/utils';
import type { DashboardSummaryResponse } from '@/types/dashboard.types';

export const RecentDiscrepancies = ({ data }: { data: DashboardSummaryResponse['recentDiscrepancies'] }) => {
  return (
    <Card className="rounded-3xl border-border/40 p-6 shadow-sm dark:border-border/60 bg-card/60 dark:bg-card backdrop-blur-md h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h2 className="admin-h2 text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Descuadres Recientes
        </h2>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2 shrink-0">Últimos 7d</span>
      </div>

      <div className="flex-1 min-h-37.5 overflow-y-auto pr-1 space-y-3 pb-2 select-none flex flex-col" style={{ scrollbarWidth: 'thin' }}>
        {data.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-8 p-4 text-center">
            <AlertCircle className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="text-sm font-bold tracking-tight">No existen descuadres recientes</p>
            <p className="text-[10px] uppercase font-black tracking-widest mt-1">Todo está al día</p>
          </div>
        )}
        {data.map((item, idx) => {
          const isNegative = item.difference < 0;
          return (
            <div key={item.idSession || idx} className="flex items-center justify-between rounded-2xl bg-secondary/30 p-3 border border-border/30">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full shrink-0",
                  isNegative ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
                )}>
                  {isNegative ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm tracking-tight truncate">{item.cashierName}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {new Date(item.date).toLocaleString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <p className={cn(
                  "font-black tabular-nums tracking-tight",
                  isNegative ? "text-destructive" : "text-emerald-500"
                )}>
                  {isNegative ? '-' : '+'}{formatPrice(Math.abs(item.difference).toString())}
                </p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-0.5">
                  {item.status}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
