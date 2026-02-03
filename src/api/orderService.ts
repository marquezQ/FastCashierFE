import { api } from './axiosConfig';
import type { CreateOrderDto, Order } from '../types/order';

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
};
