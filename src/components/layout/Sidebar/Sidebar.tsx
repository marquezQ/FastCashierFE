import { cn } from '@/lib/utils';
import { SidebarContent } from './SidebarContent';

interface SidebarProps {
  onNavigate: (path: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ onNavigate, isCollapsed = false, onToggle }: SidebarProps) => {
  return (
    <aside className={cn(
      "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-sidebar border-r border-sidebar-border shadow-sm transition-all duration-300 z-50",
      isCollapsed ? "lg:w-16" : "lg:w-64"
    )}>
      <SidebarContent
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />
    </aside>
  );
};