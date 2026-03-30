import { useState } from 'react';
import { useCashierStore } from '@/store/useCashierStore';
import { useOrdersBySession } from '@/hooks/useOrdersBySession';
import { useCancelOrder } from '@/hooks/useCancelOrder';
import { OrderProcessDialog } from '@/components/shared/OrderProcessDialog';
import { HistoryHeader } from '@/components/cashier/history/HistoryHeader';
import { HistorySearch } from '@/components/cashier/history/HistorySearch';
import { HistoryTable } from '@/components/cashier/history/HistoryTable';
import type { Order } from '@/types/order';

export const HistorialView = () => {
    const { currentSession } = useCashierStore();
    const { data: orders, isLoading, refetch } = useOrdersBySession(currentSession?.idSession);
    const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filteredOrders = orders?.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
            (order.orderNumber?.toLowerCase().includes(query) ?? false) ||
            (order.customer && order.customer.toLowerCase().includes(query))
        );
    }) || [];

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    const handleCancelOrder = (orderId: number, reason: string) => {
        cancelOrder({ orderId, reason });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            <HistoryHeader
                orderCount={orders?.length || 0}
                onRefresh={() => refetch()}
            />

            <HistorySearch
                value={searchQuery}
                onChange={setSearchQuery}
            />

            <HistoryTable
                orders={filteredOrders}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onViewDetail={handleViewDetail}
                onCancel={handleCancelOrder}
                isCancelling={isCancelling}
            />

            {/* Detail Modal Reusing OrderProcessDialog */}
            {selectedOrder && (
                <OrderProcessDialog
                    open={isDetailOpen}
                    onOpenChange={setIsDetailOpen}
                    mode="success"
                    previewData={null}
                    order={selectedOrder}
                    onConfirm={() => { }}
                    isProcessing={false}
                />
            )}
        </div>
    );
};
