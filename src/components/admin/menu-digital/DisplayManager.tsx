import { useState } from 'react';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import {
  useDisplayConfigs,
  useCreateDisplayConfig,
  useUpdateDisplayConfig,
  useDeleteDisplayConfig,
} from '@/hooks/useDisplay';
import { DisplayConfigList } from './DisplayConfigList';
import { DisplayConfigFormModal } from './DisplayConfigFormModal';
import { DeleteDisplayDialog } from './DeleteDisplayDialog';
import type { DisplayConfig } from '@/types/display';
import type { DisplayConfigFormValues } from '@/schemas/display.schema';

// ============================================
// DISPLAY MANAGER — ORQUESTADOR PRINCIPAL
// ============================================

export const DisplayManager = () => {
  // Queries y Mutations
  const { data: categories } = useProducts();
  const { data: configs = [], isLoading } = useDisplayConfigs();
  const createConfig = useCreateDisplayConfig();
  const updateConfig = useUpdateDisplayConfig();
  const deleteConfig = useDeleteDisplayConfig();

  // Estado del modal de formulario
  const [formModal, setFormModal] = useState<{
    open: boolean;
    config: DisplayConfig | null;
  }>({ open: false, config: null });

  // Estado del dialog de eliminación
  const [deleteTarget, setDeleteTarget] = useState<DisplayConfig | null>(null);

  // ========================================
  // HANDLERS
  // ========================================

  const handleOpenCreate = () => {
    setFormModal({ open: true, config: null });
  };

  const handleOpenEdit = (config: DisplayConfig) => {
    setFormModal({ open: true, config });
  };

  const handleCloseFormModal = (open: boolean) => {
    if (!open) {
      setFormModal({ open: false, config: null });
    }
  };

  const handleSubmitForm = async (data: DisplayConfigFormValues) => {
    try {
      if (formModal.config) {
        // Modo edición
        await updateConfig.mutateAsync({
          id: formModal.config.idDisplayConfig,
          data,
        });
        toast.success('Configuración guardada');
      } else {
        // Modo creación — el backend no acepta isActive en el DTO de creación
        const { isActive: _, ...createData } = data;
        await createConfig.mutateAsync(createData);
        toast.success('Pantalla creada exitosamente');
      }
      setFormModal({ open: false, config: null });
    } catch {
      toast.error(
        formModal.config
          ? 'Error al guardar la configuración'
          : 'Error al crear la pantalla'
      );
    }
  };

  const handleOpenDelete = (config: DisplayConfig) => {
    setDeleteTarget(config);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteConfig.mutateAsync(deleteTarget.idDisplayConfig);
      toast.success('Pantalla eliminada exitosamente');
      setDeleteTarget(null);
    } catch {
      toast.error('Error al eliminar la pantalla');
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="@container/display space-y-6">
      {/* ========== PANTALLAS CONFIGURADAS ========== */}
      <DisplayConfigList
        configs={configs}
        isLoading={isLoading}
        isCreating={createConfig.isPending}
        onCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* ========== MODAL DE FORMULARIO (CREAR / EDITAR) ========== */}
      <DisplayConfigFormModal
        open={formModal.open}
        onOpenChange={handleCloseFormModal}
        config={formModal.config}
        categories={categories}
        isPending={createConfig.isPending || updateConfig.isPending}
        onSubmit={handleSubmitForm}
      />

      {/* ========== DIALOG DE ELIMINACIÓN ========== */}
      <DeleteDisplayDialog
        config={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteConfig.isPending}
      />
    </div>
  );
};
