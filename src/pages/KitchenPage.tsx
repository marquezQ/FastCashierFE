import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useKitchenSocket } from '@/hooks/useKitchenSocket';
import { KitchenSidebar } from '@/components/layout/Kitchen/KitchenSidebar';
import { KitchenNavbar } from '@/components/layout/Kitchen/KitchenNavbar';
import { PedidosView } from './kitchen/PedidosView';
import { HistorialView } from './kitchen/HistorialView';
import { cn } from '@/lib/utils';

export const KitchenPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Real-time updates
  useKitchenSocket();

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
      <KitchenSidebar
        onNavigate={handleNavigate}
        onCollapsedChange={setIsSidebarCollapsed}
      />

      <div className={cn(
        'transition-all duration-300',
        isSidebarCollapsed ? 'xl:pl-16' : 'xl:pl-64'
      )}>
        <KitchenNavbar
          user={{
            fullName: user.fullName,
            email: user.email,
          }}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onMobileSidebarChange={setIsMobileSidebarOpen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <main className="p-4 md:p-6 xl:p-8">
          <Routes>
            <Route index element={<Navigate to="/kitchen/pedidos" replace />} />
            <Route path="/pedidos" element={<PedidosView />} />
            <Route path="/historial" element={<HistorialView />} />
            <Route path="*" element={<Navigate to="/kitchen" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};