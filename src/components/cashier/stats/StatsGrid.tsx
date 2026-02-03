import { ArrowUpRight, Activity, DollarSign, Wallet, QrCode, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/utils/product.utils';
import type { SessionStatistics } from '@/types/cashierSession';

interface StatsGridProps {
    stats: SessionStatistics;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-1">
            <Card className="relative overflow-hidden group border-emerald-100/50 dark:border-emerald-900/20 bg-card shadow hover:shadow-emerald-500/5 transition-all duration-300 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4 space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Ventas Totales</CardTitle>
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                    <div className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-400 mb-0.5 tabular-nums">
                        {formatPrice(stats.totalSales.toString())}
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground/70 flex items-center gap-1.5 uppercase tracking-wide">
                        <Activity className="h-2.5 w-2.5 text-emerald-500/70" />
                        {stats.totalOrders} Pedidos
                    </p>
                    <DollarSign className="absolute -bottom-2 -right-2 h-16 w-16 text-emerald-500/3 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden group border-emerald-100/50 dark:border-emerald-900/20 bg-card shadow hover:shadow-emerald-500/5 transition-all duration-300 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4 space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Efectivo Turno</CardTitle>
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg">
                        <Wallet className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                    <div className="text-2xl font-black tracking-tight text-foreground mb-0.5 tabular-nums">
                        {formatPrice(stats.expectedCash.toString())}
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-wide">
                        Base: {formatPrice(stats.initialAmount.toString())}
                    </p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden group border-emerald-100/50 dark:border-emerald-900/20 bg-card shadow hover:shadow-emerald-500/5 transition-all duration-300 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4 space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Cobro QR</CardTitle>
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg">
                        <QrCode className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                    <div className="text-2xl font-black tracking-tight text-emerald-600 mb-0.5 tabular-nums">
                        {formatPrice(stats.expectedQr.toString())}
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-wide">
                        {stats.qrOrderCount} Ventas Digitales
                    </p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden group border-emerald-100/50 dark:border-emerald-900/20 bg-card shadow hover:shadow-emerald-500/5 transition-all duration-300 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4 space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Ticket Promedio</CardTitle>
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg">
                        <BarChart3 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                    <div className="text-2xl font-black tracking-tight text-foreground mb-0.5 tabular-nums">
                        {formatPrice(stats.averageOrderValue.toString())}
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-wide">
                        Eficiencia x venta
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
