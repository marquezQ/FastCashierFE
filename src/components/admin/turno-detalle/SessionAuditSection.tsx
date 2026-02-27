import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface SessionAuditSectionProps {
    title: string;
    icon: LucideIcon;
    iconClassName?: string;
    containerClassName?: string;
    children: React.ReactNode;
}

export const SessionAuditSection = ({
    title,
    icon: Icon,
    iconClassName,
    containerClassName,
    children
}: SessionAuditSectionProps) => {
    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center gap-2 px-1 shrink-0">
                <Icon className={cn("h-4 w-4", iconClassName)} />
                <span className="admin-label-sm truncate">
                    {title}
                </span>
            </div>

            <div className={cn(
                "flex-1 rounded-[1.5rem] border p-6 flex flex-col justify-between transition-all duration-300",
                containerClassName
            )}>
                {children}
            </div>
        </div>
    );
};

interface AuditRowProps {
    label: string;
    value: string;
    labelClassName?: string;
    valueClassName?: string;
    showSeparator?: boolean;
}

export const AuditRow = ({ label, value, labelClassName, valueClassName, showSeparator }: AuditRowProps) => (
    <>
        <div className="flex justify-between items-center gap-4 py-0.5">
            <span className={cn("admin-label-sm tracking-tight", labelClassName)}>{label}</span>
            <span className={cn("text-base font-black text-foreground/90", valueClassName)}>{value}</span>
        </div>
        {showSeparator && <Separator className="bg-border/60 my-2.5" />}
    </>
);

interface AuditTotalProps {
    label: string;
    value: string;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
}

export const AuditTotal = ({ label, value, className, labelClassName, valueClassName }: AuditTotalProps) => (
    <div className={cn("flex justify-between items-end pt-3", className)}>
        <span className={cn("admin-label-sm text-muted-foreground/70", labelClassName)}>{label}</span>
        <span className={cn("text-3xl font-black leading-none tracking-tighter", valueClassName)}>{value}</span>
    </div>
);
