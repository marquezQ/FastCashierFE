import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SalesLineChart } from "@/components/admin/Reports/SalesLineChart";

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

      {/* Quick Insights & Export Area */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Insights Info Card */}
        <Card className="border-none shadow-md bg-primary/5 border-l-4 border-l-primary flex items-center">
          <CardHeader className="pb-0 md:pb-6">
            <TrendingUp className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent className="pt-6">
            <h4 className="font-black text-sm uppercase tracking-widest mb-1">Tendencia Positiva</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Las ventas muestran un crecimiento del **12%** esta semana. El pico de hoy fue de **$1,100**.
            </p>
          </CardContent>
        </Card>

        {/* Call to action for more detailed reports */}
        <Card className="shadow-md bg-muted/30 border-dashed border-2 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="font-bold text-sm mb-1 uppercase tracking-wider">Centro de Reportes</h3>
          <p className="text-xs text-muted-foreground mb-4">Exporta el historial completo para auditoría externa.</p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border font-black text-[10px] uppercase hover:bg-muted transition-smooth shadow-sm">
              <span className="text-red-500">PDF</span> Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border font-black text-[10px] uppercase hover:bg-muted transition-smooth shadow-sm">
              <span className="text-emerald-500">XLS</span> Excel
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};