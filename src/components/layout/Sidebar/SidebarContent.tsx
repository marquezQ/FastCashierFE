import { Button } from '@/components/ui/button';
import { MENU_ITEMS } from '@/constants/menu.constants';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarContentProps {
  onNavigate: (path: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const SidebarContent = ({ onNavigate, isCollapsed = false, onToggle }: SidebarContentProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header con gradiente y Toggle */}
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border bg-linear-to-r from-sidebar-primary/5 to-transparent transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "justify-between px-6"
      )}>
        {!isCollapsed && (
          <h2 className="text-2xl font-bold text-gradient-primary truncate">
            POS Admin
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              !isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                "w-full transition-all duration-200 group relative",
                isCollapsed ? "justify-center px-0 py-6" : "justify-start gap-5 px-5 py-4",
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 font-semibold shadow-lg'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
              onClick={() => onNavigate(item.path)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn(
                "shrink-0 transition-transform group-hover:scale-110",
                isCollapsed ? "h-9 w-9" : "h-8 w-8"
              )} />
              {!isCollapsed && <span className="text-base truncate">{item.label}</span>}

              {/* Indicador de activo cuando está colapsado */}
              {isCollapsed && isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        "p-4 border-t border-sidebar-border bg-sidebar-accent/30 flex items-center justify-center transition-all",
        isCollapsed ? "h-12" : "h-14"
      )}>
        <p className={cn(
          "text-xs text-sidebar-foreground/60 font-medium transition-opacity duration-300",
          isCollapsed ? "opacity-0 invisible" : "opacity-100 visible"
        )}>
          v1.0.0
        </p>
      </div>
    </div>
  );
};
