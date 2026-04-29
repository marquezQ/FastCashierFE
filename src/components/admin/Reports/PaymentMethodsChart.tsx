import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, Legend } from "recharts"
import { Wallet, AlertCircle, BarChart3 } from "lucide-react"
import { type ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { usePaymentMethodsReport } from "@/hooks/usePaymentMethodsReport"
import type { ReportPeriod } from "@/types/reports"

const paymentConfig = {
  efectivo: { label: "Efectivo", color: "#0ea5e9" },
  qr: { label: "QR Dinámico", color: "#2563eb" },
} satisfies ChartConfig

export function PaymentMethodsChart({ period }: { period: ReportPeriod }) {
  const { data, isLoading, isError, refetch } = usePaymentMethodsReport(period)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Métodos de Pago</h3>
          <p className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Efectivo vs QR</p>
        </div>
      </div>

      <div className="w-full h-[300px] relative overflow-hidden min-h-[300px] min-w-0">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
            <div className="h-10 w-10 border-[3px] border-primary/10 border-t-primary animate-spin rounded-full shadow-inner" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 animate-pulse">
              Cargando pagos...
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
          <ChartContainer config={paymentConfig} className="h-full w-full">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEfectivo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorQr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" strokeOpacity={0.1} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} className="text-[10px] font-black uppercase text-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-[10px] font-black text-muted-foreground" tickFormatter={(val) => `Bs. ${val}`} width={65} />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="efectivo" name="Efectivo" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorEfectivo)" />
              <Area type="monotone" dataKey="qr" name="QR Dinámico" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorQr)" />
            </AreaChart>
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
