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
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
            {/* Usuario & ID */}
            <div className="md:col-span-3 flex flex-col">
                <span className="font-black text-foreground text-lg tracking-tight truncate leading-tight">
                    {session.user?.fullName || 'Cajero'}
                </span>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/30 px-2 py-0.5 rounded-md">
                        # {session.idSession}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/10">
                        {session.orderCount} pedidos
                    </span>
                </div>
            </div>

            {/* Métricas Principales */}
            <div className="md:col-span-6 flex flex-wrap items-center gap-x-12 gap-y-4">
                {/* Ventas Netas */}
                <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/5">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-foreground leading-none">{formatPrice(netSales.toString())}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight mt-1">Ventas del Turno</span>
                    </div>
                </div>

                {/* Total en Caja (Esperado) */}
                <div className="flex items-center gap-4 relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 h-8 w-px bg-border/50 hidden lg:block" />
                    <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/5">
                        <Vault className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{formatPrice(totalExpected.toString())}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight mt-1">Total en Caja</span>
                    </div>
                </div>
            </div>

            {/* Estado & Tiempo */}
            <div className="md:col-span-3 flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-xs font-black text-foreground/70">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{openingTime} — {closingTime}</span>
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] font-black uppercase px-3 h-6 border-0 shadow-none rounded-full",
                        isClosed ? "bg-slate-200/50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400" : "bg-emerald-500/10 text-emerald-600 shadow-sm shadow-emerald-500/5"
                    )}
                >
                    {isClosed ? 'Turno Cerrado' : 'Abierto Ahora'}
                </Badge>
            </div>
        </div>
    );
};
