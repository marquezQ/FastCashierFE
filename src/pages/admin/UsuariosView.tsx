import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UsersTable } from '@/components/users/UsersTable';
import { useDeleteUser } from '@/hooks/useUserMutations';
import type { UserWithRole } from '@/types/auth';

export const UsuariosView = () => {
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();

  const handleCreate = () => {
    // TODO: Abrir modal/dialog para crear usuario
    console.log('Crear nuevo usuario');
  };

  const handleEdit = (user: UserWithRole) => {
    // TODO: Abrir modal/dialog para editar usuario
    console.log('Editar usuario:', user);
  };

  const handleDelete = async (user: UserWithRole) => {
    // TODO: Agregar confirmación antes de eliminar
    if (confirm(`¿Estás seguro de eliminar a ${user.fullName}?`)) {
      try {
        await deleteUser.mutateAsync(user.idUser);
        // La tabla se actualizará automáticamente gracias a invalidateQueries
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        // TODO: Mostrar toast de error
      }
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

      {!isLoading && !error && users && (
        <UsersTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
