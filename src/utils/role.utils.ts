import { Shield, User, UtensilsCrossed, type LucideIcon } from 'lucide-react';

export interface RoleBadgeConfig {
  className: string;
  icon: LucideIcon;
}

export const getRoleBadgeConfig = (roleName: string): RoleBadgeConfig => {
  switch (roleName) {
    case 'ADMIN':
      return {
        className: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
        icon: Shield,
      };
    case 'CASHIER':
      return {
        className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
        icon: User,
      };
    case 'KITCHEN':
      return {
        className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
        icon: UtensilsCrossed,
      };
    default:
      return {
        className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800',
        icon: User,
      };
  }
};

export const getRoleNameInSpanish = (roleName: string): string => {
  switch (roleName) {
    case 'ADMIN':
      return 'Administrador';
    case 'CASHIER':
      return 'Cajero';
    case 'KITCHEN':
      return 'Cocina';
    default:
      return roleName;
  }
};
