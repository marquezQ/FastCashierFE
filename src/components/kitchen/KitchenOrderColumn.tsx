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
            "flex flex-col h-full rounded-xl border transition-all duration-300 shadow-sm",
            variantStyles[variant],
            className
        )}>
            {/* Column Header */}
            <div className={cn(
                "flex items-center justify-between px-3 py-2.5 md:px-4 md:py-3 border-b rounded-t-xl",
                headerStyles[variant]
            )}>
                <div className="flex items-center gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg bg-background/50 backdrop-blur-sm shadow-sm">
                        {icon}
                    </div>
                    <h3 className="font-black text-sm md:text-base tracking-tight uppercase whitespace-nowrap">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-background/50 backdrop-blur-sm shadow-sm font-black text-sm tabular-nums">
                    {count}
                </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-2.5 md:p-3 overflow-y-auto space-y-3 no-scrollbar">
                {children}
            </div>
        </div>
    );
};
