interface DashboardHeaderProps {
  userName: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Bienvenido, {userName}
      </h1>
      <p className="text-muted-foreground">
        Resumen general del sistema de punto de venta
      </p>
    </div>
  );
};