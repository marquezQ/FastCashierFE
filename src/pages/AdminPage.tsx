import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { cn } from '@/lib/utils';
import { DashboardView } from './admin/DashboardView';
import { UsuariosView } from './admin/UsuariosView';
import { ProductosView } from './admin/ProductosView';
import { TurnosView } from './admin/TurnosView';
import { OrdenesView } from './admin/OrdenesView';
import { ReportesView } from './admin/ReportesView';
import { MenuDigitalView } from './admin/MenuDigitalView';
import { ChangePasswordView } from './ChangePasswordView';

export const AdminPage = () => {
  const { user } = useAuthStore();
  const { handleNavigate, handleLogout } = useAdminNavigation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={cn(
        "transition-all duration-300",
        isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        <Navbar
          user={user}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onMobileSidebarChange={setIsMobileSidebarOpen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <main className="p-2 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<DashboardView userName={user.fullName} />} />
              <Route path="/usuarios" element={<UsuariosView />} />
              <Route path="/productos" element={<ProductosView />} />
              <Route path="/turnos" element={<TurnosView />} />
              <Route path="/ordenes" element={<OrdenesView />} />
              <Route path="reportes" element={<ReportesView />} />
              <Route path="/menu-digital" element={<MenuDigitalView />} />
              <Route path="/change-password" element={<ChangePasswordView role="ADMIN" />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};