import { api } from './axiosConfig';
import type { CreateOrderDto, Order } from '../types/order';

export const orderService = {
    createOrder: async (data: CreateOrderDto): Promise<Order> => {
        const response = await api.post<Order>('/orders', data);
        return response.data;
    },

    // Additional methods (get by session, find by id, etc.) can be added here
};
