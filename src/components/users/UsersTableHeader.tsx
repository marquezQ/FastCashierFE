import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const UsersTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="text-base font-semibold h-14">USUARIO</TableHead>
      <TableHead className="text-base font-semibold h-14">ROL</TableHead>
      <TableHead className="text-base font-semibold h-14">ESTADO</TableHead>
      <TableHead className="text-base font-semibold h-14">CREADO</TableHead>
      <TableHead className="text-base font-semibold h-14 text-right">ACCIONES</TableHead>
    </TableRow>
  </TableHeader>
);
