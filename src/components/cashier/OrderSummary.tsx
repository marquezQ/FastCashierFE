import { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCashierStore } from '@/store/useCashierStore';
import { formatPrice } from '@/utils/product.utils';
import { toast } from 'sonner';

export const OrderSummary = () => {
    const { orderItems, updateQuantity, removeItem, clearCart } = useCashierStore();
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
    const [cashReceived, setCashReceived] = useState('');
    const [observations, setObservations] = useState('');

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const total = subtotal;

    // Calculate change
    const cashValue = parseFloat(cashReceived) || 0;
    const change = cashValue >= total ? cashValue - total : 0;

    const handleCreateOrder = () => {
        if (orderItems.length === 0) return;

        console.log('Crear pedido:', {
            customerName,
            items: orderItems.map(item => ({ id: item.idProduct, quantity: item.quantity })),
            paymentMethod,
            cashReceived: paymentMethod === 'cash' ? cashReceived : null,
            observations,
            total,
        });

        toast.success('Pedido generado exitosamente');

        // Clear form and store
        clearCart();
        setCustomerName('');
        setPaymentMethod('cash');
        setCashReceived('');
        setObservations('');

        // TODO: Implement backend submission
    };

    const handleClearForm = () => {
        clearCart();
        setCustomerName('');
        setPaymentMethod('cash');
        setCashReceived('');
        setObservations('');
    };

    return (
        <Card className="flex flex-col h-auto lg:h-full overflow-hidden border-(--cashier-sidebar-border) shadow-lg bg-background/95 backdrop-blur-sm pt-0">
            {/* Compact Header */}
            <CardHeader className="border-b bg-muted/40 py-3 h-12 px-3 shrink-0">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-(--cashier-sidebar-primary)">Pedido Actual</span>
                    <Badge variant="secondary" className="h-5 text-[10px] px-1.5 font-normal bg-background/50 border shadow-none">
                        {orderItems.reduce((acc, item) => acc + item.quantity, 0)} items
                    </Badge>
                </div>
            </CardHeader>

            {/* Order Items List - Expanding to take available space */}
            <CardContent className="flex-1 p-0 overflow-hidden relative bg-card/50">
                {orderItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center opacity-50">
                        <ShoppingCart className="h-12 w-12 mb-3" />
                        <p className="font-medium text-sm">Carrito vacío</p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto p-2 space-y-1.5">
                        {orderItems.map((item) => (
                            <div key={item.idProduct} className="flex items-center gap-2 p-2 rounded-md border bg-background shadow-sm group hover:border-(--cashier-sidebar-primary)/30 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate leading-none mb-1">{item.name}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {formatPrice(item.price)} c/u
                                    </p>
                                </div>

                                <div className="flex items-center gap-0.5 bg-muted/50 rounded-md border p-0.5">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-background hover:text-destructive hover:shadow-sm rounded-sm"
                                        onClick={() => updateQuantity(item.idProduct, -1)}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="min-w-6 text-center text-xs font-semibold tabular-nums">{item.quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-background hover:text-(--cashier-sidebar-primary) hover:shadow-sm rounded-sm"
                                        onClick={() => updateQuantity(item.idProduct, 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 shrink-0"
                                    onClick={() => removeItem(item.idProduct)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Compact Payment Section */}
            <div className="border-t bg-muted/10 shrink-0">
                <div className="p-3 space-y-3">
                    {/* Totals Row */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Total a Pagar</p>
                            <span className="text-2xl font-bold text-(--cashier-sidebar-primary) tracking-tight">
                                {formatPrice(total.toString())}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-0.5">Cambio</p>
                            <span className={`text-xl font-bold tracking-tight ${change > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground/40'
                                }`}>
                                {formatPrice(change.toString())}
                            </span>
                        </div>
                    </div>

                    <Separator className="bg-border/60" />

                    {/* Payment Method & Input Compact Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Método</Label>
                            <div className="flex gap-1">
                                <Button
                                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`flex-1 h-8 text-xs ${paymentMethod === 'cash' ? 'bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90' : 'px-0'}`}
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    <DollarSign className="h-3 w-3 mr-1" /> Efec.
                                </Button>
                                <Button
                                    variant={paymentMethod === 'qr' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`flex-1 h-8 text-xs ${paymentMethod === 'qr' ? 'bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90' : 'px-0'}`}
                                    onClick={() => setPaymentMethod('qr')}
                                >
                                    QR
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Recibido</Label>
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                <Input
                                    type="number"
                                    className="h-8 pl-5 text-sm font-medium focus-visible:ring-(--cashier-sidebar-primary) bg-background"
                                    placeholder="0.00"
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    disabled={paymentMethod !== 'cash'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Extra Info - Stacked */}
                    <div className="space-y-2">
                        <Input
                            className="h-8 text-xs bg-background focus-visible:ring-(--cashier-sidebar-primary)"
                            placeholder="Cliente (Opcional)"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        <Input
                            className="h-8 text-xs bg-background focus-visible:ring-(--cashier-sidebar-primary)"
                            placeholder="Observaciones..."
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                        />
                    </div>

                    {/* Final Actions */}
                    <div className="grid grid-cols-[auto_1fr] gap-2 pt-1">
                        <Button
                            variant="outline"
                            onClick={handleClearForm}
                            disabled={orderItems.length === 0}
                            className="h-10 px-4 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive flex gap-2 items-center"
                        >
                            <Trash2 className="h-4 w-4" />
                            Limpiar
                        </Button>
                        <Button
                            onClick={handleCreateOrder}
                            disabled={orderItems.length === 0}
                            className="h-10 text-sm font-semibold bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90 shadow-md shadow-(--cashier-sidebar-primary)/20"
                        >
                            Cobrar <span className="ml-1 opacity-90">{formatPrice(total.toString())}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
