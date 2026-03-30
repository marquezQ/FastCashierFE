import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCashierStore } from '@/store/useCashierStore';
import { useAuthStore } from '@/store/authStore';
import { cashierSessionService } from '@/api/cashierSessionService';
import { OpenRegisterForm } from '@/components/cashier/OpenRegisterForm';

interface Props {
    children: React.ReactNode;
}

export const RequireCashierSession = ({ children }: Props) => {
    const { setSession } = useCashierStore();
    const { user } = useAuthStore();

    // Source of truth: always the backend
    const { data: activeSession, isLoading, isError } = useQuery({
        queryKey: ['current-cashier-session', user?.idUser],
        queryFn: () => cashierSessionService.getCurrentSession(user!.idUser),
        enabled: !!user?.idUser,
        refetchOnWindowFocus: false,
        retry: false,
    });

    // Sync backend result into Zustand so the rest of the app can read it
    // (cart state, statistics, etc. all depend on currentSession)
    useEffect(() => {
        if (!isLoading) {
            setSession(isError ? null : (activeSession ?? null));
        }
    }, [activeSession, isLoading, isError, setSession]);

    // 1. Loading: block render while we wait for the backend
    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md" />
                <p className="text-muted-foreground animate-pulse font-medium">Verificando estado de la caja...</p>
            </div>
        );
    }

    // 2. No active session (backend confirmed): show open-register form
    // Derive directly from React Query data — no Zustand lag
    const hasActiveSession = !isError && !!activeSession && activeSession.status === 'OPEN';
    if (!hasActiveSession) {
        return <OpenRegisterForm />;
    }

    // 3. Session confirmed: render cashier views
    return <>{children}</>;
};

