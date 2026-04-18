import { TrendingUp, Vault, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/product.utils';
import type { CashierSession } from '@/types/cashierSession';

interface SessionHeaderProps {
    session: CashierSession;
    netSales: number;
    totalExpected: number;
    openingTime: string;
    closingTime: string;
    isClosed: boolean;
}

export const SessionHeader = ({
    session,
    netSales,
    totalExpected,
    openingTime,
    closingTime,
    isClosed
}: SessionHeaderProps) => {
    return (
        <div className="flex-1 flex flex-wrap items-center justify-between gap-4 @md:gap-6 w-full">
            {/* Usuario & ID */}
            <div className="flex flex-col min-w-35">
                <span className="font-black text-foreground text-base @md:text-lg tracking-tight truncate leading-tight">
                    {session.user?.fullName || 'Cajero'}
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="admin-label-sm bg-muted/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                        # {session.idSession}
                    </span>
                    <span className="admin-label-sm text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/10 whitespace-nowrap">
                        {session.orderCount} pedidos
                    </span>
                </div>
            </div>

            {/* Métricas Principales */}
            <div className="flex flex-wrap items-center gap-4 @md:gap-x-8">
                {/* Ventas Netas */}
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 @md:h-11 @md:w-11 rounded-xl @md:rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/5 shrink-0">
                        <TrendingUp className="h-5 w-5 @md:h-6 @md:w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg @md:text-xl font-black text-foreground leading-none">{formatPrice(netSales.toString())}</span>
                        <span className="admin-label-sm tracking-tight mt-1 whitespace-nowrap">Ventas del Turno</span>
                    </div>
                </div>

                {/* Total en Caja (Esperado) */}
                <div className="flex items-center gap-3 relative">
                    <div className="absolute -left-2 @md:-left-4 top-1/2 -translate-y-1/2 h-6 @md:h-8 w-px bg-border/50 hidden @sm:block" />
                    <div className="h-10 w-10 @md:h-11 @md:w-11 rounded-xl @md:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/5 shrink-0">
                        <Vault className="h-5 w-5 @md:h-6 @md:w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg @md:text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{formatPrice(totalExpected.toString())}</span>
                        <span className="admin-label-sm tracking-tight mt-1 whitespace-nowrap">Total en Caja</span>
                    </div>
                </div>
            </div>

            {/* Estado & Tiempo */}
            <div className="flex flex-col items-start @sm:items-end gap-1.5 min-w-32.5">
                <div className="flex items-center gap-1.5 @md:gap-2 text-[11px] @md:text-xs font-black text-foreground/70 whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{openingTime} — {closingTime}</span>
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        "admin-label-sm px-3 h-6 border-0 shadow-none rounded-full whitespace-nowrap",
                        isClosed ? "bg-slate-200/50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400" : "bg-emerald-500/10 text-emerald-600 shadow-sm shadow-emerald-500/5"
                    )}
                >
                    {isClosed ? 'Turno Cerrado' : 'Abierto Ahora'}
                </Badge>
            </div>
        </div>
    );
};
