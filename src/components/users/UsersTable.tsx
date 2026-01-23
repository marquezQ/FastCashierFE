import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import type { UserWithRole } from '@/types/auth';
import { UserTableRow } from './UserTableRow';
import { UsersTableHeader } from './UsersTableHeader';

interface UsersTableProps {
  users: UserWithRole[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <UsersTableHeader />
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-base">
                No hay usuarios disponibles
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.idUser}
                user={user}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
