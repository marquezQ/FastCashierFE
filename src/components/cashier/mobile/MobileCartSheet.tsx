import { useState } from 'react';
import {
    Plus, Minus, Trash2, ShoppingCart, DollarSign,
    UtensilsCrossed, Package, X
} from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCashierStore } from '@/store/useCashierStore';
import { useAuthStore } from '@/store/authStore';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { formatPrice } from '@/utils/product.utils';
import { toast } from 'sonner';
import type { PaymentMethod, Order, OrderType } from '@/types/order';
import { OrderProcessDialog } from '@/components/shared/OrderProcessDialog';

interface MobileCartSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Bottom-drawer cart sheet for mobile.
 * Contains the full checkout flow: item list, payment config, and order creation.
 * Reuses all business logic from useCashierStore and useCreateOrder — zero duplication.
 */
export const MobileCartSheet = ({ open, onOpenChange }: MobileCartSheetProps) => {
    const { orderItems, updateQuantity, removeItem, clearCart, currentSession } = useCashierStore();
    const { user } = useAuthStore();
    const { mutate: createOrder, isPending } = useCreateOrder();

    const [customerName, setCustomerName] = useState('');
    const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('DINE_IN');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
    const [cashReceived, setCashReceived] = useState('');
    const [observations, setObservations] = useState('');

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'confirm' | 'success'>('confirm');
    const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

    // Calculations
    const subtotal = orderItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const total = subtotal;
    const cashValue = paymentMethod === 'CASH' ? (parseFloat(cashReceived) || 0) : 0;
    const change = paymentMethod === 'CASH' && cashValue >= total ? cashValue - total : 0;
    const itemCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleOpenReview = () => {
        if (orderItems.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }
        if (!currentSession) {
            toast.error('No hay una sesión de caja activa');
            return;
        }
        if (!user) {
            toast.error('No se encontró información del cajero');
            return;
        }

        const amountPaid = paymentMethod === 'CASH'
            ? (parseFloat(cashReceived) || 0)
            : total;

        if (paymentMethod === 'CASH' && amountPaid < total) {
            toast.error('El monto recibido es insuficiente');
            return;
        }

        setDialogMode('confirm');
        setIsDialogOpen(true);
    };

    const handleConfirmOrder = () => {
        const amountPaid = paymentMethod === 'CASH' ? (parseFloat(cashReceived) || 0) : total;

        createOrder({
            sessionId: currentSession!.idSession,
            cashierId: user!.idUser,
            orderType: selectedOrderType,
            paymentMethod,
            amountPaid,
            items: orderItems.map(item => ({
                productId: item.idProduct,
                quantity: item.quantity
            })),
            customer: customerName || undefined,
            observations: observations || undefined,
        }, {
            onSuccess: (data) => {
                setLastCreatedOrder(data);
                setDialogMode('success');

                // Clear form for next order
                setCustomerName('');
                setSelectedOrderType('DINE_IN');
                setPaymentMethod('CASH');
                setCashReceived('');
                setObservations('');
            }
        });
    };

    const handleClearForm = () => {
        clearCart();
        setCustomerName('');
        setSelectedOrderType('DINE_IN');
        setPaymentMethod('CASH');
        setCashReceived('');
        setObservations('');
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    side="bottom"
                    hideClose
                    className="rounded-t-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden"
                >
                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-1 shrink-0">
                        <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pb-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-(--cashier-sidebar-primary)" />
                            <span className="font-bold text-base tracking-tight">Pedido Actual</span>
                            <Badge variant="secondary" className="text-[10px] font-bold px-2 bg-(--cashier-sidebar-primary)/10 text-(--cashier-sidebar-primary) border-0">
                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </Badge>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <Separator className="bg-border/60" />

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        {/* Cart Items */}
                        {orderItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                                <ShoppingCart className="h-10 w-10 mb-2" />
                                <p className="font-medium text-sm">Carrito vacío</p>
                                <p className="text-xs mt-1">Agrega productos desde el catálogo</p>
                            </div>
                        ) : (
                            <div className="p-3 space-y-2">
                                {orderItems.map((item) => (
                                    <div
                                        key={item.idProduct}
                                        className="flex items-center gap-2 p-2.5 rounded-xl border border-border/40 bg-background shadow-sm"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate leading-tight">{item.name}</p>
                                            <p className="text-[11px] text-muted-foreground tabular-nums">
                                                {formatPrice(item.price)} c/u · <span className="font-semibold text-foreground">{formatPrice((parseFloat(item.price) * item.quantity).toString())}</span>
                                            </p>
                                        </div>

                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg border p-0.5 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:bg-background hover:text-destructive rounded-md active:scale-90"
                                                onClick={() => updateQuantity(item.idProduct, -1)}
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </Button>
                                            <span className="min-w-7 text-center text-sm font-bold tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:bg-background hover:text-(--cashier-sidebar-primary) rounded-md active:scale-90"
                                                onClick={() => updateQuantity(item.idProduct, 1)}
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>

                                        {/* Remove */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 shrink-0 active:scale-90"
                                            onClick={() => removeItem(item.idProduct)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Checkout Section */}
                        {orderItems.length > 0 && (
                            <div className="px-3 pb-3 space-y-3">
                                <Separator className="bg-border/60" />

                                {/* Totals */}
                                <div className="flex items-end justify-between px-1">
                                    <div>
                                        <p className="cashier-label-sm">Total a Pagar</p>
                                        <span className="text-2xl font-black text-(--cashier-sidebar-primary) tracking-tight tabular-nums">
                                            {formatPrice(total.toString())}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="cashier-label-sm">Cambio</p>
                                        <span className={`text-lg font-bold tracking-tight tabular-nums ${change > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground/40'}`}>
                                            {formatPrice(change.toString())}
                                        </span>
                                    </div>
                                </div>

                                <Separator className="bg-border/40" />

                                {/* Order Type */}
                                <div className="space-y-1.5">
                                    <Label className="cashier-label-sm">Tipo de Pedido</Label>
                                    <div className="flex gap-1.5">
                                        <Button
                                            variant={selectedOrderType === 'DINE_IN' ? 'default' : 'outline'}
                                            size="sm"
                                            className={`flex-1 h-9 text-xs active:scale-95 ${selectedOrderType === 'DINE_IN' ? 'bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90' : ''}`}
                                            onClick={() => setSelectedOrderType('DINE_IN')}
                                        >
                                            <UtensilsCrossed className="h-3.5 w-3.5 mr-1.5" /> Para la Mesa
                                        </Button>
                                        <Button
                                            variant={selectedOrderType === 'TAKEOUT' ? 'default' : 'outline'}
                                            size="sm"
                                            className={`flex-1 h-9 text-xs active:scale-95 ${selectedOrderType === 'TAKEOUT' ? 'bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90' : ''}`}
                                            onClick={() => setSelectedOrderType('TAKEOUT')}
                                        >
                                            <Package className="h-3.5 w-3.5 mr-1.5" /> Para Llevar
                                        </Button>
                                    </div>
                                </div>

                                {/* Payment Method + Cash Input */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1.5">
                                        <Label className="cashier-label-sm">Método</Label>
                                        <div className="flex gap-1">
                                            <Button
                                                variant={paymentMethod === 'CASH' ? 'default' : 'outline'}
                                                size="sm"
                                                className={`flex-1 h-9 text-xs active:scale-95 ${paymentMethod === 'CASH' ? 'bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90' : ''}`}
                                                onClick={() => setPaymentMethod('CASH')}
                                            >
                                                <DollarSign className="h-3 w-3 mr-1" /> Efec.
                                            </Button>
                                            <Button
                                                variant={paymentMethod === 'QR' ? 'default' : 'outline'}
                                                size="sm"
                                                className={`flex-1 h-9 text-xs active:scale-95 ${paymentMethod === 'QR' ? 'bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90' : ''}`}
                                                onClick={() => {
                                                    setPaymentMethod('QR');
                                                    setCashReceived('0');
                                                }}
                                            >
                                                QR
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="cashier-label-sm">Recibido</Label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                            <Input
                                                type="number"
                                                className="h-9 pl-5 text-sm font-medium focus-visible:ring-(--cashier-sidebar-primary) bg-background"
                                                placeholder="0.00"
                                                value={cashReceived}
                                                onChange={(e) => setCashReceived(e.target.value)}
                                                disabled={paymentMethod !== 'CASH'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Customer + Observations */}
                                <div className="space-y-2">
                                    <Input
                                        className="h-9 text-xs bg-background focus-visible:ring-(--cashier-sidebar-primary)"
                                        placeholder="Cliente (Opcional)"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                    />
                                    <Input
                                        className="h-9 text-xs bg-background focus-visible:ring-(--cashier-sidebar-primary)"
                                        placeholder="Observaciones..."
                                        value={observations}
                                        onChange={(e) => setObservations(e.target.value)}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-[auto_1fr] gap-2 pt-1">
                                    <Button
                                        variant="outline"
                                        onClick={handleClearForm}
                                        disabled={orderItems.length === 0}
                                        className="h-11 px-4 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive flex gap-2 items-center active:scale-95"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Limpiar
                                    </Button>
                                    <Button
                                        onClick={handleOpenReview}
                                        disabled={orderItems.length === 0 || isPending}
                                        className="h-11 text-sm font-bold bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90 shadow-md shadow-(--cashier-sidebar-primary)/20 active:scale-95"
                                    >
                                        Cobrar <span className="ml-1 opacity-90 tabular-nums">{formatPrice(total.toString())}</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <OrderProcessDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={dialogMode}
                previewData={{
                    items: orderItems,
                    total,
                    orderType: selectedOrderType,
                    paymentMethod,
                    amountPaid: paymentMethod === 'CASH' ? (parseFloat(cashReceived) || 0) : total,
                    change,
                    customer: customerName,
                    observations
                }}
                order={lastCreatedOrder}
                onConfirm={handleConfirmOrder}
                isProcessing={isPending}
            />
        </>
    );
};
