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

// ============================================
// TIPOS PARA GESTIÓN DE USUARIOS
// ============================================

export interface Role {
  idRole: number;
  roleName: 'ADMIN' | 'CASHIER' | 'KITCHEN';
  description: string;
  createdAt: string;
}

export interface UserWithRole {
  idUser: number;
  fullName: string;
  email: string;
  phone: string;
  roleId: number;
  isActive: boolean;
  createdAt: string;
  lastAccess: string | null;
  createdBy: number | null;
  role: Role;
}