import { SidebarContent } from './SidebarContent';

interface SidebarProps {
  onNavigate: (path: string) => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-sidebar border-r border-sidebar-border shadow-sm">
      <SidebarContent onNavigate={onNavigate} />
    </aside>
  );
};