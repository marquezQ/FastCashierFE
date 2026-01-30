import { Clock, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useCashierStore } from '@/store/useCashierStore';
import { OpenRegisterForm } from '@/components/cashier/OpenRegisterForm';

export const HistorialView = () => {
    const { isSessionActive } = useCashierStore();

    if (!isSessionActive) {
        return <OpenRegisterForm />;
    }
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-green-700 dark:text-green-400">
                    Historial
                </h1>
                <p className="text-muted-foreground mt-1">
                    Consulta el historial de pedidos de tu turno
                </p>
            </div>

            {/* Search Bar */}
            <Card className="border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por número de pedido, cliente..."
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Historial Content */}
            <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="border-b border-green-100 dark:border-green-900">
                    <CardTitle className="text-green-700 dark:text-green-400">
                        Pedidos del Turno Actual
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <Clock className="h-12 w-12 mb-3 text-green-400" />
                        <p className="font-medium">No hay pedidos en el turno actual</p>
                        <p className="text-sm mt-1">
                            Los pedidos que realices aparecerán aquí
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
