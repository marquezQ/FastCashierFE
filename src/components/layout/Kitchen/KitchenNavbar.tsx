import { Clock, CookingPot, VolumeX } from 'lucide-react';
import { UserMenu } from '../Navbar/UserMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { KitchenMobileSidebar } from './KitchenMobileSidebar';
import { useTtsAudio } from '@/hooks/useTtsAudio';
import { Button } from '@/components/ui/button';

interface KitchenNavbarProps {
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

export const KitchenNavbar = ({
    user,
    isMobileSidebarOpen,
    onMobileSidebarChange,
    onNavigate,
    onLogout,
}: KitchenNavbarProps) => {
    const { isAudioUnlocked, unlockAudio } = useTtsAudio();

    return (
        <header className="sticky top-0 z-40 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm w-full">
            <div className="flex h-full items-center px-2 md:px-4 xl:px-6 max-w-full overflow-hidden">
                <div className="flex items-center gap-1.5 md:gap-4 shrink min-w-0">
                    <KitchenMobileSidebar
                        isOpen={isMobileSidebarOpen}
                        onOpenChange={onMobileSidebarChange}
                        onNavigate={onNavigate}
                    />

                    {/* Kitchen Identity - Professional Amber */}
                    <div className="flex items-center gap-2 md:gap-4 min-w-0 shrink">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                            <CookingPot className="h-4 w-4 md:h-5 md:w-5 text-orange-600 dark:text-orange-400" />
                            <span className="text-xs md:text-sm font-bold text-orange-700 dark:text-orange-300 whitespace-nowrap">
                                Panel de Cocina
                            </span>
                        </div>

                        {/* Efficiency Timer (Placeholder for session/uptime) */}
                        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/40">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Servicio Activo</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                    {!isAudioUnlocked && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={unlockAudio}
                            className="h-8 md:h-9 bg-red-500 hover:bg-red-600 outline-none animate-pulse flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 text-xs md:text-sm shadow-sm"
                            title="Activar audio de notificaciones"
                        >
                            <VolumeX className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            <span className="hidden sm:inline font-bold">Activar Audios</span>
                        </Button>
                    )}
                    <ThemeToggle />
                    <UserMenu
                        user={user}
                        onNavigateChangePassword={() => onNavigate('/kitchen/change-password')}
                        onLogout={onLogout}
                    />
                </div>
            </div>
        </header>
    );
};
