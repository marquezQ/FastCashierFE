import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/utils/product.utils';
import type { SessionStatistics } from '@/types/cashierSession';

interface CashClosingCardProps {
    stats: SessionStatistics;
}

export const CashClosingCard = ({ stats }: CashClosingCardProps) => {
    return (
        <Card className="border-border/40 shadow-xl overflow-hidden rounded-2xl border-l-8 border-l-emerald-600">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">Cruce de Caja</CardTitle>
                        <CardDescription className="text-xs">Montos para Arqueo</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-start group">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Efectivo Físico Esperado
                            </span>
                            <p className="text-[10px] text-muted-foreground/60 max-w-50 leading-tight font-medium">
                                Suma de base inicial ({formatPrice(stats.initialAmount.toString())}) más ventas en efectivo.
                            </p>
                        </div>
                        <span className="text-xl font-bold text-foreground tabular-nums tracking-tight">
                            {formatPrice(stats.expectedCash.toString())}
                        </span>
                    </div>

                    <div className="flex justify-between items-start group">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-violet-500" /> Conciliación Digital (QR)
                            </span>
                            <p className="text-[10px] text-muted-foreground/60 max-w-45 leading-tight font-medium">Total de transacciones por medios digitales.</p>
                        </div>
                        <span className="text-xl font-bold text-foreground tabular-nums tracking-tight">
                            {formatPrice(stats.expectedQr.toString())}
                        </span>
                    </div>
                </div>

                <Separator className="bg-border/40" />

                <div className="bg-emerald-600 shadow-xl shadow-emerald-500/10 p-5 rounded-2xl flex flex-col items-center gap-1 group transition-all duration-300">
                    <span className="text-[9px] font-bold text-white/70 tracking-[0.2em] uppercase">Recaudación Total</span>
                    <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
                        {formatPrice((stats.expectedCash + stats.expectedQr).toString())}
                    </span>
                </div>

                <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 border-dotted">
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 leading-relaxed text-center italic tracking-tight">
                        "ESTE RESUMEN DEBE COINCIDIR CON EL CONTEO FÍSICO AL MOMENTO DEL CIERRE."
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
