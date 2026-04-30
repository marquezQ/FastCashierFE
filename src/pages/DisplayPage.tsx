import { useParams } from 'react-router-dom';
import { ProductCarousel } from '@/components/display/ProductCarousel';
import { useDisplayData } from '@/hooks/useDisplay';
import { Tv, AlertTriangle } from 'lucide-react';

// ============================================
// PÁGINA PÚBLICA — DISPLAY PARA TV
// ============================================
// Ruta: /display/:token (sin auth)

export const DisplayPage = () => {
  const { token } = useParams<{ token: string }>();

  // Fetch real data from backend
  const { data, isLoading, error } = useDisplayData(token ?? '');

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05050A]">
        <div className="text-center space-y-4">
          <Tv className="size-16 mx-auto text-violet-400 animate-pulse" />
          <p className="text-white/40 text-sm font-medium">Cargando menú...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05050A]">
        <div className="text-center space-y-4">
          <AlertTriangle className="size-16 mx-auto text-red-400" />
          <h1 className="text-2xl font-black text-white">Pantalla no encontrada</h1>
          <p className="text-white/40 text-sm font-mono">Token: {token}</p>
        </div>
      </div>
    );
  }

  // Render carousel
  return <ProductCarousel data={data} />;
};
