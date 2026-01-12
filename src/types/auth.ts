// ============================================
// TIPOS DE AUTENTICACIÓN
// ============================================

export type RoleName = 'ADMIN' | 'CASHIER' | 'KITCHEN';

export interface User {
  idUser: number;
  fullName: string;
  email: string;
  roleId: number;
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}