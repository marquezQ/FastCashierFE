import { formatPrice } from '@/utils/product.utils';
import type { CloseSessionResponse } from '@/types/cashierSession';

interface ThermalSessionTicketProps {
    summary: CloseSessionResponse['summary'];
}

export const ThermalSessionTicket = ({ summary }: ThermalSessionTicketProps) => {
    const startTime = new Date(summary.startTime).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    // We expect endTime to be a valid date from the backend
    const endTime = new Date(summary.endTime).toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div style={{
            width: '80mm',
            padding: '3mm',
            backgroundColor: 'white',
            color: 'black',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.2'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                    CIERRE DE CAJA
                </div>
                <div style={{ fontSize: '14px', margin: '2px 0' }}>
                    Turno #{summary.sessionId}
                </div>
                <div style={{ borderTop: '1px dashed black', marginTop: '2px' }}></div>
            </div>

            {/* Info */}
            <div style={{ marginBottom: '8px', fontSize: '11px' }}>
                <div>INICIO: {startTime}</div>
                <div>FIN: {endTime}</div>
                <div>ÓRDENES ATENDIDAS: {summary.totalOrders}</div>
            </div>

            {/* Financial Details */}
            <div style={{ borderBottom: '1px solid black', marginBottom: '8px', paddingBottom: '8px' }}>
                <div style={{ paddingBottom: '4px', borderBottom: '1px dotted #ccc', marginBottom: '4px', fontWeight: 'bold' }}>
                    CAJA Y EFECTIVO
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Efectivo Inicial:</span>
                    <span>{formatPrice(summary.initialCash?.toString() || '0')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Ventas Efectivo:</span>
                    <span>{formatPrice(summary.cashSales?.toString() || '0')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold' }}>
                    <span>Efectivo Esperado:</span>
                    <span>{formatPrice(summary.totalExpectedCash?.toString() || '0')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span>Efectivo (Físico Caja):</span>
                    <span>{formatPrice(summary.declaredCash?.toString() || '0')}</span>
                </div>

                <div style={{ paddingTop: '8px', paddingBottom: '4px', borderBottom: '1px dotted #ccc', marginBottom: '4px', fontWeight: 'bold', marginTop: '6px' }}>
                    TRANSACCIONES (QR)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Ventas QR Esperado:</span>
                    <span>{formatPrice(summary.totalExpectedQr?.toString() || '0')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Ventas QR Declarado:</span>
                    <span>{formatPrice(summary.declaredQr?.toString() || '0')}</span>
                </div>
            </div>

            {/* Totals */}
            <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid black' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px' }}>
                    <span>TOTAL GENERAL:</span>
                    <span>
                        {formatPrice((
                            Number(summary.totalExpectedCash || 0) + 
                            Number(summary.totalExpectedQr || 0)
                        ).toString())}
                    </span>
                </div>
            </div>

            {/* Difference */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    SOBRANTE / FALTANTE TOTAL
                </div>
                <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    marginTop: '2px' 
                }}>
                    {summary.difference > 0 ? '+' : ''}{formatPrice(summary.difference?.toString() || '0')}
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '10px' }}>
                <div>CIERRE GENERADO POR SISTEMA</div>
                <div style={{ marginTop: '5px' }}>www.fastcashier.com</div>
            </div>
        </div>
    );
};
