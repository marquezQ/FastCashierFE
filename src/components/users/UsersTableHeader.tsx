import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const UsersTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="text-base font-semibold h-14 px-6">USUARIO</TableHead>
      <TableHead className="text-base font-semibold h-14 px-6">ROL</TableHead>
      <TableHead className="text-base font-semibold h-14 px-6">ESTADO</TableHead>
      <TableHead className="text-base font-semibold h-14 px-6">CREADO</TableHead>
      <TableHead className="text-base font-semibold h-14 text-right px-6">ACCIONES</TableHead>
    </TableRow>
  </TableHeader>
);
