import { api } from './axiosConfig';
import type { CreateOrderDto, Order, OrderStatus } from '../types/order';

export const orderService = {
    createOrder: async (data: CreateOrderDto): Promise<Order> => {
        const response = await api.post<Order>('/orders', data);
        return response.data;
    },

    getOrdersBySession: async (sessionId: number): Promise<Order[]> => {
        const response = await api.get<Order[]>(`/orders/session/${sessionId}`);
        return response.data;
    },

    cancelOrder: async (orderId: number, reason?: string): Promise<Order> => {
        const response = await api.post<Order>(`/orders/${orderId}/cancel`, { reason });
        return response.data;
    },

    getKitchenOrders: async (): Promise<Order[]> => {
        const response = await api.get<Order[]>('/orders/kitchen-display');
        return response.data;
    },

    updateOrderStatus: async (orderId: number, status: OrderStatus, cookId: number): Promise<Order> => {
        const response = await api.patch<Order>(`/orders/${orderId}/status`, {
            orderStatus: status,
            cookId
        });
        return response.data;
    },

    getKitchenHistory: async (): Promise<Order[]> => {
        const response = await api.get<Order[]>('/orders/history');
        return response.data;
    },
};
