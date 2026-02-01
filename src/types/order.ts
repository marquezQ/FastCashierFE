import type { CashierSession } from './cashierSession';
import type { User } from './auth';
import type { Product } from './products';

export type PaymentMethod = 'CASH' | 'QR';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItemDto {
    productId: number;
    quantity: number;
}

export interface CreateOrderDto {
    sessionId: number;
    cashierId: number;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    items: OrderItemDto[];
    customer?: string;
    observations?: string;
}

export interface OrderDetail {
    idDetail: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: string;
    subtotal: string;
    product: Product;
}

export interface Order {
    idOrder: number;
    orderNumber: string;
    sessionId: number;
    cashierId: number;
    cookId: number | null;
    orderDate: string;
    subtotal: string;
    total: string;
    paymentMethod: PaymentMethod;
    amountPaid: string;
    changeAmount: string;
    orderStatus: OrderStatus;
    preparationStartDate: string | null;
    completedDate: string | null;
    customer: string | null;
    observations: string | null;
    updatedAt: string;
    session?: CashierSession;
    cashier?: User;
    cook?: User | null;
    details: OrderDetail[];
}
