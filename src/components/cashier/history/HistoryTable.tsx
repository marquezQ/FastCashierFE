import { ClipboardList } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { HistoryTableRow } from './HistoryTableRow';
import type { Order } from '@/types/order';

interface HistoryTableProps {
    orders: Order[];
    isLoading: boolean;
    searchQuery: string;
    onViewDetail: (order: Order) => void;
    onCancel: (orderId: number, reason: string) => void;
    isCancelling: boolean;
}

export const HistoryTable = ({
    orders,
    isLoading,
    searchQuery,
    onViewDetail,
    onCancel,
    isCancelling
}: HistoryTableProps) => {
    return (
        <Card className="border-green-100 dark:border-green-900 overflow-hidden shadow-lg bg-card/50 backdrop-blur-sm mx-2">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-green-100 dark:border-green-900 h-16">
                        <TableHead className="w-35 font-bold text-xs uppercase tracking-widest pl-6">Pedido</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-left px-4">Cliente</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-center">Total Pedido</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-center">Estado</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-center">Fecha y Hora</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-center pr-6">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-48 text-center border-none">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-10 w-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                                    <span className="text-sm font-medium text-muted-foreground">Cargando datos del turno...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <HistoryTableRow
                                key={order.idOrder}
                                order={order}
                                onViewDetail={onViewDetail}
                                onCancel={onCancel}
                                isCancelling={isCancelling}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-80 text-center border-none">
                                <div className="flex flex-col items-center justify-center text-muted-foreground p-12">
                                    <div className="bg-muted/50 p-6 rounded-full mb-6 border shadow-inner">
                                        <ClipboardList className="h-12 w-12 opacity-30 text-green-600" />
                                    </div>
                                    <p className="font-black text-xl text-foreground/80">
                                        {searchQuery ? 'Sin coincidencias encontradas' : 'Turno sin pedidos registrados'}
                                    </p>
                                    <p className="text-base max-w-87.5 mt-2 font-medium">
                                        {searchQuery ? 'Prueba ajustando los términos de tu búsqueda por cliente o ticket' : 'Las transacciones que realices en este terminal aparecerán aquí'}
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
};
