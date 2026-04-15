import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatPrice } from '@/utils/product.utils';
import type { DashboardSummaryResponse } from '@/types/dashboard.types';

const chartConfig = {
  cash: {
    label: 'Efectivo',
    color: 'oklch(0.65 0.18 160)', // emerald-500 ish
  },
  qr: {
    label: 'QR / Transf',
    color: 'oklch(0.55 0.18 255)', // primary blue
  },
};

export const FinancialDistribution = ({ data }: { data: DashboardSummaryResponse['financial7d'] }) => {
  const CHART_DATA = [
    { name: 'Efectivo', value: Number(data.totalCash), fill: 'var(--color-cash)' },
    { name: 'QR / Transf', value: Number(data.totalQr), fill: 'var(--color-qr)' },
  ].filter(item => item.value > 0);

  const total = CHART_DATA.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="@container/financial rounded-3xl border-border/40 p-6 shadow-sm dark:border-border/60 bg-card/60 dark:bg-card backdrop-blur-md flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h2 className="admin-h2 text-foreground">Distribución Financiera</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2 shrink-0">Últimos 7d</span>
      </div>

      <div className="flex-1 flex flex-col @[350px]/financial:flex-row items-center justify-center gap-6 @[350px]/financial:gap-8 min-h-0">
        <div className="h-[130px] w-[130px] @[280px]/financial:h-[150px] @[280px]/financial:w-[150px] @[400px]/financial:h-[170px] @[400px]/financial:w-[170px] relative shrink-0 transition-all duration-300">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={CHART_DATA}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="65%"
                  outerRadius="100%"
                  strokeWidth={3}
                  stroke="hsl(var(--background))"
                >
                  {CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          {/* Valor Central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Total</span>
            <span className="font-black tabular-nums text-foreground tracking-tight text-xs @[280px]/financial:text-sm mt-0.5">
              {formatPrice(total.toString())}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full @[350px]/financial:w-auto shrink-0 flex-1 max-w-[240px]">
          {CHART_DATA.map((item) => (
            <div key={item.name} className="flex flex-col">
              <div className="flex justify-between items-center mb-1 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.name === 'Efectivo' ? chartConfig.cash.color : chartConfig.qr.color }} />
                  <span className="text-sm font-bold truncate">{item.name}</span>
                </div>
                <span className="font-black tabular-nums text-sm shrink-0">
                  {formatPrice(item.value.toString())}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-right font-medium">
                {((item.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
