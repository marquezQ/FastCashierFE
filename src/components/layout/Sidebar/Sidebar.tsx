import { SidebarContent } from './SidebarContent';

interface SidebarProps {
  onNavigate: (path: string) => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-card">
      <SidebarContent onNavigate={onNavigate} />
    </aside>
  );
};