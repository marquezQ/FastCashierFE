import { useState } from 'react';
import { Sparkles, CookingPot, CheckCircle, Package } from 'lucide-react';
import { KitchenOrderColumn } from '@/components/kitchen/KitchenOrderColumn';
import { KitchenOrderCard, type KitchenOrder } from '@/components/kitchen/KitchenOrderCard';

// MOCK DATA
const INITIAL_ORDERS: KitchenOrder[] = [
    {
        id: '1',
        orderNumber: '302',
        type: 'Para llevar',
        items: [
            { id: 'i1', name: 'Hamburguesa Doble Queso', quantity: 2 },
            { id: 'i2', name: 'Papas Grandes', quantity: 1 }
        ],
        createdAt: new Date().toISOString(),
        status: 'new',
        minutesWait: 12
    },
    {
        id: '2',
        orderNumber: '301',
        type: 'Mesa',
        tableNumber: '5',
        items: [
            { id: 'i3', name: 'Pizza Pepperoni Familiar', quantity: 1 },
            { id: 'i4', name: 'Refresco Familiar', quantity: 1 }
        ],
        observations: 'Sin cebolla en la pizza por favor. Extra servilletas.',
        createdAt: new Date().toISOString(),
        status: 'preparing',
        minutesWait: 28
    },
    {
        id: '3',
        orderNumber: '304',
        type: 'Mesa',
        tableNumber: '8',
        items: [
            { id: 'i5', name: 'Tacos Al Pastor (x3)', quantity: 2 },
            { id: 'i6', name: 'Agua de Horchata', quantity: 2 }
        ],
        createdAt: new Date().toISOString(),
        status: 'preparing',
        minutesWait: 15
    },
    {
        id: '4',
        orderNumber: '303',
        type: 'Mesa',
        tableNumber: '2',
        items: [
            { id: 'i7', name: 'Burrito Super Pollo', quantity: 1 },
            { id: 'i8', name: 'Nachos con Queso', quantity: 1 }
        ],
        observations: 'Mucho picante aparte',
        createdAt: new Date().toISOString(),
        status: 'ready',
        minutesWait: 33
    }
];

export const PedidosView = () => {
    const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);

    // Filter orders by status
    const newOrders = orders.filter(o => o.status === 'new');
    const preparingOrders = orders.filter(o => o.status === 'preparing');
    const readyOrders = orders.filter(o => o.status === 'ready');

    const handleAction = (orderId: string, nextStatus: KitchenOrder['status'] | 'delivered') => {
        if (nextStatus === 'delivered') {
            setOrders(prev => prev.filter(o => o.id !== orderId));
            return;
        }

        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: nextStatus as KitchenOrder['status'] } : o
        ));
    };

    return (
        <div className="flex w-full gap-4 md:gap-6 h-[calc(100vh-100px)] items-start overflow-x-auto pb-4 no-scrollbar">
            {/* Column: PENDIENTE */}
            <KitchenOrderColumn
                title="Pendiente"
                icon={<Sparkles className="h-5 w-5 text-orange-500" />}
                count={newOrders.length}
                variant="new"
                className="flex-[0.7] min-w-50 shrink-0 xl:shrink"
            >
                {newOrders.map(order => (
                    <KitchenOrderCard key={order.id} order={order} onAction={handleAction} />
                ))}
                {newOrders.length === 0 && (
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
                    <KitchenOrderCard key={order.id} order={order} onAction={handleAction} />
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
                    <KitchenOrderCard key={order.id} order={order} onAction={handleAction} />
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
