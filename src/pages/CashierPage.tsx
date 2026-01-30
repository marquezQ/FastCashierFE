import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { CashierSidebar } from '@/components/layout/Cashier/CashierSidebar';
import { CashierNavbar } from '@/components/layout/Cashier/CashierNavbar';
import { PedidosView } from './cashier/PedidosView';
import { HistorialView } from './cashier/HistorialView';
import { EstadisticasView } from './cashier/EstadisticasView';
import { cn } from '@/lib/utils';

export const CashierPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Empieza contraído

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <CashierSidebar
        onNavigate={handleNavigate}
        onCollapsedChange={setIsSidebarCollapsed}
      />

      <div className={cn(
        'transition-all duration-300',
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      )}>
        <CashierNavbar
          user={{
            fullName: user.fullName,
            email: user.email,
          }}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onMobileSidebarChange={setIsMobileSidebarOpen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <main className="p-4">
          <Routes>
            <Route index element={<Navigate to="/cashier/pedidos" replace />} />
            <Route path="/pedidos" element={<PedidosView />} />
            <Route path="/historial" element={<HistorialView />} />
            <Route path="/estadisticas" element={<EstadisticasView />} />
            <Route path="*" element={<Navigate to="/cashier" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};