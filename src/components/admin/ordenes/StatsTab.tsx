import {
    Clock,
    TrendingUp,
    UtensilsCrossed,
    Timer,
    ArrowUpRight,
    ShoppingBag,
    Store,
    Loader2,
    AlertCircle,
    type LucideIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatPrice } from '@/utils/product.utils';
import { cn } from '@/lib/utils';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';
import type { MetricsParams } from '@/types/adminMetrics';

interface StatsTabProps {
    params: MetricsParams;
}

export const StatsTab = ({ params }: StatsTabProps) => {
    const { data: metrics, isLoading, error } = useAdminMetrics(params);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Cargando métricas...</p>
            </div>
        );
    }

    if (error || !metrics) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-red-500/5 rounded-[2.5rem] border-2 border-dashed border-red-500/20 mx-4 md:mx-0">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-widest text-red-600">Error al cargar datos</p>
                    <p className="text-xs font-bold text-muted-foreground mt-1">Por favor, intenta refrescar la página</p>
                </div>
            </div>
        );
    }

    const { summary, kitchen, channels, topProducts } = metrics;

    const channelDist = [
        {
            name: 'Para llevar',
            percentage: Math.round((channels.takeout / (channels.dineIn + channels.takeout || 1)) * 100),
            icon: ShoppingBag,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            name: 'Consumo local',
            percentage: Math.round((channels.dineIn / (channels.dineIn + channels.takeout || 1)) * 100),
            icon: UtensilsCrossed,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Row: Quick Metrics (3 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    title="Ventas"
                    value={formatPrice(summary.totalSales.toString())}
                    icon={TrendingUp}
                    color="text-emerald-600"
                />
                <MetricCard
                    title="Ticket Promedio"
                    value={formatPrice(summary.averageTicket.toString())}
                    icon={ArrowUpRight}
                    color="text-blue-600"
                />
                <MetricCard
                    title="Total Pedidos"
                    value={summary.orderCount.toString()}
                    icon={Store}
                    color="text-violet-600"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kitchen Performance Card - 50% */}
                <Card className="p-6 border-2 border-border bg-card shadow-sm rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Clock className="h-32 w-32" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between min-h-40">
                        <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                            <Timer className="h-5 w-5 text-primary" />
                            Tiempo de Preparación
                        </h3>
                        <div className="mt-auto">
                            <span className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                                {Math.floor(kitchen.averageKitchenTime)}
                                <span className="text-4xl md:text-5xl ml-1 text-muted-foreground transition-all">
                                    :{(kitchen.averageKitchenTime % 1 * 60).toFixed(0).padStart(2, '0')}
                                </span>
                            </span>
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-loose mt-1">
                                minutos orden promedio
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Channel Distribution - 50% */}
                <div className="flex flex-col gap-4">
                    {channelDist.map((channel) => (
                        <Card key={channel.name} className="p-6 border-2 border-border bg-card shadow-sm rounded-3xl group hover:border-primary/30 transition-all duration-300 flex-1 flex items-center">
                            <div className="flex items-center justify-between w-full gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110", channel.bg, channel.color, "border-current/10")}>
                                        <channel.icon className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{channel.name}</p>
                                        <p className="text-3xl font-black tracking-tighter mt-0.5">{channel.percentage}%</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-1 min-w-15 max-w-30">
                                    <Progress value={channel.percentage} className={cn("h-2 w-full", channel.color)} />
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">Distribución</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Top Products - 100% width List */}
                <Card className="md:col-span-full p-8 border-2 border-border bg-card shadow-sm rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black tracking-tight">Productos Más Vendidos</h3>
                    </div>

                    <div className="space-y-4">
                        {/* Header Row for List */}
                        <div className="hidden md:grid grid-cols-[60px_1fr_120px] px-6 mb-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            <span>Pos</span>
                            <span>Producto</span>
                            <span className="text-right">Ventas</span>
                        </div>

                        {topProducts.length > 0 ? topProducts.map((product, idx) => (
                            <div
                                key={`${product.name}-${idx}`}
                                className="grid grid-cols-[24px_1fr_max-content] md:grid-cols-[60px_1fr_120px] items-center gap-2 md:gap-4 py-3 md:py-4 px-3 md:px-6 bg-background/40 border border-border/40 rounded-2xl group hover:bg-primary/5 hover:border-primary/20 transition-all duration-300"
                            >
                                {/* Position */}
                                <span className="text-xl font-black text-muted-foreground/40 group-hover:text-primary transition-colors italic tracking-tighter">
                                    #{idx + 1}
                                </span>

                                {/* Name */}
                                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                    <div className="h-9 w-9 md:h-12 md:w-12 rounded-xl bg-muted overflow-hidden border border-border/50 shrink-0">
                                        <img
                                            src={product.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'}
                                            alt={product.name}
                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-xs md:text-base text-foreground truncate group-hover:text-primary transition-colors">
                                            {product.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Sales Units */}
                                <div className="text-right">
                                    <p className="text-lg md:text-xl font-black tracking-tighter text-foreground tabular-nums leading-none">
                                        {product.totalQuantity}
                                    </p>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">unidades</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10">
                                <p className="text-sm font-bold text-muted-foreground">No hay productos vendidos en este periodo</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

interface MetricCardProps {
    title: string;
    value: string;
    subvalue?: string;
    icon: LucideIcon;
    color: string;
}

const MetricCard = ({ title, value, subvalue, icon: Icon, color }: MetricCardProps) => (
    <Card className="p-4 md:p-6 border-2 border-border bg-card shadow-sm rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all">
        <div className={cn("absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12", color)}>
            <Icon className="h-20 w-20" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">{value}</span>
            {subvalue && (
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">{subvalue}</span>
            )}
        </div>
    </Card>
);
