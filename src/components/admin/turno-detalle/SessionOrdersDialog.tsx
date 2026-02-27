import { useState } from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useOrdersBySession } from '@/hooks/useOrdersBySession';
import { OrderProcessDialog } from '@/components/shared/OrderProcessDialog';
import { SessionOrdersTable } from './SessionOrdersTable';
import type { Order } from '@/types/order';

interface SessionOrdersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId: number;
    sessionNumber: number;
    cashierName: string;
}

export const SessionOrdersDialog = ({
    open,
    onOpenChange,
    sessionId,
    sessionNumber,
    cashierName
}: SessionOrdersDialogProps) => {
    const { data: orders, isLoading } = useOrdersBySession(sessionId);
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

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[95vw] lg:max-w-7xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="bg-primary/5 p-8 pb-6 border-b border-primary/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <ShoppingBag className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <DialogTitle className="admin-h2">
                                        Pedidos de la Sesión
                                    </DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="admin-label-sm flex items-center gap-2">
                                            <span>Sesión #{sessionNumber}</span>
                                            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                            <span>Cajero: {cashierName}</span>
                                        </div>
                                    </DialogDescription>
                                </div>
                            </div>
                        </div>

                        <div className="relative mt-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por número de pedido o cliente..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-14 pl-12 pr-4 bg-background/50 border-2 border-primary/10 rounded-2xl focus-visible:ring-primary focus-visible:border-primary font-bold text-lg"
                            />
                        </div>
                    </DialogHeader>

                    <div className="p-8 pt-0 max-h-[75vh] overflow-y-auto">
                        <SessionOrdersTable
                            orders={filteredOrders}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onViewDetail={handleViewDetail}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Nested Order Detail Dialog */}
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
        </>
    );
};
