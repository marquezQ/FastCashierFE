import { formatPrice } from '@/utils/product.utils';
import type { Order } from '@/types/order';
import { useCashierStore } from '@/store/useCashierStore';

interface ThermalTicketProps {
    order: Order;
}

export const ThermalTicket = ({ order }: ThermalTicketProps) => {
    const { ticketWidth } = useCashierStore();
    
    const date = new Date(order.orderDate).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const rawNum = order.orderNumber?.split('-').pop();
    const orderNum = rawNum ? parseInt(rawNum, 10) : order.idOrder;

    const isCompact = ticketWidth === '56MM';
    const containerWidth = isCompact ? '48mm' : '72mm';
    const fontSize = isCompact ? '9px' : '11px';
    const titleSize = isCompact ? '11px' : '14px';
    const numSize = isCompact ? '15px' : '20px';
    const infoFontSize = isCompact ? '8px' : '10px';
    const lineHeight = isCompact ? '1.1' : '1.2';

    return (
        <div style={{
            width: containerWidth,
            padding: '0',
            margin: '0',
            backgroundColor: 'white',
            color: 'black',
            fontFamily: 'monospace',
            fontSize: fontSize,
            lineHeight: lineHeight
        }}>
            {/* Header - Optimized for Space & Thermal Wear */}
            <div style={{ marginBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: titleSize }}>
                        PEDIDO <span style={{ fontSize: numSize }}>{orderNum}</span>
                    </div>
                    <div style={{
                        fontSize: titleSize,
                        fontWeight: 'bold',
                        textAlign: 'right'
                    }}>
                        {order.orderType === 'DINE_IN' ? 'PARA LA MESA' : 'PARA LLEVAR'}
                    </div>
                </div>
                <div style={{ borderTop: '1px dashed black', marginTop: '2px' }}></div>
            </div>

            {/* Info */}
            <div style={{ marginBottom: '5px', fontSize: infoFontSize }}>
                <div>FECHA: {date}</div>
                {order.customer && <div>CLIENTE: {order.customer.toUpperCase()}</div>}
                <div>CAJERO: {order.cashier?.fullName.toUpperCase() || 'SISTEMA'}</div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '5px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fontSize, tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px dashed black', textAlign: 'center', padding: '2px', width: '15%' }}>CANT</th>
                            <th style={{ border: '1px dashed black', textAlign: 'left', padding: '2px', width: '40%' }}>DETALLE</th>
                            <th style={{ border: '1px dashed black', textAlign: 'right', padding: '2px', width: '22%' }}>P.U.</th>
                            <th style={{ border: '1px dashed black', textAlign: 'right', padding: '2px', width: '23%' }}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.details?.map((detail, index) => {
                            const name = detail.product?.name.toUpperCase() || '';
                            const maxLen = isCompact ? 14 : 22;
                            const truncatedName = name.length > maxLen ? name.substring(0, maxLen - 1) + '…' : name;
                            
                            return (
                                <tr key={index}>
                                    <td style={{ border: '1px dashed black', verticalAlign: 'middle', padding: '2px', textAlign: 'center' }}>{detail.quantity}</td>
                                    <td style={{ border: '1px dashed black', verticalAlign: 'middle', padding: '2px', wordWrap: 'break-word' }}>
                                        {truncatedName}
                                    </td>
                                    <td style={{ border: '1px dashed black', verticalAlign: 'middle', padding: '2px', textAlign: 'right' }}>
                                        {parseFloat(detail.unitPrice).toFixed(2)}
                                    </td>
                                    <td style={{ border: '1px dashed black', verticalAlign: 'middle', padding: '2px', textAlign: 'right', fontWeight: 'bold' }}>
                                        {parseFloat(detail.subtotal).toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: isCompact ? '11px' : '14px' }}>
                    <b>TOTAL GENERAL:</b>
                    <b>{formatPrice(order.total)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: infoFontSize, marginTop: '5px' }}>
                    <span>RECIBIDO ({order.paymentMethod === 'CASH' ? 'EFECTIVO' : 'QR'}):</span>
                    <span>{formatPrice(order.amountPaid)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: infoFontSize }}>
                    <span>CAMBIO:</span>
                    <span>{formatPrice(order.changeAmount)}</span>
                </div>
            </div>

            {/* Observations */}
            {order.observations && (
                <div style={{ marginBottom: '5px', fontSize: infoFontSize, fontStyle: 'italic', border: '1px dashed black', padding: '4px' }}>
                    OBS: {order.observations}
                </div>
            )}
        </div>
    );
};
