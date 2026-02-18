import { MessageSquare } from 'lucide-react';

interface SessionObservationsProps {
    observations: string;
}

export const SessionObservations = ({ observations }: SessionObservationsProps) => {
    if (!observations) return null;

    return (
        <div className="mt-8 p-6 md:p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-border/60 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-inner">
            <div className="h-14 w-14 rounded-2xl bg-background border border-border/80 flex items-center justify-center text-muted-foreground shrink-0 shadow-sm">
                <MessageSquare className="h-7 w-7" />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em]">Observaciones del Cajero</span>
                    <div className="h-px w-12 bg-border/80" />
                </div>
                <p className="text-lg font-medium text-foreground/80 tracking-tight leading-relaxed italic pr-4">
                    "{observations}"
                </p>
            </div>
        </div>
    );
};
