import { useState, useEffect, useRef } from 'react';
import { CashierMobileSidebar } from './CashierMobileSidebar';
import { useCashierStore } from '@/store/useCashierStore';
import { useCashierSession } from '@/hooks/useCashierSession';
import { Clock, LogOut, Wallet, QrCode, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '../Navbar/UserMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

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
    const { closeSession, isClosing } = useCashierSession();

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

    // Form state for closing
    const [closingCash, setClosingCash] = useState('');
    const [closingQr, setClosingQr] = useState('');
    const [observations, setObservations] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCloseSession = async () => {
        if (!closingCash || isNaN(Number(closingCash)) || Number(closingCash) < 0) {
            return;
        }
        if (!closingQr || isNaN(Number(closingQr)) || Number(closingQr) < 0) {
            return;
        }

        try {
            await closeSession({
                closingCashAmount: Number(closingCash),
                closingQrAmount: Number(closingQr),
                closingDate: new Date().toISOString(),
                observations: observations.trim() || undefined
            });
            setIsDialogOpen(false);
            // Reset form
            setClosingCash('');
            setClosingQr('');
            setObservations('');
        } catch (error) {
            // Error managed by hook
        }
    };

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
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-8 md:h-9 px-2 md:px-4 text-[10px] md:text-sm font-bold shadow-md shadow-destructive/10 transition-all active:scale-95 flex items-center gap-1 md:gap-2"
                                    >
                                        <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        <span className="hidden min-[400px]:inline">Cerrar Turno</span>
                                        <span className="min-[400px]:hidden">Cerrar</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[95vw] sm:max-w-106.25 rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-destructive text-lg md:text-xl font-bold">
                                            <AlertTriangle className="h-5 w-5 animate-pulse" />
                                            Cerrar Turno de Caja
                                        </DialogTitle>
                                        <DialogDescription className="text-xs md:text-sm font-medium">
                                            Realice el conteo final para completar el arqueo.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="closingCash" className="font-bold text-xs md:text-sm flex items-center gap-2">
                                                <Wallet className="h-4 w-4 text-primary" /> Efectivo Final ($)
                                            </Label>
                                            <Input
                                                id="closingCash"
                                                type="number"
                                                placeholder="0.00"
                                                className="h-11 bg-muted/30 focus:ring-2 focus:ring-destructive/20 border-border/50"
                                                value={closingCash}
                                                onChange={(e) => setClosingCash(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="closingQr" className="font-bold text-xs md:text-sm flex items-center gap-2">
                                                <QrCode className="h-4 w-4 text-primary" /> Total QR / Transf.
                                            </Label>
                                            <Input
                                                id="closingQr"
                                                type="number"
                                                placeholder="0.00"
                                                className="h-11 bg-muted/30 focus:ring-2 focus:ring-destructive/20 border-border/50"
                                                value={closingQr}
                                                onChange={(e) => setClosingQr(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="obs" className="font-bold text-xs md:text-sm text-muted-foreground">Observaciones (Opcional)</Label>
                                            <Input
                                                id="obs"
                                                placeholder="Notas adicionales sobre el turno..."
                                                className="h-11 bg-muted/30 border-border/50"
                                                value={observations}
                                                onChange={(e) => setObservations(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                                        <DialogClose asChild>
                                            <Button variant="ghost" className="w-full sm:w-auto font-semibold" disabled={isClosing}>Cancelar</Button>
                                        </DialogClose>
                                        <Button
                                            variant="destructive"
                                            onClick={handleCloseSession}
                                            disabled={isClosing || !closingCash || !closingQr}
                                            className="w-full sm:w-auto font-bold shadow-lg shadow-destructive/20 gap-2"
                                        >
                                            {isClosing ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Procesando...
                                                </>
                                            ) : 'Confirmar Cierre de Caja'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
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
