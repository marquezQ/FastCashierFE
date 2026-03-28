"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Calendar as CalendarIcon, Info, Filter } from "lucide-react"

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
import { formatDate } from "@/utils/date.utils"


type Granularity = "hours" | "days" | "weeks" | "months"

interface ChartData {
  label: string
  sales: number
}

const chartConfig = {
  sales: {
    label: "Ingresos",
    color: "#2563eb",
  },
} satisfies ChartConfig

const DateDisplay = ({ value, onChange, isIcon = false }: { value: string; onChange: (v: string) => void, isIcon?: boolean }) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleTrigger = () => {
    try {
      if (inputRef.current && (inputRef.current as any).showPicker) {
        ;(inputRef.current as any).showPicker()
      } else {
        inputRef.current?.focus()
        inputRef.current?.click()
      }
    } catch (e) {
      inputRef.current?.click()
    }
  }

  if (!isIcon) {
    return (
      <span className="text-[10px] font-black uppercase text-foreground min-w-21.25 select-none">
        {value ? formatDate(value) : "DD/MM/AAAA"}
      </span>
    )
  }

  return (
    <div className="relative flex items-center group cursor-pointer" onClick={handleTrigger}>
      <CalendarIcon className="h-4 w-4 text-primary shrink-0 hover:scale-110 transition-transform" />
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
      />
    </div>
  )
}

export function SalesLineChart() {
  const [data, setData] = React.useState<ChartData[]>([])
  const [granularity, setGranularity] = React.useState<Granularity>("days")
  const [startDate, setStartDate] = React.useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().split("T")[0]
  })
  const [endDate, setEndDate] = React.useState(() => new Date().toISOString().split("T")[0])
  const [isApplying, setIsApplying] = React.useState(false)

  const generateData = React.useCallback((start: string, end: string) => {
    const dStart = new Date(start)
    const dEnd = new Date(end)
    const diffTime = Math.abs(dEnd.getTime() - dStart.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let newGranularity: Granularity = "days"
    let points: ChartData[] = []

    if (diffDays <= 1) {
      newGranularity = "hours"
      for (let i = 8; i <= 22; i += 2) {
        points.push({
          label: `${i.toString().padStart(2, "0")}:00`,
          sales: Math.floor(Math.random() * 1000) + 200,
        })
      }
    } else if (diffDays <= 14) {
      newGranularity = "days"
      const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
      for (let i = 0; i <= diffDays; i++) {
        const d = new Date(dStart)
        d.setDate(d.getDate() + i)
        points.push({
          label: `${days[d.getDay()]} ${d.getDate()}`,
          sales: Math.floor(Math.random() * 5000) + 1500,
        })
      }
    } else if (diffDays <= 60) {
      newGranularity = "weeks"
      const weeks = Math.ceil(diffDays / 7)
      for (let i = 1; i <= weeks; i++) {
        points.push({
          label: `Sem ${i}`,
          sales: Math.floor(Math.random() * 20000) + 10000,
        })
      }
    } else {
      newGranularity = "months"
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      let current = new Date(dStart)
      while (current <= dEnd) {
        points.push({
          label: months[current.getMonth()],
          sales: Math.floor(Math.random() * 80000) + 40000,
        })
        current.setMonth(current.getMonth() + 1)
      }
    }

    setGranularity(newGranularity)
    setData(points)
  }, [])

  // Initial load
  React.useEffect(() => {
    generateData(startDate, endDate)
  }, [generateData])

  const handleApply = () => {
    setIsApplying(true)
    setTimeout(() => {
      generateData(startDate, endDate)
      setIsApplying(false)
    }, 800)
  }

  const getSubTitle = () => {
    switch (granularity) {
      case "hours": return "Tendencia por Horas"
      case "days": return "Tendencia Diaria"
      case "weeks": return "Tendencia Semanal"
      case "months": return "Tendencia Mensual"
      default: return "Análisis de Ventas"
    }
  }

  return (
    <Card className="col-span-full border-none shadow-xl bg-card/60 backdrop-blur-md ring-1 ring-border/50">
      <CardHeader className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-8">
        <div className="grid gap-1.5">
          <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="h-8 w-1.5 bg-primary rounded-full shrink-0" />
            Análisis de Ingresos
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Info className="h-3 w-3" />
            {getSubTitle()} • Moneda: Bs.-
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-4 bg-muted/40 p-2 px-4 rounded-xl border border-border/50 shadow-inner w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <DateDisplay value={startDate} onChange={setStartDate} isIcon />
                <DateDisplay value={startDate} onChange={setStartDate} />
              </div>
              
              <span className="text-muted-foreground/30 font-black">—</span>
              
              <div className="flex items-center gap-2">
                <DateDisplay value={endDate} onChange={setEndDate} isIcon />
                <DateDisplay value={endDate} onChange={setEndDate} />
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isApplying}
              className="w-full sm:w-auto px-6 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              {isApplying ? (
                <div className="h-3 w-3 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <Filter className="h-3.5 w-3.5" />
              )}
              {isApplying ? "..." : "Aplicar"}
            </Button>
          </div>

          <div className="flex bg-muted p-1 rounded-xl border border-border/50 justify-center">
            {[
              { label: "Día", start: 0 },
              { label: "Semana", start: 7 },
              { label: "Mes", start: 30 },
              { label: "Año", start: 365 },
            ].map((p) => (
              <Button
                key={p.label}
                variant="ghost"
                size="sm"
                onClick={() => {
                  const end = new Date()
                  const start = new Date()
                  start.setDate(end.getDate() - p.start)
                  setStartDate(start.toISOString().split("T")[0])
                  setEndDate(end.toISOString().split("T")[0])
                  generateData(start.toISOString().split("T")[0], end.toISOString().split("T")[0])
                }}
                className="capitalize h-8 px-5 text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground transition-all"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-8 pb-10">
        <div style={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden', minHeight: '400px', minWidth: '0' }}>
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              data={data}
              margin={{
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="currentColor"
                strokeOpacity={0.1}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={20}
                className="text-muted-foreground font-black text-[10px] uppercase"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={20}
                tickFormatter={(value) => `Bs. ${value.toLocaleString()}`}
                className="text-muted-foreground font-black text-[10px]"
                width={100}
              />
              <Tooltip
                cursor={{
                  stroke: "#2563eb",
                  strokeWidth: 2,
                  strokeDasharray: "5 5",
                  opacity: 0.5
                }}
                content={<ChartTooltipContent indicator="line" /> as any}
              />
              <Line
                dataKey="sales"
                type="linear"
                stroke="#2563eb"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                isAnimationActive={true}
                dot={{
                  r: 6,
                  fill: "#2563eb",
                  strokeWidth: 3,
                  stroke: "white",
                  fillOpacity: 1
                }}
                activeDot={{
                  r: 10,
                  strokeWidth: 0,
                  fill: "#2563eb",
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
