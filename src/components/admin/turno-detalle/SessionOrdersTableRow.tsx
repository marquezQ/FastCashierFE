import { Eye, User as UserIcon, DollarSign, QrCode } from 'lucide-react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from '@/utils/product.utils';
import type { Order } from '@/types/order';
import { cn } from '@/lib/utils';

interface SessionOrdersTableRowProps {
    order: Order;
    onViewDetail: (order: Order) => void;
}

export const statusConfig = {
    PENDING: { label: 'Pendiente', color: 'bg-amber-500/10 text-amber-600 border-amber-200/50' },
    IN_PREPARATION: { label: 'Preparación', color: 'bg-blue-500/10 text-blue-600 border-blue-200/50' },
    READY: { label: 'Listo', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50' },
    DELIVERED: { label: 'Entregado', color: 'bg-green-500/10 text-green-600 border-green-200/50' },
    CANCELLED: { label: 'Cancelado', color: 'bg-red-500/10 text-red-600 border-red-200/50' },
};

export const SessionOrdersTableRow = ({ order, onViewDetail }: SessionOrdersTableRowProps) => {
    const status = statusConfig[order.orderStatus as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
        <TableRow className="group hover:bg-primary/5 border-primary/5 transition-colors h-20">
            <TableCell className="px-6">
                <span className="font-black text-lg text-foreground">
                    #{order.orderNumber.split('-').pop()}
                </span>
            </TableCell>
            <TableCell className="px-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted group-hover:bg-background transition-colors border shadow-sm shrink-0">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-bold truncate max-w-37.5">
                        {order.customer || 'Público General'}
                    </span>
                </div>
            </TableCell>
            <TableCell className="text-center px-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-black text-foreground tabular-nums">
                        {formatPrice(order.total)}
                    </span>
                    <div className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-tight",
                        order.paymentMethod === 'CASH'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50'
                            : 'bg-violet-500/10 text-violet-600 border-violet-200/50'
                    )}>
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
            <TableCell className="text-center px-4">
                <Badge variant="outline" className={cn(status.color, "px-3 py-1 text-[10px] font-black uppercase border-2 shadow-none")}>
                    {status.label}
                </Badge>
            </TableCell>
            <TableCell className="text-center px-4">
                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                    {new Date(order.orderDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </TableCell>
            <TableCell className="text-right pr-6">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-primary border-primary/20 hover:bg-primary hover:text-white transition-all duration-300"
                    onClick={() => onViewDetail(order)}
                >
                    <Eye className="h-5 w-5" />
                </Button>
            </TableCell>
        </TableRow>
    );
};
