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
      <div className="h-16 flex items-center px-6 border-b">
        <h2 className="text-2xl font-bold text-primary">POS Admin</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 hover:bg-accent"
              onClick={() => onNavigate(item.path)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t text-sm text-muted-foreground">
        <p>v1.0.0</p>
      </div>
    </div>
  );
};
