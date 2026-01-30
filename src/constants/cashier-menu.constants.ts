import { ShoppingCart, Clock, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CashierMenuItem {
    label: string;
    icon: LucideIcon;
    path: string;
}

export const CASHIER_MENU_ITEMS: CashierMenuItem[] = [
    {
        label: 'Pedidos',
        icon: ShoppingCart,
        path: '/cashier',
    },
    {
        label: 'Historial',
        icon: Clock,
        path: '/cashier/historial',
    },
    {
        label: 'Estadísticas',
        icon: BarChart3,
        path: '/cashier/estadisticas',
    },
];
