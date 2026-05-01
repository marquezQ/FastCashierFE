import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts"
import { Utensils, AlertCircle, BarChart3 } from "lucide-react"
import { type ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { useOrderTypesReport } from "@/hooks/useOrderTypesReport"
import type { ReportPeriod } from "@/types/reports"

const orderConfig = {
  mesa: { label: "Para Servir", color: "#2563eb" },
  llevar: { label: "Para Llevar", color: "#0ea5e9" },
} satisfies ChartConfig

export function OrderTypesChart({ period }: { period: ReportPeriod }) {
  const { data, isLoading, isError, refetch } = useOrderTypesReport(period)

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="hidden lg:block absolute -left-4 top-0 bottom-0 w-px bg-border/50" />
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Tipos de Pedido</h3>
          <p className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Para Servir vs Llevar</p>
        </div>
      </div>

      <div className="w-full h-75 relative overflow-hidden min-h-75 min-w-0">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
            <div className="h-10 w-10 border-[3px] border-primary/10 border-t-primary animate-spin rounded-full shadow-inner" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 animate-pulse">
              Cargando pedidos...
            </p>
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs font-bold text-foreground">Error al cargar datos</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="h-7 text-[10px]">Reintentar</Button>
            </div>
          </div>
        ) : data && data.length > 0 ? (
          <ChartContainer config={orderConfig} className="h-full w-full">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" strokeOpacity={0.1} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} className="text-[10px] font-black uppercase text-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-[10px] font-black text-muted-foreground" width={40} />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              <Bar dataKey="mesa" name="Para Servir (Mesa)" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="llevar" name="Para Llevar" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 opacity-30">
            <BarChart3 className="h-16 w-16 text-muted-foreground" />
            <p className="text-[10px] font-black uppercase tracking-widest">
              Sin registros en este periodo
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
