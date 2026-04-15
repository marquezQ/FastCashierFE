import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  CheckCircle,
  ClockAlert,
  ArrowRight,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { StatCard } from './StatCard';
import { RecentDiscrepancies } from './RecentDiscrepancies';
import { FinancialDistribution } from './FinancialDistribution';
import { OperationalPerformance } from './OperationalPerformance';
import { Link } from 'react-router-dom';

const DAILY_STATS = [
  {
    icon: ShoppingCart,
    label: 'Pedidos de Hoy',
    value: 24,
    iconColor: 'text-blue-500',
    iconBgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
  },
  {
    icon: DollarSign,
    label: 'Ventas de Hoy',
    value: '$1,234',
    iconColor: 'text-emerald-500',
    iconBgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
  },
  {
    icon: ClockAlert,
    label: 'Turnos en Total',
    value: 120, // Hardcoded for now
    iconColor: 'text-orange-500',
    iconBgColor: 'bg-orange-500/10 dark:bg-orange-500/20',
  },
  {
    icon: DollarSign,
    label: 'Ventas Mes',
    value: '$32,890',
    iconColor: 'text-teal-500',
    iconBgColor: 'bg-teal-500/10 dark:bg-teal-500/20',
  },
];

const BUSINESS_STATS = [
  {
    icon: Users,
    label: 'Usuarios Totales',
    value: 150,
    iconColor: 'text-purple-500',
    iconBgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
  },
  {
    icon: Package,
    label: 'Productos Totales',
    value: 320,
    iconColor: 'text-amber-500',
    iconBgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
  },
  {
    icon: CheckCircle,
    label: 'Productos Activos',
    value: 285,
    iconColor: 'text-emerald-500',
    iconBgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
  },
];

const QUICK_LINKS = [
  { label: 'Gestión de Órdenes', icon: ClipboardList, to: '/admin/ordenes', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Reportes Financieros', icon: BarChart3, to: '/admin/reportes', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Control de Turnos', icon: ClockAlert, to: '/admin/turnos', color: 'text-orange-500', bg: 'bg-orange-500/10' }
];

export const StatsGrid = () => {
  return (
    <div className="@container/dashboard space-y-8">
      {/* Accesos Rápidos */}
      <section>
        <div className="grid gap-4 @[600px]/dashboard:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="group flex flex-col sm:flex-row items-center sm:justify-start justify-center gap-4 rounded-2xl border border-border/40 bg-card/40 p-4 shadow-sm hover:shadow-md transition-all duration-300 dark:border-white/6 hover:bg-card/80"
            >
              <div className={`p-2 rounded-xl ${link.bg} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <link.icon className={`h-5 w-5 ${link.color}`} />
              </div>
              <div className="flex flex-1 items-center justify-between w-full">
                <span className="font-bold text-sm tracking-tight">{link.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sección principal: Tarjetas de resumen */}
      <section>
        <div className="mb-4">
          <h2 className="admin-h2">Resumen General</h2>
        </div>
        <div className="grid gap-4 @[600px]/dashboard:grid-cols-2 @[1100px]/dashboard:grid-cols-4">
          {DAILY_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Sección Secundaria: Rendimiento, Distribución y Tablas */}
      <section className="grid gap-6 @[900px]/dashboard:grid-cols-3">
        <div className="@[900px]/dashboard:col-span-1">
          <FinancialDistribution />
        </div>
        <div className="@[900px]/dashboard:col-span-2">
          <div className="grid gap-6 @[500px]/dashboard:grid-cols-2 h-full">
            <RecentDiscrepancies />
            <OperationalPerformance />
          </div>
        </div>
      </section>

      {/* Tercera Sección: Entidades */}
      <section>
        <div className="mb-4 mt-4">
          <h2 className="admin-h2">Entidades del Sistema</h2>
        </div>
        <div className="grid gap-4 @[600px]/dashboard:grid-cols-2 @[900px]/dashboard:grid-cols-3">
          {BUSINESS_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>
    </div>
  );
};