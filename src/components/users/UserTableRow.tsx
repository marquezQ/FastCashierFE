import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pencil, Trash2 } from 'lucide-react';
import type { UserWithRole } from '@/types/auth';
import { getInitials } from '@/utils/string.utils';
import { formatDate } from '@/utils/date.utils';
import { getRoleBadgeConfig, getRoleNameInSpanish } from '@/utils/role.utils';
import { DeleteUserDialog } from './DeleteUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { useDeleteUser, useUpdateUser } from '@/hooks/useUserMutations';
import type { UpdateUserFormValues } from '@/schemas/auth.schema';
import { toast } from 'sonner';

interface UserTableRowProps {
  user: UserWithRole;
}

export const UserTableRow = ({ user }: UserTableRowProps) => {
  const roleConfig = getRoleBadgeConfig(user.role.roleName);
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateSubmit = async (data: UpdateUserFormValues) => {
    try {
      await updateUser.mutateAsync({ id: user.idUser, data });
      toast.success('Usuario actualizado exitosamente');
      setIsEditDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el usuario';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser.mutateAsync(user.idUser);
      toast.success('Usuario eliminado exitosamente');
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Error al eliminar el usuario';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <>
      <TableRow key={user.idUser} className="h-auto md:h-20">
        <UserTableCellUser user={user} />
        <UserTableCellRole roleConfig={roleConfig} roleName={user.role.roleName} />
        <UserTableCellStatus isActive={user.isActive} />
        <UserTableCellDate createdAt={user.createdAt} />
        <UserTableCellActions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </TableRow>

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={user}
        onConfirm={handleConfirmDelete}
        isLoading={deleteUser.isPending}
      />

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={user}
        onSubmit={handleUpdateSubmit}
        isLoading={updateUser.isPending}
      />
    </>
  );
};

const UserTableCellUser = ({ user }: { user: UserWithRole }) => (
  <TableCell className="py-3 md:py-4 px-3 md:px-6">
    <div className="flex items-center gap-2.5 md:gap-4 min-w-37.5 md:min-w-0">
      <Avatar className="size-10 md:size-12 shrink-0">
        <AvatarFallback className="bg-muted text-sm md:text-base font-semibold">
          {getInitials(user.fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="font-semibold text-sm md:text-base truncate">{user.fullName}</div>
        <div className="text-xs md:text-sm text-muted-foreground mt-0.5 truncate">
          {user.email}
        </div>
      </div>
    </div>
  </TableCell>
);

const UserTableCellRole = ({
  roleConfig,
  roleName,
}: {
  roleConfig: ReturnType<typeof getRoleBadgeConfig>;
  roleName: string;
}) => {
  const RoleIcon = roleConfig.icon;

  return (
    <TableCell className="py-3 md:py-4 px-4 md:px-6">
      <Badge
        variant="outline"
        className={`${roleConfig.className} text-xs md:text-sm px-2.5 md:px-3 py-1 md:py-1.5 whitespace-nowrap`}
      >
        <RoleIcon className="size-3.5 md:size-4" />
        {getRoleNameInSpanish(roleName)}
      </Badge>
    </TableCell>
  );
};

const UserTableCellStatus = ({ isActive }: { isActive: boolean }) => (
  <TableCell className="py-3 md:py-4 px-4 md:px-6">
    <Badge
      variant="outline"
      className={`${isActive
          ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
          : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800'
        } text-xs md:text-sm px-2.5 md:px-3 py-1 md:py-1.5 whitespace-nowrap`}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  </TableCell>
);

const UserTableCellDate = ({ createdAt }: { createdAt: string }) => (
  <TableCell className="py-3 md:py-4 text-sm md:text-base px-4 md:px-6 whitespace-nowrap">{formatDate(createdAt)}</TableCell>
);

const UserTableCellActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <TableCell className="py-3 md:py-4 text-right px-4 md:px-6">
    <div className="flex items-center justify-end gap-2 md:gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 md:h-10 md:w-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        onClick={onEdit}
      >
        <Pencil className="size-4 md:size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 md:h-10 md:w-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={onDelete}
      >
        <Trash2 className="size-4 md:size-5" />
      </Button>
    </div>
  </TableCell>
);
