import { useState } from 'react';
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
    const { isSessionActive, currentSession } = useCashierStore();
    const { closeSession, isClosing } = useCashierSession();

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
        <header className="sticky top-0 z-40 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
            <div className="flex h-full items-center gap-4 px-4 lg:px-6">
                <CashierMobileSidebar
                    isOpen={isMobileSidebarOpen}
                    onOpenChange={onMobileSidebarChange}
                    onNavigate={onNavigate}
                />

                {/* Session Status - Visible on desktop */}
                <div className="hidden lg:flex items-center gap-6">
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${isSessionActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <span className={`text-sm font-medium ${isSessionActive ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}>
                            {isSessionActive ? 'Turno Activo' : 'Sin Turno'}
                        </span>
                    </div>

                    {/* Time Indicator */}
                    {isSessionActive && currentSession && (
                        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                            <Clock className="h-4 w-4" />
                            <span>
                                Desde: {new Date(currentSession.openingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Close Session Button */}
                {isSessionActive && (
                    <div className="hidden lg:flex items-center ml-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex items-center gap-2 font-semibold shadow-sm hover:shadow-destructive/20"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar Turno
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-106.25">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-5 w-5" />
                                        Cerrar Turno de Caja
                                    </DialogTitle>
                                    <DialogDescription>
                                        Ingrese los montos finales para realizar el arqueo de caja.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="closingCash" className="font-semibold text-sm">Efectivo Final</Label>
                                        <div className="relative">
                                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="closingCash"
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-9"
                                                value={closingCash}
                                                onChange={(e) => setClosingCash(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="closingQr" className="font-semibold text-sm">Total QR / Transferencia</Label>
                                        <div className="relative">
                                            <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="closingQr"
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-9"
                                                value={closingQr}
                                                onChange={(e) => setClosingQr(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="obs" className="font-semibold text-sm text-muted-foreground">Observaciones (Opcional)</Label>
                                        <Input
                                            id="obs"
                                            placeholder="Detalles del cierre..."
                                            value={observations}
                                            onChange={(e) => setObservations(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <DialogFooter className="gap-2 sm:gap-0">
                                    <DialogClose asChild>
                                        <Button variant="ghost" disabled={isClosing}>Cancelar</Button>
                                    </DialogClose>
                                    <Button
                                        variant="destructive"
                                        onClick={handleCloseSession}
                                        disabled={isClosing || !closingCash || !closingQr}
                                        className="gap-2"
                                    >
                                        {isClosing ? 'Cerrando...' : 'Confirmar Cierre'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                <div className="flex-1" />

                <ThemeToggle />
                <UserMenu
                    user={user}
                    onNavigateProfile={() => onNavigate('/cashier/profile')}
                    onNavigateSettings={() => onNavigate('/cashier/settings')}
                    onLogout={onLogout}
                />
            </div>
        </header>
    );
};
