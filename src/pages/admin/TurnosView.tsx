import { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  CalendarRange,
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '@/api/axiosConfig';
import { useCashierSessionsHistory } from '@/hooks/useCashierSessionsHistory';
import { TurnoList } from '@/components/admin/turno-detalle/TurnoList';
import {
  TurnoErrorState,
  TurnoLoadingState,
  TurnoRangePrompt,
  TurnoEmptyState
} from '@/components/admin/turno-detalle/TurnoStatusStates';
import { groupSessionsByDate, formatDateHeader } from '@/utils/session.utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { CashierSession } from '@/types/cashierSession';

type Period = '7d' | 'this-month' | 'range';

export const TurnosView = () => {
  const [period, setPeriod] = useState<Period>('7d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeParams, setActiveParams] = useState<{ period?: '7d' | 'this-month'; startDate?: string; endDate?: string }>({ period: '7d' });

  useEffect(() => {
    if (period !== 'range') setActiveParams({ period: period as '7d' | 'this-month' });
  }, [period]);

  const { data: sessions = [], isLoading, error, refetch } = useCashierSessionsHistory(
    activeParams,
    period !== 'range' || (!!activeParams.startDate && !!activeParams.endDate)
  );

  const groupedSessions = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  const handleApplyRange = () => {
    if (!startDate || !endDate) return toast.error('Selecciona un rango de fechas válido');
    setActiveParams({ startDate, endDate });
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await api.get('/cashier-sessions/report/pdf', {
        params: activeParams,
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Limpiar el objeto URL después de un momento
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Ocurrió un error al generar el reporte PDF');
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Turnos de Caja</h1>
          <p className="text-muted-foreground font-medium mt-1">Historial administrativo y reportes de cierres</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-11 px-6 rounded-xl font-bold gap-2 border-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
            onClick={handleDownloadPdf}
            disabled={isLoading}
          >
            <FileText className="h-4 w-4" /> Generar Reporte PDF
          </Button>
        </div>
      </div>

      {/* Filters & Summary Section */}
      <Card className="p-1 md:p-6 overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm rounded-3xl shadow-xl">
        <div className="flex flex-col gap-8">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 p-1 md:p-0">
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="overflow-x-auto scrollbar-hide py-1">
                <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="w-fit">
                  <TabsList className="h-11 bg-muted/40 p-1 rounded-xl border border-border/40 gap-1">
                    {['7d', 'this-month', 'range'].map((val) => (
                      <TabsTrigger key={val} value={val} className="h-9 px-3 md:px-5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
                        {val === 'range' && <CalendarRange className="h-3.5 w-3.5" />}
                        {val === '7d' ? 'Semanas' : val === 'this-month' ? 'Mes' : 'Rango'}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 shrink-0 bg-background/50 backdrop-blur-sm" onClick={() => refetch()}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>

          {/* Range Inputs */}
          {period === 'range' && (
            <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4 bg-muted/20 p-4 rounded-2xl border border-dashed border-border/60 animate-in fade-in slide-in-from-top-2">
              {[{ l: 'Inicio', v: startDate, s: setStartDate }, { l: 'Fin', v: endDate, s: setEndDate }].map((f, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Fecha {f.l}</label>
                  <Input type="date" value={f.v} onChange={(e) => f.s(e.target.value)} className="h-11 rounded-xl bg-background border-border/50 font-bold" />
                </div>
              ))}
              <Button className="h-11 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 w-full" onClick={handleApplyRange} disabled={isLoading}>
                <Search className="h-4 w-4" /> Buscar Turnos
              </Button>
            </div>
          )}

          {/* Main Content Area */}
          <div className="mt-4">
            {error ? <TurnoErrorState onRetry={refetch} /> :
              isLoading ? <TurnoLoadingState /> :
                period === 'range' && (!activeParams.startDate || !activeParams.endDate) ? <TurnoRangePrompt /> :
                  groupedSessions.length > 0 ? <TurnoList groupedSessions={groupedSessions as [string, CashierSession[]][]} formatDateHeader={formatDateHeader} /> :
                    <TurnoEmptyState />}
          </div>
        </div>
      </Card>
    </div>
  );
};