import { ShoppingCart } from 'lucide-react';
import { useCashierStore } from '@/store/useCashierStore';
import { cn } from '@/lib/utils';

interface MobileCartFABProps {
    onClick: () => void;
}

/**
 * Floating Action Button for the mobile cart.
 * Always visible (Option A). Badge appears only when there are items.
 * Uses cashier emerald identity with premium shadow and tactile feedback.
 */
export const MobileCartFAB = ({ onClick }: MobileCartFABProps) => {
    const { orderItems } = useCashierStore();
    const itemCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <button
            onClick={onClick}
            className={cn(
                'fixed bottom-6 right-4 z-50',
                'h-14 w-14 rounded-full',
                'bg-(--cashier-sidebar-primary) text-(--cashier-sidebar-primary-foreground)',
                'shadow-xl shadow-(--cashier-sidebar-primary)/30',
                'flex items-center justify-center',
                'transition-all duration-200 active:scale-90',
                'hover:shadow-2xl hover:shadow-(--cashier-sidebar-primary)/40',
                // Subtle ring when cart has items
                itemCount > 0 && 'ring-2 ring-(--cashier-sidebar-primary)/50 ring-offset-2 ring-offset-background'
            )}
            aria-label={`Carrito: ${itemCount} items`}
        >
            <ShoppingCart className="h-6 w-6" />

            {/* Item count badge — only visible when items exist */}
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-6 min-w-6 px-1 rounded-full bg-destructive text-white text-xs font-black tabular-nums shadow-lg animate-in zoom-in-50 duration-200">
                    {itemCount}
                </span>
            )}
        </button>
    );
};
