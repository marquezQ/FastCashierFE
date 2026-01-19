import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { StatCard } from './StatCard';

const DAILY_STATS = [
  {
    icon: ShoppingCart,
    label: 'Pedidos de Hoy',
    value: 24,
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-500/10',
  },
  {
    icon: DollarSign,
    label: 'Ventas de Hoy',
    value: '$1,234',
    iconColor: 'text-green-600',
    iconBgColor: 'bg-green-500/10',
  },
  {
    icon: DollarSign,
    label: 'Ventas Semana',
    value: '$8,450',
    iconColor: 'text-emerald-600',
    iconBgColor: 'bg-emerald-500/10',
  },
  {
    icon: DollarSign,
    label: 'Ventas Mes',
    value: '$32,890',
    iconColor: 'text-teal-600',
    iconBgColor: 'bg-teal-500/10',
  },
];

const BUSINESS_STATS = [
  {
    icon: Users,
    label: 'Usuarios Totales',
    value: 150,
    iconColor: 'text-purple-600',
    iconBgColor: 'bg-purple-500/10',
  },
  {
    icon: UserCheck,
    label: 'Usuarios Activos',
    value: 89,
    iconColor: 'text-violet-600',
    iconBgColor: 'bg-violet-500/10',
  },
  {
    icon: Package,
    label: 'Productos Totales',
    value: 320,
    iconColor: 'text-orange-600',
    iconBgColor: 'bg-orange-500/10',
  },
  {
    icon: CheckCircle,
    label: 'Productos Activos',
    value: 285,
    iconColor: 'text-amber-600',
    iconBgColor: 'bg-amber-500/10',
  },
];

export const StatsGrid = () => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold">Estadísticas del Día</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {DAILY_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold">Resumen del Negocio</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BUSINESS_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};