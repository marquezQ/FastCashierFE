import { useState } from 'react';
import { Search, Loader2, Package, History, SlidersHorizontal } from 'lucide-react';
import { useKitchenHistory } from '@/hooks/useKitchenHistory';
import { KitchenHistoryCard } from '@/components/kitchen/KitchenHistoryCard';
import { Input } from '@/components/ui/input';

export const HistorialView = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: orders = [], isLoading, error } = useKitchenHistory();

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
            (order.orderNumber?.toLowerCase().includes(query) ?? false) ||
            (order.customer && order.customer.toLowerCase().includes(query)) ||
            (!order.customer && 'cliente general'.includes(query))
        );
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Cargando historial de pedidos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-destructive gap-4">
                <div className="p-4 rounded-full bg-destructive/10">
                    <History className="h-10 w-10" />
                </div>
                <div className="text-center">
                    <p className="font-bold text-lg">Error al cargar el historial</p>
                    <p className="text-sm opacity-80">Por favor, intenta recargar la página.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <History className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Historial de Cocina</h1>
                        <p className="text-xs text-muted-foreground font-medium">Visualiza los últimos pedidos procesados</p>
                    </div>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        placeholder="Buscar por cliente o # orden..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 bg-muted/30 border-border/50 rounded-xl focus-visible:ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between px-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <SlidersHorizontal className="h-3 w-3" />
                    Resultados: <span className="text-foreground">{filteredOrders.length}</span>
                </p>
            </div>

            {/* Grid layout */}
            {filteredOrders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredOrders.map(order => (
                        <KitchenHistoryCard key={order.idOrder} order={order} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-card/50 rounded-3xl border-2 border-dashed border-border/50">
                    <div className="p-6 rounded-full bg-muted/50 mb-4">
                        <Package className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No se encontraron pedidos</h3>
                    <p className="text-muted-foreground text-sm max-w-xs text-center mt-1">
                        {searchQuery
                            ? `No hay coincidencias para "${searchQuery}" en el historial.`
                            : "Aún no se han procesado pedidos en esta sesión."}
                    </p>
                </div>
            )}
        </div>
    );
};
