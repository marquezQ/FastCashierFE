import { useState, useEffect } from 'react';
import { BarChart3, Scissors, CalendarRange, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsTab } from '@/components/admin/ordenes/StatsTab';
import { CancellationsTab } from '@/components/admin/ordenes/CancellationsTab';
import type { Period, MetricsParams } from '@/types/adminMetrics';
import { toast } from 'sonner';

export const OrdenesView = () => {
  const [period, setPeriod] = useState<Period>('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeParams, setActiveParams] = useState<MetricsParams>({ period: 'today' });

  // Automatically apply period changes when not using custom range
  useEffect(() => {
    if (period !== 'range') {
      setActiveParams({ period });
    }
  }, [period]);

  const handleApplyRange = () => {
    if (!startDate || !endDate) {
      return toast.error('Selecciona un rango de fechas válido');
    }
    setActiveParams({ startDate, endDate });
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="admin-h1">Monitor de Órdenes</h1>
          <p className="admin-subtitle">Análisis de rendimiento, estadísticas de ventas y control de calidad</p>
        </div>

        {/* Integrated Period Filter */}
        <div className="flex items-center gap-2 self-start lg:self-center overflow-x-auto scrollbar-hide py-1">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="w-fit">
            <TabsList className="h-11 bg-muted/40 p-1 rounded-xl border border-border/40 gap-1">
              {[
                { id: 'today', label: 'Hoy' },
                { id: '7d', label: '7 Días' },
                { id: 'this-month', label: 'Mes' },
                { id: 'range', label: 'Rango', icon: CalendarRange }
              ].map((val) => (
                <TabsTrigger
                  key={val.id}
                  value={val.id}
                  className="h-9 px-3 md:px-5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-black text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 transition-all"
                >
                  {val.icon && <val.icon className="h-3.5 w-3.5" />}
                  {val.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Subtle Date Range Inputs (Only visible when Range is selected) */}
      {period === 'range' && (
        <div className="mx-4 md:mx-0 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col md:flex-row items-end gap-4 bg-card/30 backdrop-blur-sm p-4 rounded-2xl border border-dashed border-border/60">
            <div className="flex-1 w-full space-y-1.5">
              <label className="admin-label-sm ml-1">Fecha Inicio</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-xl bg-background/50 border-border/50 font-bold" />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <label className="admin-label-sm ml-1">Fecha Fin</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 rounded-xl bg-background/50 border-border/50 font-bold" />
            </div>
            <Button
              onClick={handleApplyRange}
              className="h-11 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 shrink-0 w-full md:w-auto px-8"
            >
              <Search className="h-4 w-4" /> Aplicar Filtro
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="stats" className="space-y-8">
        <div className="px-4 md:px-0">
          <div className="overflow-x-auto scrollbar-hide py-1">
            <TabsList className="h-14 bg-muted/40 p-1.5 rounded-4xl border border-border/40 w-fit gap-2">
              <TabsTrigger
                value="stats"
                className="h-11 px-4 lg:px-8 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 whitespace-nowrap"
              >
                <BarChart3 className="h-4 w-4" />
                Analítica
              </TabsTrigger>
              <TabsTrigger
                value="cancellations"
                className="h-11 px-4 lg:px-8 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-red-600 font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 whitespace-nowrap"
              >
                <Scissors className="h-4 w-4" />
                Cancelaciones
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="stats" className="border-none p-0 outline-none">
          <StatsTab params={activeParams} />
        </TabsContent>
        <TabsContent value="cancellations" className="border-none p-0 outline-none">
          <CancellationsTab params={activeParams} />
        </TabsContent>
      </Tabs>
    </div>
  );
};