export const HistorialView = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-6 rounded-full bg-slate-500/10 border-2 border-dashed border-slate-500/20">
                <span className="text-4xl">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Historial de Entregados</h2>
            <p className="text-muted-foreground max-w-sm">Control de pedidos que ya salieron de cocina.</p>
        </div>
    );
};
