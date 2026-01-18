import { MobileSidebar } from '../Sidebar/MobileSidebar';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  user: {
    fullName: string;
    email: string;
    avatar?: string;
  };
  isMobileSidebarOpen: boolean;
  onMobileSidebarChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const Navbar = ({
  user,
  isMobileSidebarOpen,
  onMobileSidebarChange,
  onNavigate,
  onLogout,
}: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-card">
      <div className="flex h-full items-center gap-4 px-4">
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onOpenChange={onMobileSidebarChange}
          onNavigate={onNavigate}
        />
        <div className="flex-1" />
        <UserMenu
          user={user}
          onNavigateProfile={() => onNavigate('/admin/profile')}
          onNavigateSettings={() => onNavigate('/admin/settings')}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};