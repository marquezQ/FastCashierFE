import type { UserWithRole } from './auth';

export type SessionStatus = 'OPEN' | 'CLOSED';

export interface CashierSession {
    idSession: number;
    userId: number;
    openingDate: string; // ISO String
    closingDate: string | null; // ISO String
    initialAmount: number;
    totalCash: string;
    totalQr: string;
    closingCashAmount: number | null;
    closingQrAmount: number | null;
    totalSales: string;
    orderCount: number;
    difference: string | null;
    observations: string | null;
    status: SessionStatus;
    user?: UserWithRole;
}

export interface CreateSessionDto {
    userId: number;
    initialAmount: number;
    observations?: string;
}

export interface CloseSessionDto {
    closingCashAmount: number;
    closingQrAmount: number;
    observations?: string;
}

export interface CloseSessionResponse {
    message: string;
    summary: {
        sessionId: number;
        startTime: string;
        endTime: string;
        initialCash: number;
        cashSales: number;
        totalExpectedCash: number;
        declaredCash: number;
        totalExpectedQr: number;
        declaredQr: number;
        difference: number;
        totalOrders: number;
    };
}

export interface SessionStatistics {
    sessionId: number;
    expectedCash: number;
    expectedQr: number;
    totalOrders: number;
    cashOrderCount: number;
    qrOrderCount: number;
    initialAmount: number;
    openingDate: string;
    responsiblePerson: {
        userId: number;
        name: string;
        email: string;
        role: string;
    };
    averageOrderValue: number;
    totalSales: number;
    status: SessionStatus;
}
