import type { OrderStatus } from '@/types/order';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: 'Pendiente',
    IN_PREPARATION: 'En preparación',
    READY: 'Listo',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
};

export const REVERT_TARGET_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    IN_PREPARATION: 'PENDING',
    READY: 'IN_PREPARATION',
    DELIVERED: 'READY',
};

export const getRevertTargetStatus = (status: OrderStatus): OrderStatus | null =>
    REVERT_TARGET_STATUS[status] ?? null;
