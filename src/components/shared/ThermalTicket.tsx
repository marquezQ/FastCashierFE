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
            <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fontSize }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid black' }}>
                            <th style={{ textAlign: 'left', paddingBottom: '3px' }}>CANT</th>
                            <th style={{ textAlign: 'left', paddingBottom: '3px' }}>DETALLE</th>
                            <th style={{ textAlign: 'right', paddingBottom: '3px' }}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.details?.map((detail, index) => (
                            <tr key={index}>
                                <td style={{ verticalAlign: 'top', paddingTop: '3px' }}>{detail.quantity}</td>
                                <td style={{ verticalAlign: 'top', paddingTop: '3px', paddingLeft: '5px' }}>
                                    {detail.product?.name.toUpperCase()}
                                </td>
                                <td style={{ verticalAlign: 'top', textAlign: 'right', paddingTop: '3px', fontWeight: 'bold' }}>
                                    {formatPrice(detail.subtotal)}
                                </td>
                            </tr>
                        ))}
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
                <div style={{ marginBottom: '5px', fontSize: infoFontSize, fontStyle: 'italic', border: '1px solid #ccc', padding: '5px' }}>
                    OBS: {order.observations}
                </div>
            )}
        </div>
    );
};
