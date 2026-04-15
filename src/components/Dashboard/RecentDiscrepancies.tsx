import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatPrice } from '@/utils/product.utils';
import { cn } from '@/lib/utils';

// Mocked data para discrepancias recientes en cierres de caja
const DISCREPANCIES = [
  { id: 1, cashier: 'Ana Lopez', date: 'Hoy, 14:30', diff: -25.50, status: 'faltante' },
  { id: 2, cashier: 'Carlos Ruiz', date: 'Ayer, 21:00', diff: 15.00, status: 'sobrante' },
  { id: 3, cashier: 'Ana Lopez', date: 'Lun, 14:15', diff: -5.00, status: 'faltante' },
];

export const RecentDiscrepancies = () => {
  return (
    <Card className="rounded-3xl border-border/40 p-6 shadow-sm dark:border-white/6 bg-card/60 backdrop-blur-md h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h2 className="admin-h2 text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Descuadres Recientes
        </h2>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2 shrink-0">Últimos 7d</span>
      </div>
      
      <div className="flex-1 min-h-[150px] overflow-y-auto pr-1 space-y-3 pb-2 select-none" style={{ scrollbarWidth: 'thin' }}>
        {DISCREPANCIES.map((item) => {
          const isNegative = item.diff < 0;
          return (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-secondary/30 p-3 border border-border/30">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full shrink-0",
                  isNegative ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-500"
                )}>
                  {isNegative ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm tracking-tight truncate">{item.cashier}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.date}</p>
                </div>
              </div>
              
              <div className="text-right shrink-0 ml-2">
                <p className={cn(
                  "font-black tabular-nums tracking-tight",
                  isNegative ? "text-destructive" : "text-emerald-500"
                )}>
                  {isNegative ? '' : '+'}{formatPrice(item.diff.toString())}
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
