import { Calendar, RefreshCw, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface StatsHeaderProps {
    formattedDate: string;
    formattedTime: string;
    responsibleName: string;
    isFetching: boolean;
    refetch: () => void;
}

export const StatsHeader = ({
    formattedDate,
    formattedTime,
    responsibleName,
    isFetching,
    refetch
}: StatsHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                        Estadísticas
                    </h1>
                    <Badge variant="outline" className="h-5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold px-2.5 rounded-full animate-pulse text-[10px]">
                        TURNO ACTIVO
                    </Badge>
                </div>
                <p className="text-muted-foreground font-medium flex items-center gap-2 capitalize text-lg">
                    <Calendar className="h-5 w-5 text-emerald-500/60" />
                    {formattedDate}
                </p>
            </div>

            <div className="flex items-center gap-5 bg-card border border-border/40 px-5 py-3 rounded-2xl shadow-md shadow-foreground/5 backdrop-blur-xl">
                <button
                    onClick={refetch}
                    disabled={isFetching}
                    className="group flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-emerald-500/5 transition-all disabled:opacity-50"
                    title="Sincronizar datos"
                >
                    <RefreshCw className={`h-4.5 w-4.5 text-emerald-600 transition-all duration-700 ${isFetching ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                    <span className="text-[9px] font-bold uppercase text-emerald-600/60 mt-0.5 tracking-tight">Sync</span>
                </button>
                <Separator orientation="vertical" className="h-8 bg-border/40" />
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-0.5">Cajero</span>
                    <span className="text-xs font-bold flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Users className="h-3 w-3 text-emerald-600" />
                        </div>
                        {responsibleName}
                    </span>
                </div>
                <Separator orientation="vertical" className="h-8 bg-border/40" />
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground/60 tracking-wider mb-0.5">Apertura</span>
                    <span className="text-xs font-bold flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Clock className="h-3 w-3 text-emerald-600" />
                        </div>
                        {formattedTime}
                    </span>
                </div>
            </div>
        </div>
    );
};
