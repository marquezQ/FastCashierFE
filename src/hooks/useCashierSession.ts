import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cashierSessionService } from '../api/cashierSessionService';
import { useCashierStore } from '../store/useCashierStore';
import type { CreateSessionDto, CloseSessionDto } from '../types/cashierSession';
import { toast } from 'sonner';

export const useCashierSession = () => {
    const queryClient = useQueryClient();
    const setSession = useCashierStore((state) => state.setSession);
    const closeSession = useCashierStore((state) => state.closeSession);
    const currentSession = useCashierStore((state) => state.currentSession);

    // Mutation to open a session
    const openSessionMutation = useMutation({
        mutationFn: (data: CreateSessionDto) => cashierSessionService.openSession(data),
        onSuccess: (session) => {
            setSession(session);
            toast.success('Sesión de caja abierta correctamente');
            // Invalidar la query que usa RequireCashierSession para re-renderizar la vista
            queryClient.invalidateQueries({ queryKey: ['current-cashier-session'] });
            queryClient.invalidateQueries({ queryKey: ['cashier-sessions'] });
            queryClient.invalidateQueries({ queryKey: ['cashier-session-statistics'] });
        },
        onError: (error: any) => {
            console.error('Error opening session:', error);
            toast.error(error.response?.data?.message || 'Error al abrir la sesión de caja');
        },
    });

    // Mutation to close a session
    const closeSessionMutation = useMutation({
        mutationFn: (data: CloseSessionDto) => {
            if (!currentSession) throw new Error('No hay una sesión activa');
            return cashierSessionService.closeSession(currentSession.idSession, data);
        },
        onSuccess: () => {
            closeSession();
            toast.success('Sesión de caja cerrada correctamente');
            // Invalidar la query que usa RequireCashierSession para re-renderizar la vista
            queryClient.invalidateQueries({ queryKey: ['current-cashier-session'] });
            queryClient.invalidateQueries({ queryKey: ['cashier-sessions'] });
            queryClient.invalidateQueries({ queryKey: ['cashier-session-statistics'] });
        },
        onError: (error: any) => {
            console.error('Error closing session:', error);
            toast.error(error.response?.data?.message || 'Error al cerrar la sesión de caja');
        },
    });

    return {
        openSession: openSessionMutation.mutateAsync,
        isOpening: openSessionMutation.isPending,
        closeSession: closeSessionMutation.mutateAsync,
        isClosing: closeSessionMutation.isPending,
        error: openSessionMutation.error || closeSessionMutation.error,
    };
};
