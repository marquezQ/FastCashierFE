import { api } from './axiosConfig';
import type { CashierSession, CreateSessionDto, CloseSessionDto, SessionStatistics } from '../types/cashierSession';

export const cashierSessionService = {
    openSession: async (data: CreateSessionDto): Promise<CashierSession> => {
        const response = await api.post<CashierSession>('/cashier-sessions', data);
        return response.data;
    },

    closeSession: async (id: number, data: CloseSessionDto): Promise<CashierSession> => {
        const response = await api.post<CashierSession>(`/cashier-sessions/${id}/close`, data);
        return response.data;
    },

    getCurrentSession: async (userId: number): Promise<CashierSession | null> => {
        const response = await api.get<CashierSession | null>(`/cashier-sessions/current/${userId}`);
        return response.data || null;
    },

    getSessionStatistics: async (id: number): Promise<SessionStatistics> => {
        const response = await api.get<SessionStatistics>(`/cashier-sessions/${id}/statistics`);
        return response.data;
    },

    getSessionsHistory: async (params: {
        period?: '7d' | 'this-month';
        startDate?: string;
        endDate?: string;
    }): Promise<CashierSession[]> => {
        const response = await api.get<CashierSession[]>('/cashier-sessions', { params });
        return response.data;
    }
};
