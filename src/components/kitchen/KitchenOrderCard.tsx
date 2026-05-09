import { Clock, UtensilsCrossed, Package, AlertCircle, CheckCircle2, PlayCircle, Send, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTtsAudio } from '@/hooks/useTtsAudio';
import type { Order, OrderStatus } from '@/types/order';

interface KitchenOrderCardProps {
    order: Order;
    onAction: (orderId: number, nextStatus: OrderStatus | 'DELIVERED') => void;
}

export const KitchenOrderCard = ({ order, onAction }: KitchenOrderCardProps) => {
    const isNew = order.orderStatus === 'PENDING';
    const isPreparing = order.orderStatus === 'IN_PREPARATION';
    const isReady = order.orderStatus === 'READY';
    const { playOrderAudio } = useTtsAudio();

    // Calculate minutes wait from createdAt or completedDate if available
    const minutesWait = order.completedDate
        ? Math.floor((new Date(order.completedDate).getTime() - new Date(order.orderDate).getTime()) / 60000)
        : Math.floor((new Date().getTime() - new Date(order.orderDate).getTime()) / 60000);

    const orderTypeLabel = order.orderType === 'DINE_IN' ? 'Mesa' : 'Para llevar';
    const isDineIn = order.orderType === 'DINE_IN';
    const displayOrderNumber = order.orderNumber
        ? order.orderNumber.replace(/^ord-/i, '').toLowerCase()
        : '----';
    const customerName = order.customer?.trim();

    return (
        <div className={cn(
            "group relative flex flex-col bg-card rounded-lg border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden",
            isPreparing && "border-l-4 border-l-amber-500",
            isReady && "border-l-4 border-l-emerald-500",
            isNew && "border-l-4 border-l-orange-500"
        )}>
            {/* Card Header */}
            <div className="flex items-start justify-between gap-2 px-3 py-2.5 border-b border-border/30 bg-muted/5">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg md:text-xl font-black tracking-tighter text-foreground shrink-0">
                            #{displayOrderNumber}
                        </span>
                        <div className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded-md border shrink-0",
                            isDineIn
                                ? "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300"
                                : "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-300"
                        )}>
                            {isDineIn ? <UtensilsCrossed className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">{orderTypeLabel}</span>
                        </div>
                        {minutesWait > 20 && !isReady && (
                            <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
                        )}
                    </div>
                    {customerName && (
                        <span className="block text-[11px] md:text-xs font-semibold text-muted-foreground truncate max-w-48 leading-tight mt-0.5">
                            {customerName}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-background/80 px-2 py-1 rounded-full border border-border/40 shadow-sm shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{minutesWait} min</span>
                </div>
            </div>

            {/* Card Content */}
            <div className="px-3 py-2.5 space-y-3">
                {order.tableNumber && (
                    <div className="flex items-center justify-end">
                        <span className="text-xs md:text-sm font-bold text-muted-foreground">
                            Mesa <span className="text-foreground text-base md:text-lg">{order.tableNumber}</span>
                        </span>
                    </div>
                )}

                {/* Items List - Only for Detailed states */}
                {!isNew && (
                    <div className="space-y-1.5">
                        {order.details.map((detail) => (
                            <div key={detail.idDetail} className="flex items-start gap-2.5">
                                <div className="flex items-center justify-center min-w-9 h-7 px-1.5 rounded-md bg-orange-600 text-white font-black text-sm tabular-nums shadow-sm ring-2 ring-orange-500/25">
                                    x{detail.quantity}
                                </div>
                                <span className="text-sm md:text-[15px] font-bold text-foreground leading-snug pt-0.5">
                                    {detail.product.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Observations */}
                {!isNew && order.observations && (
                    <div className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                        <p className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-1">Observaciones:</p>
                        <p className="text-xs md:text-sm text-foreground/90 font-medium leading-snug italic">
                            "{order.observations}"
                        </p>
                    </div>
                )}

                {/* Compact Mode Meta */}
                {isNew && (
                    <p className="text-xs md:text-sm font-bold text-muted-foreground italic">
                        {order.details.length} productos en espera...
                    </p>
                )}
            </div>

            {/* Card Actions */}
            <div className="px-3 pb-3 pt-0">
                {isNew && (
                    <Button
                        onClick={() => onAction(order.idOrder, 'IN_PREPARATION')}
                        className="mx-auto flex min-w-40 items-center justify-center gap-2 px-5 font-black uppercase tracking-widest bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 h-10"
                    >
                        <PlayCircle className="h-4 w-4" />
                        Iniciar Prep.
                    </Button>
                )}

                {isPreparing && (
                    <Button
                        onClick={() => onAction(order.idOrder, 'READY')}
                        className="mx-auto flex min-w-40 items-center justify-center gap-2 px-5 font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 h-10"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Marcar Listo
                    </Button>
                )}

                {isReady && (
                    <div className="flex justify-center gap-2">
                        <Button
                            onClick={() => playOrderAudio(order.orderNumber ?? '----')}
                            variant="outline"
                            size="icon"
                            className="h-10 w-11 border-emerald-600/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/30 dark:hover:bg-emerald-500/10"
                            title="Repetir llamado"
                        >
                            <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => onAction(order.idOrder, 'DELIVERED')}
                            variant="secondary"
                            className="flex min-w-36 items-center justify-center gap-2 px-5 font-black uppercase tracking-widest border-2 h-10"
                        >
                            <Send className="h-4 w-4" />
                            Entregado
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
