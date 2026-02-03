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

    getCurrentSession: async (): Promise<CashierSession | null> => {
        // Assuming there might be an endpoint to get the active session for the user
        // If not, this can be handled by just checking the store or a general fetch
        const response = await api.get<CashierSession[]>('/cashier-sessions', {
            params: { status: 'OPEN' }
        });
        return response.data.length > 0 ? response.data[0] : null;
    },

    getSessionStatistics: async (id: number): Promise<SessionStatistics> => {
        const response = await api.get<SessionStatistics>(`/cashier-sessions/${id}/statistics`);
        return response.data;
    }
};
