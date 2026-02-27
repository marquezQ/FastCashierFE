import type { CashierSession } from './cashierSession';
import type { User } from './auth';
import type { Product } from './products';

export interface OrderItem extends Product {
    quantity: number;
}

export type PaymentMethod = 'CASH' | 'QR';
export type OrderStatus = 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type OrderType = 'DINE_IN' | 'TAKEOUT';

export interface OrderItemDto {
    productId: number;
    quantity: number;
}

export interface CreateOrderDto {
    sessionId: number;
    cashierId: number;
    orderType: OrderType;
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
    orderType: OrderType;
    preparationStartDate: string | null;
    completedDate: string | null;
    customer: string | null;
    tableNumber?: string | null;
    observations: string | null;
    updatedAt: string;
    session?: CashierSession;
    cashier?: User;
    cook?: User | null;
    details: OrderDetail[];
}
