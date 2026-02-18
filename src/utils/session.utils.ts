import type { CashierSession } from '@/types/cashierSession';

/**
 * Groups sessions by opening date (YYYY-MM-DD)
 */
export const groupSessionsByDate = (sessions: CashierSession[]) => {
    const groups: Record<string, CashierSession[]> = {};

    sessions.forEach(session => {
        const date = new Date(session.openingDate);
        const dateString = date.toISOString().split('T')[0];
        if (!groups[dateString]) groups[dateString] = [];
        groups[dateString].push(session);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
};

/**
 * Formats the date header for the session timeline
 */
export const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const formattedDate = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'long'
    }).toUpperCase();

    if (dateStr === today) return `HOY — ${formattedDate}`;
    if (dateStr === yesterday) return `AYER — ${formattedDate}`;
    return formattedDate;
};
