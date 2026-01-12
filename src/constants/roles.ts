// ============================================
// CONFIGURACIÓN DE ROLES
// ============================================

export const ROLES = {
  ADMIN: {
    id: 1,
    name: 'ADMIN',
    route: '/admin',
  },
  CASHIER: {
    id: 2,
    name: 'CASHIER',
    route: '/cashier',
  },
  KITCHEN: {
    id: 3,
    name: 'KITCHEN',
    route: '/kitchen',
  },
} as const;

// Helper: Obtener rol por ID
export const getRoleById = (roleId: number) => {
  return Object.values(ROLES).find(role => role.id === roleId);
};

// Helper: Obtener ruta por rol ID
export const getRoleRoute = (roleId: number) => {
  const role = getRoleById(roleId);
  return role?.route || '/login';
};