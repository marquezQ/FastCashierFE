import {
  LayoutDashboard,
  Users,
  Package,
  Clock,
  ShoppingCart,
  BarChart3,
} from 'lucide-react';

export const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Usuarios', path: '/admin/usuarios' },
  { icon: Package, label: 'Productos', path: '/admin/productos' },
  { icon: Clock, label: 'Turnos', path: '/admin/turnos' },
  { icon: ShoppingCart, label: 'Órdenes', path: '/admin/ordenes' },
  { icon: BarChart3, label: 'Reportes', path: '/admin/reportes' },
] as const;