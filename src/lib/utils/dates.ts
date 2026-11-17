// lib/utils/dates.ts

/**
 * Formatea un ISO date/datetime (ej: '2024-03-15' o '2024-03-15T10:00:00Z')
 * a formato argentino DD/MM/YYYY.
 *
 * - No usa `new Date()` a propósito: evita corrimientos por timezone
 *   (un '2024-03-15' se interpretaría como UTC y podría mostrar 14/03 en AR).
 * - Si el valor es null/undefined/vacío, devuelve `fallback`.
 */
export const formatDateAR = (iso: string | null | undefined, fallback = '—'): string => {
    if (!iso) return fallback;
    const [y, m, d] = iso.slice(0, 10).split('-');
    if (!y || !m || !d) return fallback;
    return `${d}/${m}/${y}`;
};

/**
 * Devuelve la fecha de hoy en formato ISO corto ('YYYY-MM-DD').
 * Útil para defaults de inputs type="date" y para "usar fecha de hoy".
 */
export const todayISO = (): string => new Date().toISOString().slice(0, 10);
