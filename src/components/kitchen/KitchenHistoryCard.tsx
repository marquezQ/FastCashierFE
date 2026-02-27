import { Clock, Users, Package, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types/order';

interface KitchenHistoryCardProps {
    order: Order;
}

export const KitchenHistoryCard = ({ order }: KitchenHistoryCardProps) => {
    const isCancelled = order.orderStatus === 'CANCELLED';
    const isDelivered = order.orderStatus === 'DELIVERED';

    const minutesWait = order.completedDate && order.orderDate
        ? Math.floor((new Date(order.completedDate).getTime() - new Date(order.orderDate).getTime()) / 60000)
        : 0;

    const orderTypeLabel = order.orderType === 'DINE_IN' ? 'Mesa' : 'Para llevar';
    const isDineIn = order.orderType === 'DINE_IN';

    return (
        <div className={cn(
            "group relative flex flex-col bg-card rounded-xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden",
            isCancelled && "border-l-4 border-l-red-500 opacity-80",
            isDelivered && "border-l-4 border-l-emerald-500"
        )}>
            {/* Card Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30 bg-muted/5">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tighter text-foreground">
                        #{order.orderNumber?.split('-').pop() ?? '----'}
                    </span>
                    <span className="text-sm font-bold text-muted-foreground truncate max-w-30">
                        - {order.customer || 'Cliente General'}
                    </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    {isDelivered ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200/50 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Entregado
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200/50 text-[10px] font-black uppercase tracking-widest">
                            <XCircle className="h-3 w-3 mr-1" /> Cancelado
                        </Badge>
                    )}
                    {isDelivered && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                            <Clock className="h-2.5 w-2.5" />
                            <span>{minutesWait} min</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-4">
                {/* Type & Table */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/5 text-primary border border-primary/10">
                        {isDineIn ? <Users className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                        <span className="text-xs font-black uppercase tracking-wider">{orderTypeLabel}</span>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                    {order.details.map((detail) => (
                        <div key={detail.idDetail} className="flex items-start gap-3">
                            <div className="flex items-center justify-center min-w-6 h-6 rounded bg-muted text-muted-foreground font-bold text-xs">
                                {detail.quantity}x
                            </div>
                            <span className="text-sm font-medium text-foreground leading-tight pt-0.5">
                                {detail.product.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Observations */}
                {order.observations && (
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Obs:</p>
                        <p className="text-xs text-foreground/70 italic">
                            "{order.observations}"
                        </p>
                    </div>
                )}
            </div>

            {/* Footer - Date */}
            <div className="p-4 pt-0 mt-auto flex justify-between items-center text-[10px] font-bold text-muted-foreground/60">
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                <span>{new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};
