interface DashboardHeaderProps {
  userName: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const currentDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        Bienvenido, {userName}
      </h1>
      <p className="text-muted-foreground mt-2 text-lg capitalize">
        {currentDate}
      </p>
      <div className="mt-4 h-1 w-full bg-linear-to-r from-primary to-primary/30 rounded-full" />
    </div>
  );
};