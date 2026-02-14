import { TurnoDetalleCard } from '../TurnoDetalleCard';
import { Calendar } from 'lucide-react';
import type { CashierSession } from '@/types/cashierSession';

interface TurnoListProps {
    groupedSessions: [string, CashierSession[]][];
    formatDateHeader: (dateStr: string) => string;
}

export const TurnoList = ({ groupedSessions, formatDateHeader }: TurnoListProps) => {
    return (
        <div className="space-y-12 mt-4 relative">
            {groupedSessions.map(([date, sessions]) => (
                <div key={date} className="space-y-6 relative">
                    <div className="flex items-center gap-4 bg-background sticky top-18 z-10 py-2">
                        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-muted/60 border border-border/50 shadow-sm backdrop-blur-sm">
                            <div className="p-1 rounded-full bg-primary/20">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/80">
                                {formatDateHeader(date)}
                            </h3>
                        </div>
                        <div className="h-px flex-1 bg-linear-to-r from-muted-foreground/20 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 gap-6 ml-0">
                        {sessions.map((session) => (
                            <TurnoDetalleCard key={session.idSession} session={session} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
