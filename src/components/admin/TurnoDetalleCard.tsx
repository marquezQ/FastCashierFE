import { useState } from 'react';
import {
    ChevronDown,
    AlertCircle,
    Vault,
    ClipboardCheck,
    Calculator,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/product.utils';
import type { CashierSession } from '@/types/cashierSession';
import { Separator } from '@/components/ui/separator';
import { SessionHeader } from './turno-detalle/SessionHeader';
import { SessionAuditSection, AuditRow, AuditTotal } from './turno-detalle/SessionAuditSection';
import { SessionObservations } from './turno-detalle/SessionObservations';

interface TurnoDetalleCardProps {
    session: CashierSession;
}

export const TurnoDetalleCard = ({ session }: TurnoDetalleCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
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

    return (
        <div
            className={cn(
                "group relative flex flex-col bg-card rounded-[2rem] border-2 transition-all duration-500 shadow-sm overflow-hidden",
                isExpanded ? "border-primary/40 bg-primary/2" : "border-border/40 hover:border-primary/20"
            )}
        >
            {/* --- CABECERA (Collapsed View) --- */}
            <div className="flex items-center p-5 md:p-7 gap-6">
                <SessionHeader
                    session={session}
                    netSales={netSales}
                    totalExpected={totalExpectedInSession}
                    openingTime={openingTime}
                    closingTime={closingTime}
                    isClosed={isClosed}
                />

                {/* Botón Expansión */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className={cn(
                        "h-14 w-14 rounded-4xl flex items-center justify-center transition-all duration-300 ring-4 ring-primary/5 shrink-0",
                        isExpanded
                            ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30 rotate-180"
                            : "bg-muted/50 text-foreground hover:bg-primary/20 hover:text-primary hover:scale-105 active:scale-95"
                    )}
                >
                    <ChevronDown className="h-7 w-7" />
                </button>
            </div>

            {/* --- DETALLE ANALÍTICO (Expanded View) --- */}
            {isExpanded && (
                <div className="px-6 md:px-8 pb-8 animate-in mt-2 slide-in-from-top-4 duration-500">
                    <Separator className="mb-8 opacity-40" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
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
