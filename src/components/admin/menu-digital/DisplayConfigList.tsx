import { useState } from 'react';
import {
  Check,
  Copy,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Tv,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TRANSITION_OPTIONS } from '@/constants/display';
import type { DisplayConfig } from '@/types/display';

// ============================================
// LISTA DE PANTALLAS CONFIGURADAS
// ============================================

interface DisplayConfigListProps {
  configs: DisplayConfig[];
  isLoading: boolean;
  isCreating: boolean;
  onCreate: () => void;
  onEdit: (config: DisplayConfig) => void;
  onDelete: (config: DisplayConfig) => void;
}

export const DisplayConfigList = ({
  configs,
  isLoading,
  isCreating,
  onCreate,
  onEdit,
  onDelete,
}: DisplayConfigListProps) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyUrl = (config: DisplayConfig) => {
    const url = `${window.location.origin}/display/${config.accessToken}`;
    navigator.clipboard.writeText(url);
    setCopiedId(config.idDisplayConfig);
    toast.success('URL copiada al portapapeles');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePreview = (config: DisplayConfig) => {
    const url = `${window.location.origin}/display/${config.accessToken}`;
    window.open(url, '_blank');
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="admin-h2">Pantallas Configuradas</h2>
        <Button size="sm" onClick={onCreate} disabled={isCreating}>
          {isCreating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Nueva Pantalla
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border/60">
          <p className="text-sm text-muted-foreground animate-pulse">
            Cargando pantallas...
          </p>
        </div>
      ) : configs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border border-dashed border-border/60">
          <Tv className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No hay pantallas configuradas
          </p>
        </div>
      ) : (
        <div className="grid gap-3 @[500px]/display:grid-cols-2 @[900px]/display:grid-cols-3">
          {configs.map((config) => (
            <div
              key={config.idDisplayConfig}
              className="group relative flex flex-col gap-3 rounded-2xl border border-border/40 dark:border-border/60 bg-card/60 dark:bg-card p-4 transition-all duration-200 hover:shadow-sm"
            >
              {/* Header: Icon + Name + Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-muted p-2">
                    <Tv className="size-4 text-muted-foreground" />
                  </div>
                  <span className="font-bold text-sm tracking-tight">
                    {config.name}
                  </span>
                </div>
                <Badge
                  variant={config.isActive ? 'default' : 'secondary'}
                  className={cn(
                    'text-[10px] font-black uppercase tracking-widest',
                    config.isActive
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {config.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>

              {/* Info row */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">
                  {TRANSITION_OPTIONS.find(
                    (t) => t.value === config.transitionType
                  )?.label ?? config.transitionType}
                </span>
                <span>·</span>
                <span>{config.rotationInterval}s</span>
                <span>·</span>
                <span>{config.productsPerSlide} por slide</span>
              </div>

              {/* Access token + Copy URL */}
              <div className="flex items-center gap-2 rounded-xl bg-muted/40 dark:bg-muted/60 border border-border/30 px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Código TV
                  </p>
                  <p className="text-sm font-black tracking-widest text-primary truncate">
                    {config.accessToken}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 size-8 p-0"
                  onClick={() => handleCopyUrl(config)}
                >
                  {copiedId === config.idDisplayConfig ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs gap-1.5"
                  onClick={() => handlePreview(config)}
                >
                  <Eye className="size-3.5" />
                  Vista Previa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs gap-1.5"
                  onClick={() => onEdit(config)}
                >
                  <Pencil className="size-3.5" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(config)}
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
