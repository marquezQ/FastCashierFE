import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CASHIER_MENU_ITEMS } from '@/constants/cashier-menu.constants';
import { Button } from '@/components/ui/button';

interface CashierSidebarProps {
    onNavigate?: (path: string) => void;
    onCollapsedChange?: (collapsed: boolean) => void;
}

export const CashierSidebar = ({ onNavigate, onCollapsedChange }: CashierSidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Empieza contraído

    const toggleCollapsed = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        onCollapsedChange?.(newState);
    };

    return (
        <aside
            className={cn(
                'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-(--cashier-sidebar) border-r border-(--cashier-sidebar-border) shadow-lg transition-all duration-300',
                isCollapsed ? 'lg:w-16' : 'lg:w-64'
            )}
        >
            {/* Header con toggle */}
            <div className="flex h-16 items-center justify-between px-3 border-b border-(--cashier-sidebar-border)">
                {!isCollapsed && (
                    <span className="text-lg font-bold text-(--cashier-sidebar-foreground)">Cajero</span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapsed}
                    className="text-(--cashier-sidebar-foreground) hover:bg-(--cashier-sidebar-accent)"
                >
                    <ChevronRight
                        className={cn(
                            'h-5 w-5 transition-transform duration-300',
                            !isCollapsed && 'rotate-180'
                        )}
                    />
                </Button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
                {CASHIER_MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            onClick={() => onNavigate?.(item.path)}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                    'text-(--cashier-sidebar-foreground) hover:bg-(--cashier-sidebar-accent) hover:text-(--cashier-sidebar-accent-foreground)',
                                    isActive && 'bg-(--cashier-sidebar-primary) text-(--cashier-sidebar-primary-foreground) shadow-md',
                                    isCollapsed ? 'justify-center' : 'gap-3'
                                )
                            }
                        >
                            <Icon className={cn('h-5 w-5 shrink-0', isCollapsed && 'h-6 w-6')} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="border-t border-(--cashier-sidebar-border) p-3">
                    <p className="text-xs text-(--cashier-sidebar-foreground)/70">
                        Modo Cajero
                    </p>
                </div>
            )}
        </aside>
    );
};
