import { Tv } from 'lucide-react';
import { DisplayManager } from '@/components/admin/menu-digital/DisplayManager';

// ============================================
// VISTA ADMIN — MENÚ DIGITAL
// ============================================

export const MenuDigitalView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 dark:bg-violet-500/20 p-2.5">
            <Tv className="size-6 text-violet-500" />
          </div>
          <div>
            <h1 className="admin-h1">Menú Digital</h1>
            <p className="admin-subtitle">
              Configura las pantallas de TV de tu restaurante
            </p>
          </div>
        </div>
        <div className="mt-2 h-1 w-full bg-linear-to-r from-violet-500 to-violet-500/30 rounded-full" />
      </div>

      {/* Contenido principal */}
      <DisplayManager />
    </div>
  );
};
