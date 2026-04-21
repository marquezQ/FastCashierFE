export type ReportPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface SalesReportPoint {
  label: string;
  sales: number;
}

export type SalesReportResponse = SalesReportPoint[];
