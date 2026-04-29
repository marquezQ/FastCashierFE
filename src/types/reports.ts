export type ReportPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface SalesReportPoint {
  label: string;
  sales: number;
}

export type SalesReportResponse = SalesReportPoint[];

export interface PaymentMethodPoint {
  label: string;
  efectivo: number;
  qr: number;
}

export type PaymentMethodsReportResponse = PaymentMethodPoint[];

export interface OrderTypePoint {
  label: string;
  mesa: number;
  llevar: number;
}

export type OrderTypesReportResponse = OrderTypePoint[];
