import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UsersTable } from '@/components/users/UsersTable';
import { useCreateUser } from '@/hooks/useUserMutations';
import { CreateUserDialog } from '@/components/users/CreateUserDialog';
import type { CreateUserFormValues } from '@/schemas/auth.schema';
import { toast } from 'sonner';

export const UsuariosView = () => {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (data: CreateUserFormValues) => {
    try {
      // Validar que roleId esté presente (el schema ya lo valida, pero TypeScript necesita esta verificación)
      if (!data.roleId || data.roleId < 1) {
        throw new Error('Debe seleccionar un rol');
      }

      // Extraer solo los campos necesarios para el backend (excluir confirmPassword)
      const { confirmPassword, roleId, ...restData } = data;
      await createUser.mutateAsync({
        ...restData,
        roleId: roleId, // TypeScript ahora sabe que roleId es number
      });
      toast.success('Usuario creado exitosamente');
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el usuario';
      toast.error(errorMessage);
      throw error; // Re-throw para que el formulario maneje el error
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button size="lg" onClick={handleCreate}>
          <Plus className="size-5" />
          Nuevo Usuario
        </Button>
      </div>

      {isLoading && (
        <div className="rounded-lg border bg-card p-16 text-center">
          <p className="text-lg text-muted-foreground">Cargando usuarios...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border bg-card p-16 text-center">
          <p className="text-lg text-destructive">Error al cargar los usuarios</p>
        </div>
      )}

      {!isLoading && !error && users && <UsersTable users={users} />}

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={createUser.isPending}
      />
    </div>
  );
};
