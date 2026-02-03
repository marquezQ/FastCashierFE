import { Clock, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryHeaderProps {
    orderCount: number;
    onRefresh: () => void;
}

export const HistoryHeader = ({ orderCount, onRefresh }: HistoryHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-green-700 dark:text-green-400">
                    Historial de Pedidos
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Reporte detallado de ventas del turno actual
                </p>
            </div>
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={onRefresh}
                    className="h-12 bg-background border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 gap-2 hover:bg-green-50 px-6 font-bold"
                >
                    <Clock className="h-5 w-5" /> Actualizar
                </Button>
                <div className="flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-2xl border border-green-500/20">
                    <ClipboardList className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="text-base font-bold text-green-700 dark:text-green-300">
                        {orderCount} pedidos
                    </span>
                </div>
            </div>
        </div>
    );
};
