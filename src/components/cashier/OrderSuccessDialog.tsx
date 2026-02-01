import { CheckCircle2, Printer, ArrowRight, User, Hash, Clock, Receipt, Save, X, MessageSquare } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types/order';
import { formatPrice } from '@/utils/product.utils';
import type { OrderItem } from '@/store/useCashierStore';

interface OrderProcessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'confirm' | 'success';
    // For confirm mode
    previewData: {
        items: OrderItem[];
        total: number;
        paymentMethod: string;
        amountPaid: number;
        change: number;
        customer?: string;
        observations?: string;
    } | null;
    // For success mode
    order: Order | null;
    onConfirm: () => void;
    isProcessing: boolean;
}

export const OrderProcessDialog = ({
    open,
    onOpenChange,
    mode,
    previewData,
    order,
    onConfirm,
    isProcessing
}: OrderProcessDialogProps) => {

    // Determine which data to show
    const isSuccess = mode === 'success' && order;
    const currentItems = isSuccess ? order.details.map(d => ({ ...d.product, quantity: d.quantity, price: d.unitPrice })) : (previewData?.items || []);
    const currentTotal = isSuccess ? parseFloat(order.total) : (previewData?.total || 0);
    const currentAmountPaid = isSuccess ? parseFloat(order.amountPaid) : (previewData?.amountPaid || 0);
    const currentChange = isSuccess ? parseFloat(order.changeAmount) : (previewData?.change || 0);
    const currentMethod = isSuccess ? order.paymentMethod : (previewData?.paymentMethod || 'CASH');
    const currentCustomer = isSuccess ? order.customer : previewData?.customer;
    const currentObservations = isSuccess ? order.observations : previewData?.observations;
    const orderNumber = isSuccess ? order.orderNumber : 'PRE-ORDEN';

    const displayDate = isSuccess
        ? new Date(order.orderDate).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

    return (
        <Dialog open={open} onOpenChange={(val) => !isProcessing && onOpenChange(val)}>
            <DialogContent className="sm:max-w-md border-0 bg-background p-0 overflow-hidden rounded-3xl shadow-2xl">
                {/* Header Section - Compacted */}
                <div className={`px-6 py-4 flex items-center gap-4 border-b transition-colors duration-500 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/10' : 'bg-primary/5 border-primary/10'}`}>
                    <div className={`rounded-full p-2 shadow-lg transition-all duration-500 shrink-0 ${isSuccess ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-primary shadow-primary/20'}`}>
                        {isSuccess ? <CheckCircle2 className="h-6 w-6 text-white" /> : <Save className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-bold text-foreground leading-tight">
                            {isSuccess ? '¡Pedido Generado!' : 'Confirmar Pedido'}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-xs font-medium">
                            {isSuccess
                                ? 'Registro exitoso en el sistema'
                                : 'Valida los montos de la venta'}
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto scrollbar-thin">
                    {/* Metadata Section - Even more compact */}
                    <div className="flex justify-between items-center bg-muted/20 px-3 py-2 rounded-lg border border-border/40">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
                                <Hash className="h-2.5 w-2.5" /> {isSuccess ? 'Orden' : 'Ref'}
                            </span>
                            <span className="text-xs font-bold font-mono">{orderNumber}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-end gap-1">
                                <Clock className="h-2.5 w-2.5" /> {displayDate}
                            </span>
                        </div>
                    </div>

                    {/* Customer & Observations - Better usage of space */}
                    {(currentCustomer || currentObservations) && (
                        <div className="grid grid-cols-1 gap-2">
                            {currentCustomer && (
                                <div className="bg-muted/30 p-2.5 rounded-xl border border-border/50 flex items-center gap-3">
                                    <div className="bg-background p-1.5 rounded-lg border shadow-sm">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Cliente</p>
                                        <p className="text-xs font-bold">{currentCustomer}</p>
                                    </div>
                                </div>
                            )}
                            {currentObservations && (
                                <div className="bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10 flex items-start gap-3">
                                    <div className="bg-background p-1.5 rounded-lg border shadow-sm shrink-0">
                                        <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">Observaciones</p>
                                        <p className="text-xs italic text-foreground/80">{currentObservations}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Items Table - Focused summary */}
                    <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1 px-1">
                            <Receipt className="h-3 w-3" /> Detalle de Venta
                        </span>
                        <div className="space-y-1.5 px-1">
                            {currentItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm group">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Badge variant="outline" className="h-5 px-1.5 font-bold text-[10px] bg-muted/50 border-0 text-foreground">
                                            {item.quantity}
                                        </Badge>
                                        <span className="truncate font-medium text-foreground/80">
                                            {('product' in item ? (item as any).product.name : (item as any).name)}
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs font-medium text-muted-foreground">
                                        {formatPrice(('subtotal' in item ? (item as any).subtotal : (parseFloat(item.price) * item.quantity).toString()))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-border/60" />

                    {/* Highly Intuitive Financial Breakdown */}
                    <div className={`space-y-3 p-4 rounded-2xl border transition-colors duration-500 ${isSuccess ? 'bg-emerald-500/5 border-emerald-500/10 shadow-inner' : 'bg-primary/5 border-primary/10 shadow-inner'}`}>
                        {/* Always Green: Amount to Pay */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Total a Cobrar</span>
                            <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
                                {formatPrice(currentTotal.toString())}
                            </span>
                        </div>

                        <Separator className="bg-border/40" />

                        {/* Always Black/Normal: Received */}
                        <div className="flex justify-between items-center py-1">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-foreground/10 text-foreground border-0 shadow-none text-[10px] px-1.5 uppercase">
                                    {currentMethod}
                                </Badge>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Monto Recibido</span>
                            </div>
                            <span className="font-bold text-lg text-foreground">
                                {formatPrice(currentAmountPaid.toString())}
                            </span>
                        </div>

                        {/* Always Red: Change */}
                        <div className={`flex justify-between items-center -mx-4 -mb-4 px-4 py-3 rounded-b-2xl border-t ${isSuccess ? 'bg-red-500/10 border-red-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                            <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">Cambio a Devolver</span>
                            <span className="text-2xl font-black text-red-600 dark:text-red-400 drop-shadow-sm">
                                {formatPrice(currentChange.toString())}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Section with Actions */}
                <DialogFooter className="p-6 bg-muted/20 border-t border-border/50 sm:justify-between gap-3 flex-col sm:flex-row">
                    {!isSuccess ? (
                        <>
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl border-2 hover:bg-background transition-all active:scale-95 gap-2"
                                onClick={() => onOpenChange(false)}
                                disabled={isProcessing}
                            >
                                <X className="h-4 w-4" /> Cancelar
                            </Button>
                            <Button
                                className="flex-1 h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 gap-2"
                                onClick={onConfirm}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        Generar Venta
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl font-bold border-2 hover:bg-background hover:text-primary transition-all active:scale-95 gap-2"
                                onClick={() => { /* Imprimir ticket */ }}
                            >
                                <Printer className="h-5 w-5" /> Imprimir
                            </Button>
                            <Button
                                className="flex-1 h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 gap-2"
                                onClick={() => onOpenChange(false)}
                            >
                                Continuar <ArrowRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
