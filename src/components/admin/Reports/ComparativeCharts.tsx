import * as React from "react"
import { Info } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ReportPeriod } from "@/types/reports"
import { PaymentMethodsChart } from "./PaymentMethodsChart"
import { OrderTypesChart } from "./OrderTypesChart"
import { cn } from "@/lib/utils"

const PERIODS: { label: string; value: ReportPeriod }[] = [
  { label: "Día", value: "DAY" },
  { label: "Semana", value: "WEEK" },
  { label: "Mes", value: "MONTH" },
  { label: "Año", value: "YEAR" },
]

export function ComparativeCharts() {
  // Inicializamos por defecto en 'WEEK' para alinear con SalesLineChart
  const [period, setPeriod] = React.useState<ReportPeriod>("WEEK")

  return (
    <Card className="col-span-full border-none shadow-xl bg-card/60 backdrop-blur-md ring-1 ring-border/50">
      <CardHeader className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-8 border-b border-border/50">
        <div className="grid gap-1.5">
          <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="h-8 w-1.5 bg-primary rounded-full shrink-0" />
            Métricas Comparativas
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Info className="h-3 w-3" />
            Análisis de Comportamiento del Cliente
          </CardDescription>
        </div>

        {/* Selector Global de Fecha */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-muted p-1 rounded-xl border border-border/50 justify-center">
            {PERIODS.map((p) => (
              <Button
                key={p.value}
                variant={period === p.value ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "capitalize h-8 px-5 text-[10px] font-black tracking-widest transition-all",
                  period === p.value 
                    ? "bg-white shadow-sm text-primary hover:text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid lg:grid-cols-2 gap-8 pt-8 px-4 sm:px-8 pb-10">
        <PaymentMethodsChart period={period} />
        <OrderTypesChart period={period} />
      </CardContent>
    </Card>
  )
}
