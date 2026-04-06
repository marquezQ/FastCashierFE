import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, FileText, LogOut, Printer, QrCode, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { api } from '@/api/axiosConfig';
import { printComponent } from '@/utils/print.utils';
import { ThermalSessionTicket } from '@/components/shared/ThermalSessionTicket';
import type { CloseSessionResponse } from '@/types/cashierSession';
import { formatPrice } from '@/utils/product.utils';
import { useCashierSession } from '@/hooks/useCashierSession';
import { useCashierStore } from '@/store/useCashierStore';

interface CloseSessionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CloseSessionDialog = ({ isOpen, onOpenChange }: CloseSessionDialogProps) => {
    const queryClient = useQueryClient();
    const { closeSession: clearSessionStore } = useCashierStore();
    const { closeSession, isClosing } = useCashierSession();

    // Form state
    const [closingCash, setClosingCash] = useState('');
    const [closingQr, setClosingQr] = useState('');
    const [observations, setObservations] = useState('');
    const [closedSummary, setClosedSummary] = useState<CloseSessionResponse['summary'] | null>(null);

    const handleCloseSession = async () => {
        if (!closingCash || isNaN(Number(closingCash)) || Number(closingCash) < 0) return;
        if (!closingQr || isNaN(Number(closingQr)) || Number(closingQr) < 0) return;

        try {
            const response = await closeSession({
                closingCashAmount: Number(closingCash),
                closingQrAmount: Number(closingQr),
                observations: observations.trim() || undefined
            });
            
            // Show success summary
            setClosedSummary(response.summary);
            
            // Reset form
            setClosingCash('');
            setClosingQr('');
            setObservations('');
        } catch (error) {
            // Error managed by hook
        }
    };

    const handleDownloadPdf = async () => {
        if (!closedSummary) return;
        try {
            const res = await api.get(`/cashier-sessions/${closedSummary.sessionId}/report/pdf`, {
                responseType: 'blob'
            });
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    const handleFinalize = () => {
        onOpenChange(false);
        setClosedSummary(null);
        clearSessionStore();
        queryClient.invalidateQueries({ queryKey: ['current-cashier-session'] });
        queryClient.invalidateQueries({ queryKey: ['cashier-sessions'] });
        queryClient.invalidateQueries({ queryKey: ['cashier-session-statistics'] });
    };

    // If reopening the dialog, ensure summary is cleared
    const handleOpenChange = (open: boolean) => {
        if (open) {
            setClosedSummary(null);
            setClosingCash('');
            setClosingQr('');
            setObservations('');
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 md:h-9 px-2 md:px-4 text-[10px] md:text-sm font-bold shadow-md shadow-destructive/10 transition-all active:scale-95 flex items-center gap-1 md:gap-2"
                >
                    <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="hidden min-[400px]:inline">Cerrar Turno</span>
                    <span className="min-[400px]:hidden">Cerrar</span>
                </Button>
            </DialogTrigger>
            
            <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
                {closedSummary ? (
                    <div className="flex flex-col">
                        <DialogHeader className="mb-4">
                            <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-3">
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <DialogTitle className="text-center text-xl md:text-2xl font-black text-green-700 dark:text-green-500">
                                ¡Turno Cerrado Exitosamente!
                            </DialogTitle>
                            <DialogDescription className="text-center text-sm font-medium">
                                El turno #{closedSummary.sessionId} ha sido archivado en el sistema.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="bg-muted/30 rounded-xl p-4 border border-border/50 mb-4 space-y-3">
                            <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                                <span className="text-muted-foreground font-semibold">Total Órdenes</span>
                                <span className="font-black text-foreground">{closedSummary.totalOrders}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                                <span className="text-muted-foreground font-semibold">Efectivo Esperado</span>
                                <span className="font-medium">{formatPrice(closedSummary.totalExpectedCash.toString())}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                                <span className="text-muted-foreground font-semibold">Efectivo Declarado</span>
                                <span className="font-medium">{formatPrice(closedSummary.declaredCash.toString())}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                                <span className="text-muted-foreground font-semibold">QR / Transf. Esperado</span>
                                <span className="font-medium">{formatPrice(closedSummary.totalExpectedQr.toString())}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                                <span className="text-muted-foreground font-semibold">QR / Transf. Declarado</span>
                                <span className="font-medium">{formatPrice(closedSummary.declaredQr.toString())}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                                <span className="text-muted-foreground font-semibold">Total General</span>
                                <span className="font-black">
                                    {formatPrice((
                                        Number(closedSummary.totalExpectedCash) + 
                                        Number(closedSummary.totalExpectedQr)
                                    ).toString())}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-base pt-1">
                                <span className="font-black uppercase text-muted-foreground text-xs tracking-wider">Diferencia Total</span>
                                <span className={`font-black ${closedSummary.difference < 0 ? 'text-red-500' : closedSummary.difference > 0 ? 'text-green-500' : 'text-blue-500'}`}>
                                    {closedSummary.difference > 0 ? '+' : ''}{formatPrice(closedSummary.difference.toString())}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-auto">
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <Button 
                                    variant="outline" 
                                    className="font-bold gap-2 text-primary border-primary/20 hover:bg-primary/5 w-full h-11"
                                    onClick={() => printComponent(ThermalSessionTicket, { summary: closedSummary })}
                                >
                                    <Printer className="h-4 w-4" /> Imprimir Resumen
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="font-bold gap-2 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 w-full h-11"
                                    onClick={handleDownloadPdf}
                                >
                                    <FileText className="h-4 w-4" /> Reporte PDF
                                </Button>
                            </div>
                            <Button 
                                className="w-full font-black uppercase tracking-widest text-white shadow-lg bg-emerald-600 hover:bg-emerald-700 h-12" 
                                onClick={handleFinalize}
                            >
                                Finalizar Turno
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive text-lg md:text-xl font-bold">
                                <AlertTriangle className="h-5 w-5 animate-pulse" />
                                Cerrar Turno de Caja
                            </DialogTitle>
                            <DialogDescription className="text-xs md:text-sm font-medium">
                                Realice el conteo final para completar el arqueo.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="closingCash" className="font-bold text-xs md:text-sm flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-primary" /> Efectivo Final ($)
                                </Label>
                                <Input
                                    id="closingCash"
                                    type="number"
                                    placeholder="0.00"
                                    className="h-11 bg-muted/30 focus:ring-2 focus:ring-destructive/20 border-border/50"
                                    value={closingCash}
                                    onChange={(e) => setClosingCash(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="closingQr" className="font-bold text-xs md:text-sm flex items-center gap-2">
                                    <QrCode className="h-4 w-4 text-primary" /> Total QR / Transf.
                                </Label>
                                <Input
                                    id="closingQr"
                                    type="number"
                                    placeholder="0.00"
                                    className="h-11 bg-muted/30 focus:ring-2 focus:ring-destructive/20 border-border/50"
                                    value={closingQr}
                                    onChange={(e) => setClosingQr(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="obs" className="font-bold text-xs md:text-sm text-muted-foreground">Observaciones (Opcional)</Label>
                                <Input
                                    id="obs"
                                    placeholder="Notas adicionales sobre el turno..."
                                    className="h-11 bg-muted/30 border-border/50"
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                            <DialogClose asChild>
                                <Button variant="ghost" className="w-full sm:w-auto font-semibold" disabled={isClosing}>Cancelar</Button>
                            </DialogClose>
                            <Button
                                variant="destructive"
                                onClick={handleCloseSession}
                                disabled={isClosing || !closingCash || !closingQr}
                                className="w-full sm:w-auto font-bold shadow-lg shadow-destructive/20 gap-2"
                            >
                                {isClosing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Procesando...
                                    </>
                                ) : 'Confirmar Cierre de Caja'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
