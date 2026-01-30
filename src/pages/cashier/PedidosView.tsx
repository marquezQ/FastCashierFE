import { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Tipos temporales - luego vendrán de la API
interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export const PedidosView = () => {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
    const [cashReceived, setCashReceived] = useState('');
    const [observations, setObservations] = useState('');

    // Calcular totales
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;
    const change = cashReceived ? parseFloat(cashReceived) - total : 0;

    const addItem = (product: { id: string; name: string; price: number }) => {
        const existingItem = orderItems.find(item => item.id === product.id);
        if (existingItem) {
            setOrderItems(orderItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setOrderItems([...orderItems, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id: string, delta: number) => {
        setOrderItems(orderItems.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        ).filter(item => item.quantity > 0));
    };

    const removeItem = (id: string) => {
        setOrderItems(orderItems.filter(item => item.id !== id));
    };

    const handleCreateOrder = () => {
        console.log('Crear pedido:', {
            customerName,
            items: orderItems,
            paymentMethod,
            cashReceived: paymentMethod === 'cash' ? cashReceived : null,
            observations,
            total,
        });
        // TODO: Implementar envío al backend
    };

    // Productos de ejemplo - luego vendrán de la API
    const categories = [
        {
            id: 'hamburguesas',
            name: 'Hamburguesas',
            products: [
                { id: '1', name: 'Hamburguesa Clásica', price: 8.99 },
                { id: '2', name: 'Hamburguesa Doble', price: 12.99 },
            ],
        },
        {
            id: 'acompañamientos',
            name: 'Acompañamientos',
            products: [
                { id: '3', name: 'Papas Fritas', price: 4.99 },
                { id: '4', name: 'Nuggets de Pollo', price: 6.99 },
            ],
        },
        {
            id: 'bebidas',
            name: 'Bebidas',
            products: [
                { id: '5', name: 'Coca Cola', price: 2.99 },
                { id: '6', name: 'Pizza Personal', price: 9.99 },
            ],
        },
    ];

    const handleClearForm = () => {
        setOrderItems([]);
        setCustomerName('');
        setPaymentMethod('cash');
        setCashReceived('');
        setObservations('');
    };

    return (
        <div>
            {/* Main Content: Two Columns */}
            <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
                {/* Left Column: Product Catalog */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-(--cashier-sidebar-primary)">Productos Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue={categories[0].id} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                {categories.map((category) => (
                                    <TabsTrigger key={category.id} value={category.id}>
                                        {category.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {categories.map((category) => (
                                <TabsContent key={category.id} value={category.id} className="mt-4">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {category.products.map((product) => (
                                            <Card
                                                key={product.id}
                                                className="cursor-pointer transition-all hover:shadow-md hover:border-(--cashier-sidebar-primary)/50"
                                                onClick={() => addItem(product)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium">{product.name}</h4>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {category.name}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-(--cashier-sidebar-primary)">
                                                                ${product.price.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Right Column: Order Details (Fixed) */}
                <div className="lg:sticky lg:top-4 lg:h-fit">
                    <Card className="gap-0 p-0 overflow-hidden border-border/60 shadow-sm">
                        <CardHeader className="border-b pt-2 h-10 px-3 bg-muted/30">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-(--cashier-sidebar-primary) text-sm font-bold">Detalle del Pedido</CardTitle>
                                <Badge variant="secondary" className="h-5 text-[10px] px-1.5 font-normal">{orderItems.length} items</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 space-y-2">

                            {/* Order Items */}
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Productos</Label>
                                {orderItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/50">
                                        <ShoppingCart className="h-6 w-6 mb-1 opacity-30" />
                                        <p className="text-xs opacity-70">Vacío</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1 -mr-1">
                                        {orderItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Payment Method */}
                            <div className="space-y-2">
                                <Label>Método de Pago</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                                        className={paymentMethod === 'cash'
                                            ? 'w-full bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90 text-(--cashier-sidebar-primary-foreground)'
                                            : 'w-full'
                                        }
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        Efectivo
                                    </Button>
                                    <Button
                                        variant={paymentMethod === 'qr' ? 'default' : 'outline'}
                                        className={paymentMethod === 'qr'
                                            ? 'w-full bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90 text-(--cashier-sidebar-primary-foreground)'
                                            : 'w-full'
                                        }
                                        onClick={() => setPaymentMethod('qr')}
                                    >
                                        QR
                                    </Button>
                                </div>
                            </div>

                            {/* Cash Received (only if cash payment) */}
                            {paymentMethod === 'cash' && (
                                <div className="space-y-2">
                                    <Label htmlFor="cashReceived">Efectivo Recibido</Label>
                                    <Input
                                        id="cashReceived"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={cashReceived}
                                        onChange={(e) => setCashReceived(e.target.value)}
                                    />
                                    {cashReceived && parseFloat(cashReceived) >= total && (
                                        <div className="p-2 rounded-md bg-(--cashier-sidebar-primary)/10 border border-(--cashier-sidebar-primary)/20">
                                            <p className="text-sm font-medium text-(--cashier-sidebar-primary)">
                                                Cambio: ${change.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Observations */}
                            <div className="space-y-2">
                                <Label htmlFor="observations">Observaciones</Label>
                                <Textarea
                                    id="observations"
                                    placeholder="Notas especiales del pedido..."
                                    rows={2}
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                />
                            </div>

                            <Separator />

                            {/* Customer Name - Moved to end */}
                            <div className="space-y-2">
                                <Label htmlFor="customerName">¿A nombre de quién está el pedido?</Label>
                                <Input
                                    id="customerName"
                                    placeholder="Opcional"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>

                            <Separator />

                            {/* Total */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-lg">
                                    <span className="font-semibold">Total:</span>
                                    <span className="font-bold text-(--cashier-sidebar-primary)">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleClearForm}
                                    disabled={orderItems.length === 0}
                                >
                                    Limpiar
                                </Button>
                                <Button
                                    className="bg-(--cashier-sidebar-primary) hover:bg-(--cashier-sidebar-primary)/90 text-(--cashier-sidebar-primary-foreground)"
                                    size="lg"
                                    onClick={handleCreateOrder}
                                    disabled={orderItems.length === 0}
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Generar Pedido
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
