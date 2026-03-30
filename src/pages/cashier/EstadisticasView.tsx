import { useCashierStore } from '@/store/useCashierStore';
import { useSessionStatistics } from '@/hooks/useSessionStatistics';

// Refactored Components
import { StatsHeader } from '@/components/cashier/stats/StatsHeader';
import { StatsGrid } from '@/components/cashier/stats/StatsGrid';
import { SalesDistributionCard } from '@/components/cashier/stats/SalesDistributionCard';
import { CashClosingCard } from '@/components/cashier/stats/CashClosingCard';
import { StatsSkeleton } from '@/components/cashier/stats/StatsSkeleton';
import { StatsError } from '@/components/cashier/stats/StatsError';

export const EstadisticasView = () => {
    const { currentSession } = useCashierStore();
    const { data: stats, isLoading, isError, refetch, isFetching } = useSessionStatistics(currentSession?.idSession);

    if (isLoading) {
        return <StatsSkeleton />;
    }

    if (isError || !stats) {
        return <StatsError onRetry={() => refetch()} />;
    }

    // Date calculations
    const openingDate = new Date(stats.openingDate);
    const formattedDate = openingDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    const formattedTime = openingDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <StatsHeader
                formattedDate={formattedDate}
                formattedTime={formattedTime}
                responsibleName={stats.responsiblePerson.name}
                isFetching={isFetching}
                refetch={refetch}
            />

            <StatsGrid stats={stats} />

            <div className="grid gap-6 lg:grid-cols-2 px-1">
                <SalesDistributionCard stats={stats} />
                <CashClosingCard stats={stats} />
            </div>
        </div>
    );
};
