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
}

export interface CreateSessionDto {
    userId: number;
    openingDate: string; // ISO String
    initialAmount: number;
    observations?: string;
}

export interface CloseSessionDto {
    closingCashAmount: number;
    closingDate: string; // ISO String
    closingQrAmount: number;
    observations?: string;
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
