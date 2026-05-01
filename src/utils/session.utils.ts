import type { CashierSession } from '@/types/cashierSession';

/**
 * Gets a YYYY-MM-DD string in local time
 */
const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Groups sessions by opening date (YYYY-MM-DD) in local time
 */
export const groupSessionsByDate = (sessions: CashierSession[]) => {
    const groups: Record<string, CashierSession[]> = {};

    sessions.forEach(session => {
        const date = new Date(session.openingDate);
        const dateString = getLocalDateString(date);
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
    
    const today = getLocalDateString(now);
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    const formattedDate = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'long'
    }).toUpperCase();

    if (dateStr === today) return `HOY — ${formattedDate}`;
    if (dateStr === yesterday) return `AYER — ${formattedDate}`;
    return formattedDate;
};
