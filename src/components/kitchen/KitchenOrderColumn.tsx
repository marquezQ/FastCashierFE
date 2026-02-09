import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KitchenOrderColumnProps {
    title: string;
    icon: ReactNode;
    count: number;
    children: ReactNode;
    variant: 'new' | 'preparing' | 'ready';
    className?: string;
}

export const KitchenOrderColumn = ({
    title,
    icon,
    count,
    children,
    variant,
    className
}: KitchenOrderColumnProps) => {
    const variantStyles = {
        new: 'bg-orange-500/5 border-orange-500/10 text-orange-700 dark:text-orange-400',
        preparing: 'bg-amber-500/5 border-amber-500/10 text-amber-700 dark:text-amber-400',
        ready: 'bg-emerald-500/5 border-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    };

    const headerStyles = {
        new: 'bg-orange-500/10 border-orange-500/20',
        preparing: 'bg-amber-500/10 border-amber-500/20',
        ready: 'bg-emerald-500/10 border-emerald-500/20',
    };

    return (
        <div className={cn(
            "flex flex-col h-full rounded-2xl border transition-all duration-300 shadow-sm",
            variantStyles[variant],
            className
        )}>
            {/* Column Header */}
            <div className={cn(
                "flex items-center justify-between p-4 border-b rounded-t-2xl",
                headerStyles[variant]
            )}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm shadow-sm">
                        {icon}
                    </div>
                    <h3 className="font-bold text-base md:text-lg tracking-tight uppercase">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm shadow-sm font-black text-sm">
                    {count}
                </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-3 overflow-y-auto space-y-4 no-scrollbar">
                {children}
            </div>
        </div>
    );
};
