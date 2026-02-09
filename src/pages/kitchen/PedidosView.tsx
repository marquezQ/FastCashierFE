import { Sparkles, CookingPot, CheckCircle, Package, Loader2 } from 'lucide-react';
import { KitchenOrderColumn } from '@/components/kitchen/KitchenOrderColumn';
import { KitchenOrderCard } from '@/components/kitchen/KitchenOrderCard';
import { useKitchenOrders } from '@/hooks/useKitchenOrders';
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus';
import type { OrderStatus } from '@/types/order';

export const PedidosView = () => {
    const { data: orders = [], isLoading, error, refetch } = useKitchenOrders();
    const updateStatusMutation = useUpdateOrderStatus();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-destructive">
                <Package className="h-12 w-12 mb-4 opacity-20" />
                <p className="font-bold">Error al cargar las órdenes</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 text-sm underline"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // Filter orders by status
    const pendingOrders = orders.filter(o => o.orderStatus === 'PENDING');
    const preparingOrders = orders.filter(o => o.orderStatus === 'IN_PREPARATION');
    const readyOrders = orders.filter(o => o.orderStatus === 'READY');

    const handleAction = (orderId: number, nextStatus: OrderStatus) => {
        updateStatusMutation.mutate({ orderId, status: nextStatus });
    };

    return (
        <div className="flex w-full gap-4 md:gap-6 h-[calc(100vh-100px)] items-start overflow-x-auto pb-4 no-scrollbar">
            {/* Column: PENDIENTE */}
            <KitchenOrderColumn
                title="Pendiente"
                icon={<Sparkles className="h-5 w-5 text-orange-500" />}
                count={pendingOrders.length}
                variant="new"
                className="flex-[0.7] min-w-50 shrink-0 xl:shrink"
            >
                {pendingOrders.map(order => (
                    <KitchenOrderCard key={order.idOrder} order={order} onAction={handleAction} />
                ))}
                {pendingOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-orange-500/20 rounded-xl opacity-40">
                        <Package className="h-8 w-8 mb-2" />
                        <span className="text-xs font-bold uppercase">Sin pendientes</span>
                    </div>
                )}
            </KitchenOrderColumn>

            {/* Column: EN PREPARACIÓN */}
            <KitchenOrderColumn
                title="En Preparación"
                icon={<CookingPot className="h-5 w-5 text-amber-500" />}
                count={preparingOrders.length}
                variant="preparing"
                className="flex-1 min-w-75 shrink-0 xl:shrink"
            >
                {preparingOrders.map(order => (
                    <KitchenOrderCard key={order.idOrder} order={order} onAction={handleAction} />
                ))}
                {preparingOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-amber-500/20 rounded-xl opacity-40">
                        <CookingPot className="h-8 w-8 mb-2" />
                        <span className="text-xs font-bold uppercase">Puestos vacíos</span>
                    </div>
                )}
            </KitchenOrderColumn>

            {/* Column: LISTOS PARA SERVIR */}
            <KitchenOrderColumn
                title="Listos para Servir"
                icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
                count={readyOrders.length}
                variant="ready"
                className="flex-1 min-w-75 shrink-0 xl:shrink"
            >
                {readyOrders.map(order => (
                    <KitchenOrderCard key={order.idOrder} order={order} onAction={handleAction} />
                ))}
                {readyOrders.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-emerald-500/20 rounded-xl opacity-40">
                        <CheckCircle className="h-8 w-8 mb-2" />
                        <span className="text-xs font-bold uppercase">Todo entregado</span>
                    </div>
                )}
            </KitchenOrderColumn>
        </div>
    );
};
