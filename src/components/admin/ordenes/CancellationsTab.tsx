import { useState } from 'react';
import {
    XCircle,
    User,
    Clock,
    DollarSign,
    AlertCircle,
    Receipt,
    Eye,
    UtensilsCrossed,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/product.utils';
import { Button } from '@/components/ui/button';
import { useAdminCancellations } from '@/hooks/useAdminMetrics';
import type { MetricsParams } from '@/types/adminMetrics';
import { OrderProcessDialog } from '@/components/shared/OrderProcessDialog';
import type { Order } from '@/types/order';

interface CancellationsTabProps {
    params: MetricsParams;
}

export const CancellationsTab = ({ params }: CancellationsTabProps) => {
    const { data: cancelledOrders = [], isLoading, error } = useAdminCancellations(params);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Cargando auditoría...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 bg-red-500/5 rounded-[2.5rem] border-2 border-dashed border-red-500/20 mx-4 md:mx-0">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <div className="text-center">
                    <p className="text-sm font-black uppercase tracking-widest text-red-600">Error al cargar auditoría</p>
                    <p className="text-xs font-bold text-muted-foreground mt-1">Por favor, intenta refrescar la página</p>
                </div>
            </div>
        );
    }

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 px-4 md:px-0">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-foreground">Control de Anulaciones</h3>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">
                        Auditoría de pedidos cancelados
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 px-3 py-1.5 rounded-xl font-black uppercase tracking-widest text-[9px]">
                        {cancelledOrders.length} Anulaciones
                    </Badge>
                    <Button variant="outline" className="h-9 px-4 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-all gap-2 shadow-sm">
                        <UtensilsCrossed className="h-3.5 w-3.5" />
                        Ver cocina en tiempo real
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
                {cancelledOrders.length > 0 ? cancelledOrders.map((order) => (
                    <CancellationCard
                        key={order.idOrder}
                        order={order}
                        onViewDetail={() => handleViewDetail(order)}
                    />
                )) : (
                    <Card className="col-span-full py-20 flex flex-col items-center justify-center bg-muted/20 border-border border-2 border-dashed rounded-[2.5rem] gap-4">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No hay anulaciones registradas</p>
                            <p className="text-xs font-bold text-muted-foreground/60 mt-1">En el periodo seleccionado</p>
                        </div>
                    </Card>
                )}

                {/* Audit Resource Card */}
                <Card className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/60 bg-card/40 shadow-sm rounded-[2rem] gap-4 text-center group hover:border-red-500/40 transition-all duration-300">
                    <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                        <XCircle className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h5 className="text-lg font-black tracking-tight text-foreground">Registro de Auditoría</h5>
                        <p className="text-xs text-muted-foreground max-w-50 mx-auto font-bold uppercase tracking-wide leading-relaxed">
                            Registro permanente para transparencia operativa.
                        </p>
                    </div>
                    <Button variant="destructive" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">
                        Reporte de Bajas
                    </Button>
                </Card>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderProcessDialog
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
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

const CancellationCard = ({ order, onViewDetail }: { order: Order; onViewDetail: () => void }) => (
    <Card className="group relative overflow-hidden border-2 border-border bg-card shadow-sm rounded-3xl p-5 hover:border-red-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Receipt className="h-20 w-20 text-red-600 -rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col gap-5">
            {/* Header: Order ID & Amount */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-black tracking-tighter text-foreground leading-none">Orden #{order.orderNumber?.split('-').pop() ?? '----'}</p>
                            <Badge variant="secondary" className="h-7 px-2.5 text-[12px] font-black uppercase bg-muted text-muted-foreground border-none">
                                Sesión {order.sessionId}
                            </Badge>
                        </div>
                        <p className="text-2xl font-black tracking-tighter mt-1.5 text-red-600/90">{formatPrice(order.total)}</p>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-red-600 text-white shadow-lg shadow-red-500/20 border-none">
                    <span className="text-[9px] font-black uppercase tracking-widest">Cancelada</span>
                </div>
            </div>

            {/* Motivo de la Anulación */}
            <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-600/80 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    Motivo de baja
                </p>
                <p className="text-sm font-bold text-foreground leading-relaxed">
                    {order.observations || 'Sin motivo especificado'}
                </p>
            </div>

            {/* Footer: Meta info */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-primary/5">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-tight text-muted-foreground">Cajero</p>
                        <p className="text-xs font-bold truncate">{order.cashier?.fullName || 'Desconocido'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-tight text-muted-foreground">Fecha/Hora</p>
                        <p className="text-xs font-bold truncate">
                            {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <Button
                variant="outline"
                className="w-full mt-1 h-10 rounded-xl border-dashed border-red-500/30 text-red-600 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all gap-2"
                onClick={onViewDetail}
            >
                <Eye className="h-3.5 w-3.5" />
                Ver Detalles de Orden
            </Button>
        </div>
    </Card>
);
