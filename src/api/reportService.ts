import { api } from './axiosConfig';
import type { 
  ReportPeriod, 
  SalesReportResponse,
  PaymentMethodsReportResponse,
  OrderTypesReportResponse
} from '../types/reports';

export const reportService = {
  getSalesReport: async (period: ReportPeriod): Promise<SalesReportResponse> => {
    const { data } = await api.get<SalesReportResponse>('/reports/sales', {
      params: { period },
    });
    return data;
  },
  getPaymentMethodsReport: async (period: ReportPeriod): Promise<PaymentMethodsReportResponse> => {
    const { data } = await api.get<PaymentMethodsReportResponse>('/reports/payment-methods', {
      params: { period },
    });
    return data;
  },
  getOrderTypesReport: async (period: ReportPeriod): Promise<OrderTypesReportResponse> => {
    const { data } = await api.get<OrderTypesReportResponse>('/reports/order-types', {
      params: { period },
    });
    return data;
  },
};
