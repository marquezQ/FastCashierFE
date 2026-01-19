import { Button } from '@/components/ui/button';
import { MENU_ITEMS } from '@/constants/menu.constants';
import { useLocation } from 'react-router-dom';

interface SidebarContentProps {
  onNavigate: (path: string) => void;
}

export const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Header con gradiente */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border bg-linear-to-r from-sidebar-primary/5 to-transparent">
        <h2 className="text-2xl font-bold text-gradient-primary">
          POS Admin
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 transition-all ${isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              onClick={() => onNavigate(item.path)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <p className="text-xs text-sidebar-foreground/60 text-center">v1.0.0</p>
      </div>
    </div>
  );
};
