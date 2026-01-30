import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CASHIER_MENU_ITEMS } from '@/constants/cashier-menu.constants';

interface CashierMobileSidebarProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onNavigate: (path: string) => void;
}

export const CashierMobileSidebar = ({
    isOpen,
    onOpenChange,
    onNavigate,
}: CashierMobileSidebarProps) => {
    const handleNavigate = (path: string) => {
        onNavigate(path);
        onOpenChange(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-foreground hover:bg-accent hover:text-accent-foreground"
                    aria-label="Abrir menú"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-64 p-0 bg-(--cashier-sidebar) border-(--cashier-sidebar-border) overflow-y-auto"
            >
                {/* Header */}
                <div className="flex h-16 items-center px-4 border-b border-(--cashier-sidebar-border)">
                    <span className="text-lg font-bold text-(--cashier-sidebar-foreground)">Cajero</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 p-2">
                    {CASHIER_MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end
                                onClick={() => handleNavigate(item.path)}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                        'text-(--cashier-sidebar-foreground) hover:bg-(--cashier-sidebar-accent) hover:text-(--cashier-sidebar-accent-foreground)',
                                        isActive && 'bg-(--cashier-sidebar-primary) text-(--cashier-sidebar-primary-foreground) shadow-md'
                                    )
                                }
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-(--cashier-sidebar-border) p-3">
                    <p className="text-xs text-(--cashier-sidebar-foreground)/70">Modo Cajero</p>
                </div>
            </SheetContent>
        </Sheet>
    );
};
