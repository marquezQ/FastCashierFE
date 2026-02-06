import { Clock, Users, Package, AlertCircle, CheckCircle2, PlayCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface KitchenOrderItem {
    id: string;
    name: string;
    quantity: number;
}

export interface KitchenOrder {
    id: string;
    orderNumber: string;
    type: 'Mesa' | 'Para llevar';
    tableNumber?: string;
    items: KitchenOrderItem[];
    observations?: string;
    createdAt: string;
    status: 'new' | 'preparing' | 'ready';
    minutesWait: number;
}

interface KitchenOrderCardProps {
    order: KitchenOrder;
    onAction: (orderId: string, nextStatus: KitchenOrder['status'] | 'delivered') => void;
}

export const KitchenOrderCard = ({ order, onAction }: KitchenOrderCardProps) => {
    const isNew = order.status === 'new';
    const isPreparing = order.status === 'preparing';
    const isReady = order.status === 'ready';

    return (
        <div className={cn(
            "group relative flex flex-col bg-card rounded-xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden",
            isPreparing && "border-l-4 border-l-amber-500",
            isReady && "border-l-4 border-l-emerald-500",
            isNew && "border-l-4 border-l-orange-500"
        )}>
            {/* Card Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30 bg-muted/5">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tighter text-foreground">
                        #{order.orderNumber}
                    </span>
                    {order.minutesWait > 20 && !isReady && (
                        <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-background/80 px-2 py-1 rounded-full border border-border/40 shadow-sm">
                    <Clock className="h-3 w-3" />
                    <span>{order.minutesWait} min</span>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-4">
                {/* Type & Table */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/5 text-primary border border-primary/10">
                        {order.type === 'Mesa' ? <Users className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                        <span className="text-xs font-black uppercase tracking-wider">{order.type}</span>
                    </div>
                    {order.tableNumber && (
                        <span className="text-sm font-bold text-muted-foreground">
                            Mesa <span className="text-foreground text-lg">{order.tableNumber}</span>
                        </span>
                    )}
                </div>

                {/* Items List - Only for Detailed states */}
                {!isNew && (
                    <div className="space-y-2.5">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-start gap-3">
                                <div className="flex items-center justify-center min-w-7 h-7 rounded-lg bg-orange-500 text-white font-black text-sm shadow-sm ring-2 ring-orange-500/20">
                                    {item.quantity}
                                </div>
                                <span className="text-[15px] font-bold text-foreground leading-tight pt-0.5">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Observations */}
                {!isNew && order.observations && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-1">Observaciones:</p>
                        <p className="text-sm text-foreground/90 font-medium leading-relaxed italic">
                            "{order.observations}"
                        </p>
                    </div>
                )}

                {/* Compact Mode Meta */}
                {isNew && (
                    <p className="text-sm font-bold text-muted-foreground italic">
                        {order.items.length} productos en espera...
                    </p>
                )}
            </div>

            {/* Card Actions */}
            <div className="p-4 pt-0">
                {isNew && (
                    <Button
                        onClick={() => onAction(order.id, 'preparing')}
                        className="w-full flex items-center justify-center gap-2 font-black uppercase tracking-widest bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 h-11"
                    >
                        <PlayCircle className="h-5 w-5" />
                        Iniciar Prep.
                    </Button>
                )}

                {isPreparing && (
                    <Button
                        onClick={() => onAction(order.id, 'ready')}
                        className="w-full flex items-center justify-center gap-2 font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 h-11"
                    >
                        <CheckCircle2 className="h-5 w-5" />
                        Marcar Listo
                    </Button>
                )}

                {isReady && (
                    <Button
                        onClick={() => onAction(order.id, 'delivered')}
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2 font-black uppercase tracking-widest border-2 h-11"
                    >
                        <Send className="h-5 w-5" />
                        Entregado
                    </Button>
                )}
            </div>
        </div>
    );
};
