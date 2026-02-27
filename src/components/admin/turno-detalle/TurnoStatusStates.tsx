import { RefreshCw, Calendar, CalendarRange, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TurnoErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20 text-destructive gap-4">
        <div className="p-4 rounded-full bg-destructive/10">
            <RefreshCw className="h-10 w-10 text-destructive" />
        </div>
        <div className="text-center">
            <p className="font-bold text-lg">Error al cargar datos</p>
            <p className="text-sm opacity-80 mb-4 tracking-tight">Verifica tu conexión o intenta nuevamente</p>
            <Button
                variant="outline"
                onClick={onRetry}
                className="rounded-xl font-bold border-destructive/20 text-destructive hover:bg-destructive/10"
            >
                Reintentar
            </Button>
        </div>
    </div>
);

export const TurnoLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
            <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Calendar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary/40" />
        </div>
        <p className="font-bold text-muted-foreground animate-pulse tracking-wide">Analizando periodos financieros...</p>
    </div>
);

export const TurnoRangePrompt = () => (
    <div className="flex flex-col items-center justify-center py-24 bg-muted/5 rounded-[3rem] border-2 border-dashed border-border/40">
        <div className="p-8 rounded-full bg-primary/5 mb-6 border border-primary/10">
            <CalendarRange className="h-16 w-16 text-primary/30" />
        </div>
        <h2 className="admin-h2 uppercase tracking-tighter">Búsqueda por Rango</h2>
        <p className="admin-subtitle max-w-sm text-center">
            Selecciona la fecha de inicio y fin arriba para consultar el historial de turnos en ese periodo.
        </p>
    </div>
);

export const TurnoEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-32 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/40">
        <div className="p-8 rounded-full bg-muted/50 mb-6 border shadow-inner">
            <ClipboardList className="h-16 w-16 text-muted-foreground/20" />
        </div>
        <h2 className="admin-h2 uppercase tracking-tighter">Sin registros encontrados</h2>
        <p className="admin-subtitle max-w-sm text-center">
            Ajusta el rango de fechas o los filtros de búsqueda para visualizar los turnos de caja registrados.
        </p>
    </div>
);
