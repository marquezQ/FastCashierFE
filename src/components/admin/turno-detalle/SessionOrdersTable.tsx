import { MoveRight, ShoppingBag } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SessionOrdersTableRow } from './SessionOrdersTableRow';
import type { Order } from '@/types/order';

interface SessionOrdersTableProps {
    orders: Order[];
    isLoading: boolean;
    searchQuery: string;
    onViewDetail: (order: Order) => void;
}

export const SessionOrdersTable = ({
    orders,
    isLoading,
    searchQuery,
    onViewDetail
}: SessionOrdersTableProps) => {
    return (
        <div className="rounded-3xl border-2 border-primary/5 overflow-hidden bg-card/50 mt-6">
            <div className="md:hidden flex items-center gap-1.5 px-4 pt-3 pb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <MoveRight className="h-3 w-3" /> Desliza para ver más
                </span>
            </div>
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-primary/10 h-14">
                        <TableHead className="w-32 font-black text-[10px] uppercase tracking-widest px-3 md:px-6">Pedido</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest px-3 md:px-4">Cliente</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-center px-3 md:px-4">Total</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-center px-3 md:px-4">Estado</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-center px-3 md:px-4">Hora</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-4 md:pr-6">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-48 text-center border-none">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Cargando pedidos...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <SessionOrdersTableRow
                                key={order.idOrder}
                                order={order}
                                onViewDetail={onViewDetail}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-64 text-center border-none">
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <div className="bg-muted/50 p-6 rounded-full mb-4 border shadow-inner">
                                        <ShoppingBag className="h-12 w-12 opacity-30 text-primary" />
                                    </div>
                                    <p className="font-black text-xl text-foreground/80 lowercase first-letter:uppercase tracking-tight">
                                        {searchQuery ? 'Sin coincidencias' : 'No hay pedidos'}
                                    </p>
                                    <p className="text-sm max-w-xs mt-1 font-medium italic">
                                        {searchQuery ? 'Prueba con otro término de búsqueda' : 'Esta sesión no tiene pedidos registrados todavía'}
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
