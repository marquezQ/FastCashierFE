"use client"

import * as React from "react"
import {
  CartesianGrid,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Info, BarChart3, AlertCircle } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { useSalesReport } from "@/hooks/useSalesReport"
import type { ReportPeriod } from "@/types/reports"
import { cn } from "@/lib/utils"

const chartConfig = {
  sales: {
    label: "Ingresos",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

const PERIODS: { label: string; value: ReportPeriod; subtitle: string }[] = [
  { label: "Día", value: "DAY", subtitle: "Reporte de hoy" },
  { label: "Semana", value: "WEEK", subtitle: "Semana en curso" },
  { label: "Mes", value: "MONTH", subtitle: "Mes en curso" },
  { label: "Año", value: "YEAR", subtitle: "Anual acumulado" },
]

export function SalesLineChart() {
  const [period, setPeriod] = React.useState<ReportPeriod>("DAY")
  const { data, isLoading, isError, refetch } = useSalesReport(period)

  const activePeriod = PERIODS.find((p) => p.value === period)

  return (
    <Card className="col-span-full border-none shadow-2xl bg-card/40 backdrop-blur-xl ring-1 ring-border/40 overflow-hidden">
      <CardHeader className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-4 pt-8 px-8">
        <div className="grid gap-1">
          <CardTitle className="text-3xl font-black tracking-tight flex items-center gap-2.5">
            <div className="h-10 w-2.5 bg-primary rounded-full shadow-lg shadow-primary/20" />
            Ventas Totales
          </CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <Info className="h-3 w-3" />
            {activePeriod?.subtitle} • Moneda: BS.
          </CardDescription>
        </div>

        <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/20 backdrop-blur-sm self-end lg:self-center overflow-x-auto no-scrollbar">
          {PERIODS.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setPeriod(p.value)}
              className={cn(
                "capitalize h-9 px-6 text-[10px] font-black tracking-widest transition-all duration-300 rounded-xl",
                period === p.value 
                  ? "bg-background shadow-lg text-primary ring-1 ring-border/50 scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-1 sm:px-4 pb-4">
        <div className="relative h-105 w-full min-h-105">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
              <div className="h-12 w-12 border-[3px] border-primary/10 border-t-primary animate-spin rounded-full shadow-inner" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 animate-pulse">
                Procesando datos...
              </p>
            </div>
          ) : isError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-foreground">No se pudieron cargar los datos</p>
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-destructive hover:text-white transition-colors"
                >
                  Reintentar análisis
                </Button>
              </div>
            </div>
          ) : data && data.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                data={data}
                margin={{
                  left: 30,
                  right: 30,
                  top: 30,
                  bottom: 10,
                }}
              >
                <defs>
                  <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="50%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="0"
                  stroke="currentColor"
                  strokeOpacity={0.06}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={25}
                  className="text-muted-foreground/60 font-black text-[9px] uppercase tracking-tighter"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={20}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                  className="text-muted-foreground/60 font-black text-[9px]"
                  width={60}
                />
                <Tooltip
                  cursor={{
                    stroke: "var(--color-primary)",
                    strokeWidth: 1.5,
                    strokeDasharray: "4 4",
                  }}
                  content={<ChartTooltipContent indicator="dashed" className="rounded-2xl border-border/40 shadow-2xl" />}
                />
                <Area
                  dataKey="sales"
                  type="linear"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#premiumGradient)"
                  isAnimationActive={true}
                  animationDuration={1500}
                  connectNulls={true}
                  activeDot={{
                    r: 6,
                    strokeWidth: 4,
                    stroke: "var(--color-background)",
                    fill: "var(--color-primary)",
                  }}
                  dot={{
                    r: 3,
                    fill: "var(--color-primary)",
                    strokeWidth: 1,
                    stroke: "var(--color-background)",
                    fillOpacity: 1
                  }}
                />
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
      </CardContent>
    </Card>
  )
}
