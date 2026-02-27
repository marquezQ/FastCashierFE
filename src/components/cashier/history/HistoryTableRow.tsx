import { useState } from 'react';
import { Eye, User as UserIcon, X, DollarSign, QrCode } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/utils/product.utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Order } from '@/types/order';

interface HistoryTableRowProps {
    order: Order;
    onViewDetail: (order: Order) => void;
    onCancel: (orderId: number, reason: string) => void;
    isCancelling: boolean;
}

const statusConfig = {
    PENDING: { label: 'Pendiente', color: 'bg-amber-500/10 text-amber-600 border-amber-200/50' },
    IN_PREPARATION: { label: 'Preparación', color: 'bg-blue-500/10 text-blue-600 border-blue-200/50' },
    READY: { label: 'Listo', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50' },
    DELIVERED: { label: 'Entregado', color: 'bg-green-500/10 text-green-600 border-green-200/50' },
    CANCELLED: { label: 'Cancelado', color: 'bg-red-500/10 text-red-600 border-red-200/50' },
};

export const HistoryTableRow = ({ order, onViewDetail, onCancel, isCancelling }: HistoryTableRowProps) => {
    const [reason, setReason] = useState('');
    const status = statusConfig[order.orderStatus as keyof typeof statusConfig] || statusConfig.PENDING;
    const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'IN_PREPARATION';

    return (
        <TableRow className="group hover:bg-green-500/5 border-green-100/50 dark:border-green-900/50 transition-colors h-20">
            <TableCell className="pl-6">
                <span className="font-black text-lg text-foreground">
                    #{order.orderNumber?.split('-').pop() ?? '----'}
                </span>
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-start gap-3 px-1">
                    <div className="p-2.5 rounded-full bg-muted group-hover:bg-background transition-colors border shadow-sm">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-bold truncate max-w-50">
                        {order.customer || 'Público General'}
                    </span>
                </div>
            </TableCell>
            <TableCell className="text-center">
                <div className="flex flex-col items-center justify-center gap-1">
                    <span className="text-sm font-black text-foreground tabular-nums">
                        {formatPrice(order.total)}
                    </span>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-tight ${order.paymentMethod === 'CASH'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50'
                        : 'bg-violet-500/10 text-violet-600 border-violet-200/50'
                        }`}>
                        {order.paymentMethod === 'CASH' ? (
                            <>
                                <DollarSign className="h-2.5 w-2.5" />
                                <span>Efectivo</span>
                            </>
                        ) : (
                            <>
                                <QrCode className="h-2.5 w-2.5" />
                                <span>QR / Transfer</span>
                            </>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-center">
                <Badge variant="outline" className={`${status.color} px-3 py-1 text-[11px] font-black uppercase border-2 shadow-sm`}>
                    {status.label}
                </Badge>
            </TableCell>
            <TableCell className="text-center">
                <div className="flex flex-col font-bold">
                    <span className="text-sm">{new Date(order.orderDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    <span className="text-xs text-muted-foreground underline decoration-green-500/30">{new Date(order.orderDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </TableCell>
            <TableCell className="pr-6">
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 text-green-600 border-green-100 hover:text-green-700 hover:bg-green-50 dark:border-green-900/40 dark:hover:bg-green-900/20 shadow-sm gap-2 font-bold px-4"
                        onClick={() => onViewDetail(order)}
                    >
                        <Eye className="h-4 w-4" />
                        Ver detalle
                    </Button>

                    {canCancel && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 text-red-500 border-red-100 hover:text-red-700 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20 shadow-sm gap-2 font-bold px-4"
                                    disabled={isCancelling}
                                >
                                    <X className="h-4 w-4" />
                                    Cancelar pedido
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl max-w-md">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-black text-red-600 flex items-center gap-2">
                                        <X className="h-6 w-6" />
                                        Anular Pedido #{order.orderNumber?.split('-').pop() ?? '----'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="space-y-4 pt-2">
                                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                                                <p className="text-red-700 dark:text-red-400 font-bold text-base flex items-center gap-2">
                                                    ⚠️ IMPORTANTE: Devolución de Dinero
                                                </p>
                                                <p className="text-sm text-red-600/80 dark:text-red-400/70 mt-1 font-medium italic">
                                                    Asegúrese de realizar la devolución física del dinero al cliente antes de confirmar esta anulación.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-black text-foreground uppercase tracking-wider">
                                                        Motivo de la anulación
                                                    </label>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${reason.trim().length >= 10 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                                        {reason.trim().length}/10 caracteres
                                                    </span>
                                                </div>
                                                <Input
                                                    placeholder="Ej: Cliente se arrepintió, Error en el pedido..."
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    className="h-12 rounded-xl border-2 focus-visible:ring-red-500"
                                                />
                                            </div>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3 mt-4">
                                    <AlertDialogCancel
                                        className="h-12 px-6 rounded-2xl font-bold border-2"
                                        onClick={() => setReason('')}
                                    >
                                        Cerrar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onCancel(order.idOrder, reason)}
                                        disabled={reason.trim().length < 10 || isCancelling}
                                        className="h-12 px-6 rounded-2xl font-bold bg-red-600 hover:bg-red-700 text-white border-0"
                                    >
                                        Confirmar Anulación
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
};
