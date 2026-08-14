import { useState } from 'react';
import {
    ChevronDown,
    AlertCircle,
    Vault,
    ClipboardCheck,
    Calculator,
    Info,
    Printer,
    FileText,
    ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/product.utils';
import { api } from '@/api/axiosConfig';
import { printComponent } from '@/utils/print.utils';
import { ThermalSessionTicket } from '@/components/shared/ThermalSessionTicket';
import type { CashierSession, CloseSessionResponse } from '@/types/cashierSession';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { SessionHeader } from './turno-detalle/SessionHeader';
import { SessionAuditSection, AuditRow, AuditTotal } from './turno-detalle/SessionAuditSection';
import { SessionObservations } from './turno-detalle/SessionObservations';
import { SessionOrdersDialog } from './turno-detalle/SessionOrdersDialog';

interface TurnoDetalleCardProps {
    session: CashierSession;
}

export const TurnoDetalleCard = ({ session }: TurnoDetalleCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
    const isClosed = session.status === 'CLOSED';

    const openingTime = new Date(session.openingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const closingTime = session.closingDate
        ? new Date(session.closingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'En curso';

    const hasDifference = session.difference && parseFloat(session.difference) !== 0;

    // --- Lógica de Cálculos (Sistema vs Cajero) ---
    const initialBase = parseFloat(session.initialAmount?.toString() || "0");
    const sysCashSales = parseFloat(session.totalCash || "0");
    const sysQrSales = parseFloat(session.totalQr || "0");

    const expectedCashInBox = sysCashSales + initialBase;
    const expectedQrInBox = sysQrSales;
    const totalExpectedInSession = expectedCashInBox + expectedQrInBox;

    const reportedCash = session.closingCashAmount !== null ? parseFloat(session.closingCashAmount.toString()) : null;
    const reportedQr = session.closingQrAmount !== null ? parseFloat(session.closingQrAmount.toString()) : null;
    const totalReported = (reportedCash !== null && reportedQr !== null) ? (reportedCash + reportedQr) : null;

    const netSales = parseFloat(session.totalSales || "0");

    const closedSummary: CloseSessionResponse['summary'] | null = isClosed ? {
        sessionId: session.idSession,
        startTime: session.openingDate,
        endTime: session.closingDate ?? new Date().toISOString(),
        initialCash: Number(session.initialAmount),
        cashSales: Number(session.totalCash),
        totalExpectedCash: initialBase + sysCashSales,
        declaredCash: Number(session.closingCashAmount),
        totalExpectedQr: sysQrSales,
        declaredQr: Number(session.closingQrAmount),
        difference: Number(session.difference),
        totalOrders: session.orderCount,
    } : null;

    const handlePrintSummary = () => {
        if (!closedSummary) return;
        printComponent(ThermalSessionTicket, { summary: closedSummary });
    };

    const handleDownloadPdf = async () => {
        if (!isClosed) return;
        try {
            const res = await api.get(`/cashier-sessions/${session.idSession}/report/pdf`, {
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

    return (
        <div
            className={cn(
                "@container group relative flex flex-col bg-card rounded-[2rem] border-2 transition-all duration-500 shadow-sm overflow-hidden",
                isExpanded ? "border-primary/40 bg-primary/2" : "border-border/40 hover:border-primary/20"
            )}
        >
            {/* --- CABECERA (Collapsed View) --- */}
            <div className="flex flex-wrap @5xl:flex-nowrap items-start @5xl:items-center p-4 @3xl:p-5 @5xl:p-6 gap-4 @3xl:gap-6">
                <SessionHeader
                    session={session}
                    netSales={netSales}
                    totalExpected={totalExpectedInSession}
                    openingTime={openingTime}
                    closingTime={closingTime}
                    isClosed={isClosed}
                />

                <div className="flex items-center gap-2 @3xl:gap-3 w-full @5xl:w-auto justify-end pt-2 @5xl:pt-0 border-t border-border/40 @5xl:border-0 mt-2 @5xl:mt-0">
                    {/* Botón Ver Pedidos con Contador */}
                    <div className="relative group/orders">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOrdersDialogOpen(true);
                            }}
                            variant="outline"
                            className="h-10 @3xl:h-12 @5xl:h-14 px-4 @3xl:px-5 @5xl:px-6 rounded-3xl bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 border-blue-500/20 shadow-sm gap-2 @5xl:gap-3 font-black uppercase tracking-tight shrink-0 flex items-center text-xs @3xl:text-sm"
                        >
                            <ShoppingBag className="h-5 w-5 @3xl:h-6 @3xl:w-6 transition-transform group-hover/orders:scale-110" />
                            <span className="hidden @2xl:inline">Ver Pedidos</span>
                            <span className="inline @2xl:hidden">Pedidos</span>
                        </Button>
                    </div>

                    {isClosed && (
                        <>
                            {/* Botón Imprimir Resumen (Térmica) */}
                            <div className="relative group/print">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrintSummary();
                                    }}
                                    variant="outline"
                                    className="h-10 @3xl:h-12 @5xl:h-14 px-4 @3xl:px-5 @5xl:px-6 rounded-3xl bg-slate-100 text-slate-700 hover:bg-slate-700 hover:text-white transition-all duration-300 border-slate-300/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-200 dark:hover:text-slate-900 shadow-sm gap-2 @5xl:gap-3 font-black uppercase tracking-tight shrink-0 flex items-center text-xs @3xl:text-sm active:scale-95"
                                >
                                    <Printer className="h-5 w-5 @3xl:h-6 @3xl:w-6 transition-transform group-hover/print:scale-110" />
                                    <span>Resumen</span>
                                </Button>
                            </div>

                            {/* Botón Reporte PDF */}
                            <div className="relative group/pdf">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadPdf();
                                    }}
                                    variant="outline"
                                    className="h-10 @3xl:h-12 @5xl:h-14 px-4 @3xl:px-5 @5xl:px-6 rounded-3xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 border-primary/20 shadow-sm gap-2 @5xl:gap-3 font-black uppercase tracking-tight shrink-0 flex items-center text-xs @3xl:text-sm active:scale-95"
                                >
                                    <FileText className="h-5 w-5 @3xl:h-6 @3xl:w-6 transition-transform group-hover/pdf:scale-110" />
                                    <span className="hidden @2xl:inline">Reporte PDF</span>
                                    <span className="inline @2xl:hidden">PDF</span>
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Botón Expansión */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className={cn(
                            "h-10 w-10 @3xl:h-12 @3xl:w-12 @5xl:h-14 @5xl:w-14 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-primary/5 shrink-0",
                            isExpanded
                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30 rotate-180"
                                : "bg-muted/50 text-foreground hover:bg-primary/20 hover:text-primary hover:scale-105 active:scale-95"
                        )}
                    >
                        <ChevronDown className="h-5 w-5 @3xl:h-6 @3xl:w-6 @5xl:h-7 @5xl:w-7" />
                    </button>
                </div>
            </div>

            {/* Dialog de Pedidos */}
            <SessionOrdersDialog
                open={isOrdersDialogOpen}
                onOpenChange={setIsOrdersDialogOpen}
                sessionId={session.idSession}
                sessionNumber={session.idSession}
                cashierName={session.user?.fullName || 'Cajero'}
            />

            {/* --- DETALLE ANALÍTICO (Expanded View) --- */}
            {isExpanded && (
                <div className="px-4 @3xl:px-6 @5xl:px-8 pb-6 @3xl:pb-8 animate-in mt-0 @3xl:mt-2 slide-in-from-top-4 duration-500">
                    <Separator className="mb-4 @3xl:mb-6 opacity-40" />

                    <div className="grid grid-cols-1 @5xl:grid-cols-3 gap-4 @3xl:gap-6 items-stretch">
                        <SessionAuditSection
                            title="Cálculo del Sistema"
                            icon={Calculator}
                            iconClassName="text-primary/60"
                            containerClassName="bg-muted/20 border-border/40"
                        >
                            <div className="space-y-4">
                                <AuditRow label="Base Inicial" value={formatPrice(initialBase.toString())} />
                                <AuditRow label="Ventas Efectivo" value={formatPrice(sysCashSales.toString())} />
                                <AuditRow label="Ventas Digital QR" value={formatPrice(sysQrSales.toString())} showSeparator />
                                <AuditTotal label="Total Esperado" value={formatPrice(totalExpectedInSession.toString())} valueClassName="text-primary" />
                            </div>
                        </SessionAuditSection>

                        <SessionAuditSection
                            title="Declaración de Cierre"
                            icon={ClipboardCheck}
                            iconClassName="text-emerald-500/60"
                            containerClassName={cn(
                                isClosed ? "bg-emerald-500/3 border-emerald-500/20" : "bg-slate-50 border-dashed border-slate-300 dark:bg-slate-900/40"
                            )}
                        >
                            {!isClosed ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center animate-pulse">
                                        <Info className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Pendiente de cierre</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AuditRow label="Efectivo Contado" value={formatPrice(reportedCash?.toString() || "0")} valueClassName="text-emerald-700" />
                                    <AuditRow label="QR Reportado" value={formatPrice(reportedQr?.toString() || "0")} valueClassName="text-emerald-700" showSeparator />
                                    <AuditTotal label="Total Declarado" value={formatPrice(totalReported?.toString() || "0")} valueClassName="text-emerald-700" />
                                </div>
                            )}
                        </SessionAuditSection>

                        <SessionAuditSection
                            title="Resultado de Auditoría"
                            icon={AlertCircle}
                            iconClassName={hasDifference ? "text-red-500" : "text-emerald-500"}
                            containerClassName={cn(
                                hasDifference ? "bg-red-500/4 border-red-500/30 shadow-sm" : "bg-emerald-500/4 border-emerald-500/30 shadow-sm"
                            )}
                        >
                            {isClosed ? (
                                <div className="flex flex-col items-center justify-center gap-6 h-full py-2">
                                    <div className={cn(
                                        "h-20 w-20 rounded-full flex items-center justify-center border-4 shadow-sm",
                                        hasDifference ? "bg-red-500/10 border-red-500/20 text-red-600" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                    )}>
                                        {hasDifference ? <AlertCircle className="h-10 w-10" /> : <Vault className="h-10 w-10" />}
                                    </div>
                                    <div className="text-center space-y-2">
                                        <span className={cn(
                                            "text-4xl font-black tracking-tighter leading-none",
                                            hasDifference ? "text-red-700" : "text-emerald-700"
                                        )}>
                                            {formatPrice(session.difference || "0")}
                                        </span>
                                        <p className={cn(
                                            "text-xs font-black uppercase tracking-tight",
                                            hasDifference ? "text-red-700/60" : "text-emerald-700/60"
                                        )}>
                                            {hasDifference ? 'Diferencia Detectada' : 'Balance Perfecto'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 opacity-30 gap-3">
                                    <Vault className="h-12 w-12" />
                                    <p className="text-[10px] font-black uppercase text-center max-w-35">Esperando consolidación</p>
                                </div>
                            )}
                        </SessionAuditSection>
                    </div>

                    <SessionObservations observations={session.observations || ''} />
                </div>
            )}
        </div>
    );
};
