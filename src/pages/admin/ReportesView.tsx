import { SalesLineChart } from "@/components/admin/Reports/SalesLineChart";
import { ComparativeCharts } from "@/components/admin/Reports/ComparativeCharts";

export const ReportesView = () => {
  return (
    <div className="space-y-8 p-1 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="admin-h1">Panel de Análisis</h1>
        <p className="admin-subtitle">
          Control detallado de ingresos y tendencias de venta
        </p>
      </div>

      {/* Main Analysis Chart */}
      <SalesLineChart />

      {/* Comparative Analysis */}
      <ComparativeCharts />
    </div>
  );
};