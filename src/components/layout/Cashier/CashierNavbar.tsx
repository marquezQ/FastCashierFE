import { CashierMobileSidebar } from './CashierMobileSidebar';
import { UserMenu } from '../Navbar/UserMenu';
import { ThemeToggle } from '@/components/ThemeToggle';

interface CashierNavbarProps {
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

export const CashierNavbar = ({
    user,
    isMobileSidebarOpen,
    onMobileSidebarChange,
    onNavigate,
    onLogout,
}: CashierNavbarProps) => {
    return (
        <header className="sticky top-0 z-40 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
            <div className="flex h-full items-center gap-4 px-4 lg:px-6">
                <CashierMobileSidebar
                    isOpen={isMobileSidebarOpen}
                    onOpenChange={onMobileSidebarChange}
                    onNavigate={onNavigate}
                />

                {/* Título visible en desktop */}
                <div className="hidden lg:block">
                    <h2 className="text-lg font-semibold text-foreground">
                        Sistema de Punto de Venta
                    </h2>
                </div>

                <div className="flex-1" />

                <ThemeToggle />
                <UserMenu
                    user={user}
                    onNavigateProfile={() => onNavigate('/cashier/profile')}
                    onNavigateSettings={() => onNavigate('/cashier/settings')}
                    onLogout={onLogout}
                />
            </div>
        </header>
    );
};
