import { Receipt, Wallet, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/utils/product.utils';
import type { SessionStatistics } from '@/types/cashierSession';

interface SalesDistributionCardProps {
    stats: SessionStatistics;
}

export const SalesDistributionCard = ({ stats }: SalesDistributionCardProps) => {
    return (
        <Card className="border-border/40 shadow-md overflow-hidden rounded-2xl">
            <CardHeader className="bg-muted/30 border-b border-border/50 py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                        <Receipt className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">Distribución de Ventas</CardTitle>
                        <CardDescription className="text-xs">Por método de pago</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 p-2 rounded-lg">
                                <Wallet className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Efectivo</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">{stats.cashOrderCount} Órdenes (Incluye apertura)</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                                {formatPrice(stats.expectedCash.toString())}
                            </p>
                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase">
                                {((stats.expectedCash / stats.totalSales) * 100 || 0).toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    <Separator className="bg-border/40" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-violet-500/10 p-2 rounded-lg">
                                <QrCode className="h-4 w-4 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Transferencia / QR</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">{stats.qrOrderCount} Órdenes</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-violet-600">
                                {formatPrice(stats.expectedQr.toString())}
                            </p>
                            <p className="text-[10px] font-bold text-violet-600/60 uppercase">
                                {((stats.expectedQr / stats.totalSales) * 100 || 0).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
