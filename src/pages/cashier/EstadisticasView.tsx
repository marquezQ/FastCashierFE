import { BarChart3, DollarSign, Clock, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const EstadisticasView = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-green-700 dark:text-green-400">
                    Estadísticas del Turno
                </h1>
                <p className="text-muted-foreground mt-1">
                    Resumen de tu turno actual
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Ventas Totales */}
                <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                            Ventas Totales
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            $0.00
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            0 pedidos completados
                        </p>
                    </CardContent>
                </Card>

                {/* Pedidos */}
                <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                            Pedidos
                        </CardTitle>
                        <Receipt className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            0
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total del turno
                        </p>
                    </CardContent>
                </Card>

                {/* Tiempo de Turno */}
                <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                            Tiempo de Turno
                        </CardTitle>
                        <Clock className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            0h 0m
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sin turno activo
                        </p>
                    </CardContent>
                </Card>

                {/* Promedio por Pedido */}
                <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                            Promedio
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            $0.00
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Por pedido
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detalles Adicionales */}
            <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="border-b border-green-100 dark:border-green-900">
                    <CardTitle className="text-green-700 dark:text-green-400">
                        Detalles del Turno
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mb-3 text-green-400" />
                        <p>No hay estadísticas disponibles</p>
                        <p className="text-sm mt-1">Inicia tu turno para comenzar</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
