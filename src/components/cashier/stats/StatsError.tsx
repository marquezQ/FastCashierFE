import { Activity } from 'lucide-react';

interface StatsErrorProps {
    onRetry: () => void;
}

export const StatsError = ({ onRetry }: StatsErrorProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="bg-destructive/10 p-4 rounded-full">
                <Activity className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold">Error al cargar estadísticas</h3>
                <p className="text-muted-foreground">No pudimos obtener la información de tu turno actual.</p>
            </div>
            <button
                onClick={onRetry}
                className="text-emerald-600 hover:underline font-medium"
            >
                Intentar de nuevo
            </button>
        </div>
    );
};
