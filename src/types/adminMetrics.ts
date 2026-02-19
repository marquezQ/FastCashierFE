import type { Order } from './order';

export interface DashboardSummary {
    totalSales: number;
    orderCount: number;
    averageTicket: number;
}

export interface DashboardKitchen {
    averageKitchenTime: number;
}

export interface DashboardChannels {
    dineIn: number;
    takeout: number;
}

export interface TopProduct {
    name: string;
    totalQuantity: number;
}

export interface DashboardMetricsResponse {
    summary: DashboardSummary;
    kitchen: DashboardKitchen;
    channels: DashboardChannels;
    topProducts: TopProduct[];
}

export type Period = 'today' | '7d' | 'this-month' | 'range';

export interface MetricsParams {
    period?: Period;
    startDate?: string;
    endDate?: string;
}

export type CancellationAuditResponse = Order[];
