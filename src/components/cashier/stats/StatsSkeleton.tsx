import { Skeleton } from '@/components/ui/skeleton';

export const StatsSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 px-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-48" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-1">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2 px-1">
                <Skeleton className="h-[300px] w-full rounded-2xl" />
                <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
        </div>
    );
};
