import { useState, useEffect, useRef } from 'react';
import { CashierMobileSidebar } from './CashierMobileSidebar';
import { useCashierStore } from '@/store/useCashierStore';
import { Clock } from 'lucide-react';
import { UserMenu } from '../Navbar/UserMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CloseSessionDialog } from '@/components/cashier/CloseSessionDialog';

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
    const { isSessionActive } = useCashierStore();

    // Timer effect for live clock (Ultra-optimized, memory-leak-free)
    const [currentTime, setCurrentTime] = useState(new Date());
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        // Sync with the next minute boundary, then tick every minute
        const scheduleNextTick = () => {
            const now = new Date();
            setCurrentTime(now);
            // ms until 00 seconds of next minute
            const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
            timerRef.current = setTimeout(scheduleNextTick, delay);
        };

        scheduleNextTick();
        // Cleanup: always clears the latest timer, preventing memory leaks
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm w-full">
            <div className="flex h-full items-center px-2 md:px-4 lg:px-6 max-w-full overflow-hidden">
                <div className="flex items-center gap-1.5 md:gap-4 shrink min-w-0">
                    <CashierMobileSidebar
                        isOpen={isMobileSidebarOpen}
                        onOpenChange={onMobileSidebarChange}
                        onNavigate={onNavigate}
                    />

                    {/* Session Status - Ultra Compact on Mobile */}
                    <div className="flex items-center gap-2 md:gap-6 min-w-0 shrink">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full shrink-0 ${isSessionActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            <span className={`text-[11px] md:text-sm font-bold truncate max-w-12.5 sm:max-w-none ${isSessionActive ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}>
                                {isSessionActive ? (
                                    <>
                                        Turno <span className="hidden sm:inline">Activo</span>
                                    </>
                                ) : 'Cerrada'}
                            </span>
                        </div>

                        {/* Time Indicator - Smaller on mobile line */}
                        {isSessionActive && (
                            <div className="hidden min-[400px]:flex items-center gap-1 md:gap-2 text-[11px] md:text-sm text-green-700 dark:text-green-400 shrink-0 backdrop-blur-sm bg-green-500/5 px-2 py-0.5 rounded-full border border-green-500/10">
                                <Clock className="h-3 w-3 md:h-4 md:w-4" />
                                <span suppressHydrationWarning>
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Close Session Button - Adaptive */}
                    {isSessionActive && (
                        <div className="flex items-center shrink-0">
                            <CloseSessionDialog 
                                isOpen={isDialogOpen} 
                                onOpenChange={setIsDialogOpen} 
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                    <ThemeToggle />
                    <UserMenu
                        user={user}
                        onNavigateProfile={() => onNavigate('/cashier/profile')}
                        onNavigateSettings={() => onNavigate('/cashier/settings')}
                        onLogout={onLogout}
                    />
                </div>
            </div>
        </header>
    );
};
