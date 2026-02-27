import { formatPrice } from '@/utils/product.utils';
import type { Order } from '@/types/order';

interface ThermalTicketProps {
    order: Order;
}

export const ThermalTicket = ({ order }: ThermalTicketProps) => {
    const date = new Date(order.orderDate).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const orderNum = order.orderNumber?.split('-').pop() || order.idOrder;

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
            {/* Header - Optimized for Space & Thermal Wear */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
                    PEDIDO {orderNum}
                </div>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    margin: '2px 0'
                }}>
                    {order.orderType === 'DINE_IN' ? 'PARA LA MESA' : 'PARA LLEVAR'}
                </div>
                <div style={{ borderTop: '1px dashed black', marginTop: '2px' }}></div>
            </div>

            {/* Info */}
            <div style={{ marginBottom: '5px', fontSize: '11px' }}>
                <div>FECHA: {date}</div>
                {order.customer && <div>CLIENTE: {order.customer.toUpperCase()}</div>}
                <div>CAJERO: {order.cashier?.fullName.toUpperCase() || 'SISTEMA'}</div>
            </div>

            {/* Items */}
            <div style={{ borderBottom: '1px solid black', marginBottom: '5px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
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
                                <td style={{ verticalAlign: 'top', textAlign: 'right', paddingTop: '3px' }}>
                                    {formatPrice(detail.subtotal)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                    <b>TOTAL:</b>
                    <b>{formatPrice(order.total)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '5px' }}>
                    <span>RECIBIDO ({order.paymentMethod === 'CASH' ? 'EFECTIVO' : 'QR'}):</span>
                    <span>{formatPrice(order.amountPaid)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>CAMBIO:</span>
                    <span>{formatPrice(order.changeAmount)}</span>
                </div>
            </div>

            {/* Observations */}
            {order.observations && (
                <div style={{ marginBottom: '15px', fontSize: '10px', fontStyle: 'italic', border: '1px solid #ccc', padding: '5px' }}>
                    OBS: {order.observations}
                </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '10px' }}>
                <div>¡GRACIAS POR SU COMPRA!</div>
                <div style={{ marginTop: '5px' }}>www.fastcashier.com</div>
            </div>
        </div>
    );
};
