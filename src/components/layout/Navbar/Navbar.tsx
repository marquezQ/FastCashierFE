import { MobileSidebar } from '../Sidebar/MobileSidebar';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <header className="sticky top-0 z-40 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="flex h-full items-center gap-4 px-4 lg:px-6">
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onOpenChange={onMobileSidebarChange}
          onNavigate={onNavigate}
        />
        <div className="flex-1" />
        <ThemeToggle />
        <UserMenu
          user={user}
          onNavigateChangePassword={() => onNavigate('/admin/change-password')}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};