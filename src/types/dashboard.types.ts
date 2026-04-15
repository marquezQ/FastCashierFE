export interface DashboardStat {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBgColor: string;
}

export interface DashboardSummaryResponse {
  general: {
    todayOrders: number;
    todaySales: number;
    monthlySales: number;
    totalSessions: number;
  };
  entities: {
    totalUsers: number;
    totalProducts: number;
    activeProducts: number;
  };
  financial7d: {
    totalCash: number;
    totalQr: number;
  };
  performance7d: {
    avgKitchenTimeMinutes: number;
    kitchenTimeTrendPercentage: number;
    channels: {
      dineInPercentage: number;
      takeoutPercentage: number;
    };
  };
  recentDiscrepancies: {
    idSession: number;
    cashierName: string;
    date: string;
    difference: number;
    status: 'faltante' | 'sobrante';
  }[];
}