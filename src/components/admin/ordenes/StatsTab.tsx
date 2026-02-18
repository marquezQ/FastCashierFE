import {
    Clock,
    TrendingUp,
    UtensilsCrossed,
    Timer,
    ArrowUpRight,
    ShoppingBag,
    Store
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatPrice } from '@/utils/product.utils';
import { cn } from '@/lib/utils';

// Hardcoded data for UI demonstration
const KITCHEN_STATS = {
    avgPrepTime: '12:45',
    totalOrders: 156
};

const DAILY_METRICS = {
    totalSales: '4850.50',
    avgTicket: '31.10',
    totalOrders: 156,
};

const TOP_PRODUCTS = [
    {
        name: 'Broaster 2 presas',
        sales: 863,
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'Gaseosa 2L',
        sales: 500,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'Hamburguesa Gigante',
        sales: 420,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'Pipoas / Nuggets',
        sales: 310,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'Vaso Personal',
        sales: 280,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=200'
    }
];

const CHANNEL_DISTRIBUTION = [
    { name: 'Para llevar', percentage: 65, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Consumo local', percentage: 35, icon: UtensilsCrossed, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
];

export const StatsTab = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Row: Quick Metrics (3 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-0">
                <MetricCard
                    title="Ventas"
                    value={formatPrice(DAILY_METRICS.totalSales)}
                    icon={TrendingUp}
                    color="text-emerald-600"
                />
                <MetricCard
                    title="Ticket Promedio"
                    value={formatPrice(DAILY_METRICS.avgTicket)}
                    icon={ArrowUpRight}
                    color="text-blue-600"
                />
                <MetricCard
                    title="Total Pedidos"
                    value={DAILY_METRICS.totalOrders.toString()}
                    icon={Store}
                    color="text-violet-600"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
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
                            <span className="text-5xl font-black tracking-tighter text-foreground leading-none">
                                {KITCHEN_STATS.avgPrepTime}
                            </span>
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest leading-loose mt-1">
                                minutos orden promedio
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Channel Distribution - 50% */}
                <div className="flex flex-col gap-4">
                    {CHANNEL_DISTRIBUTION.map((channel) => (
                        <Card key={channel.name} className="p-6 border-2 border-border bg-card/50 shadow-sm rounded-3xl group hover:border-primary/30 transition-all duration-300 flex-1 flex items-center">
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
                                <div className="flex flex-col items-end gap-2 flex-1 max-w-30">
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
                        <div className="hidden md:grid grid-cols-[60px_1fr_80px_120px] px-6 mb-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            <span>Pos</span>
                            <span>Producto</span>
                            <span className="text-center">Imagen</span>
                            <span className="text-right">Ventas</span>
                        </div>

                        {TOP_PRODUCTS.map((product, idx) => (
                            <div
                                key={product.name}
                                className="grid grid-cols-[40px_1fr_60px_80px] md:grid-cols-[60px_1fr_80px_120px] items-center gap-4 py-4 px-4 md:px-6 bg-background/40 border border-border/40 rounded-2xl group hover:bg-primary/5 hover:border-primary/20 transition-all duration-300"
                            >
                                {/* Position */}
                                <span className="text-xl font-black text-muted-foreground/40 group-hover:text-primary transition-colors italic tracking-tighter">
                                    #{idx + 1}
                                </span>

                                {/* Name */}
                                <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors truncate">
                                    {product.name}
                                </span>

                                {/* Image */}
                                <div className="flex justify-center">
                                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl overflow-hidden bg-muted border border-border/50 group-hover:border-primary/30 shadow-sm">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </div>

                                {/* Sales Units */}
                                <div className="text-right">
                                    <p className="text-lg md:text-xl font-black tracking-tighter text-foreground tabular-nums leading-none">
                                        {product.sales}
                                    </p>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">unidades</p>
                                </div>
                            </div>
                        ))}
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
    icon: any;
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
