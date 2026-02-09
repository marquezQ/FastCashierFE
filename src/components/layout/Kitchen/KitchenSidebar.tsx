import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { KITCHEN_MENU_ITEMS } from '@/constants/kitchen-menu.constants';
import { Button } from '@/components/ui/button';

interface KitchenSidebarProps {
    onNavigate?: (path: string) => void;
    onCollapsedChange?: (collapsed: boolean) => void;
}

export const KitchenSidebar = ({ onNavigate, onCollapsedChange }: KitchenSidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Empieza contraído por requerimiento

    const toggleCollapsed = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        onCollapsedChange?.(newState);
    };

    return (
        <aside
            className={cn(
                'hidden xl:fixed xl:inset-y-0 xl:flex xl:flex-col bg-(--kitchen-sidebar) border-r border-(--kitchen-sidebar-border) shadow-lg transition-all duration-300',
                isCollapsed ? 'xl:w-16' : 'xl:w-64'
            )}
        >
            {/* Header con toggle */}
            <div className="flex h-16 items-center justify-between px-3 border-b border-(--kitchen-sidebar-border)">
                {!isCollapsed && (
                    <span className="text-lg font-bold text-(--kitchen-sidebar-foreground)">Cocina</span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapsed}
                    className="text-(--kitchen-sidebar-foreground) hover:bg-(--kitchen-sidebar-accent)"
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
                {KITCHEN_MENU_ITEMS.map((item) => {
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
                                    'text-(--kitchen-sidebar-foreground) hover:bg-(--kitchen-sidebar-accent) hover:text-(--kitchen-sidebar-accent-foreground)',
                                    isActive && 'bg-(--kitchen-sidebar-primary) text-(--kitchen-sidebar-primary-foreground) shadow-md',
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
                <div className="border-t border-(--kitchen-sidebar-border) p-3">
                    <p className="text-xs text-(--kitchen-sidebar-foreground)/70">
                        Modo cocina
                    </p>
                </div>
            )}
        </aside>
    );
};
