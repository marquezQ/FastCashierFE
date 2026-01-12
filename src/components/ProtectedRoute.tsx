import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getRoleRoute } from '../constants/roles';
import type { RoleName } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: RoleName[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role, user } = useAuthStore();

  // No autenticado → login
  if (!isAuthenticated || !role || !user) {
    return <Navigate to="/login" replace />;
  }

  // Rol no permitido → su dashboard
  if (!allowedRoles.includes(role)) {
    const redirectTo = getRoleRoute(user.roleId);
    return <Navigate to={redirectTo} replace />;
  }

  // Todo OK
  return <>{children}</>;
};