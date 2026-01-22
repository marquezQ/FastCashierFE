import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pencil, Trash2 } from 'lucide-react';
import type { UserWithRole } from '@/types/auth';
import { getInitials } from '@/utils/string.utils';
import { formatDate } from '@/utils/date.utils';
import { getRoleBadgeConfig, getRoleNameInSpanish } from '@/utils/role.utils';

interface UserTableRowProps {
  user: UserWithRole;
  onEdit?: (user: UserWithRole) => void;
  onDelete?: (user: UserWithRole) => void;
}

export const UserTableRow = ({ user, onEdit, onDelete }: UserTableRowProps) => {
  const roleConfig = getRoleBadgeConfig(user.role.roleName);

  return (
    <TableRow key={user.idUser} className="h-20">
      <UserTableCellUser user={user} />
      <UserTableCellRole roleConfig={roleConfig} roleName={user.role.roleName} />
      <UserTableCellStatus isActive={user.isActive} />
      <UserTableCellDate createdAt={user.createdAt} />
      <UserTableCellActions
        user={user}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </TableRow>
  );
};

const UserTableCellUser = ({ user }: { user: UserWithRole }) => (
  <TableCell className="py-4">
    <div className="flex items-center gap-4">
      <Avatar className="size-12">
        <AvatarFallback className="bg-muted text-base font-semibold">
          {getInitials(user.fullName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold text-base">{user.fullName}</div>
        <div className="text-sm text-muted-foreground mt-0.5">
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
    <TableCell className="py-4">
      <Badge
        variant="outline"
        className={`${roleConfig.className} text-sm px-3 py-1.5`}
      >
        <RoleIcon className="size-4" />
        {getRoleNameInSpanish(roleName)}
      </Badge>
    </TableCell>
  );
};

const UserTableCellStatus = ({ isActive }: { isActive: boolean }) => (
  <TableCell className="py-4">
    <Badge
      variant="outline"
      className={`${
        isActive
          ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
          : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800'
      } text-sm px-3 py-1.5`}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </Badge>
  </TableCell>
);

const UserTableCellDate = ({ createdAt }: { createdAt: string }) => (
  <TableCell className="py-4 text-base">{formatDate(createdAt)}</TableCell>
);

const UserTableCellActions = ({
  user,
  onEdit,
  onDelete,
}: {
  user: UserWithRole;
  onEdit?: (user: UserWithRole) => void;
  onDelete?: (user: UserWithRole) => void;
}) => (
  <TableCell className="py-4 text-right">
    <div className="flex items-center justify-end gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        onClick={() => onEdit?.(user)}
      >
        <Pencil className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={() => onDelete?.(user)}
      >
        <Trash2 className="size-5" />
      </Button>
    </div>
  </TableCell>
);
