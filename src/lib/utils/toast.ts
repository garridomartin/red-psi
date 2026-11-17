// lib/utils/toast.ts
import { toast } from 'sonner';

type NotifyType = 'success' | 'error';

/**
 * Notificación simple (success/error) con textos por defecto.
 * Reemplaza al viejo `showNotification` del AdminDashboard.
 */
export const notify = (type: NotifyType, text: string, description?: string) => {
    if (type === 'success') {
        toast.success(text);
        return;
    }
    toast.error(text, {
        description: description ?? 'Revisá los datos e intentá de nuevo.',
        duration: 6000,
    });
};

export const notifySuccess = (text: string) => notify('success', text);
export const notifyError = (text: string, description?: string) =>
    notify('error', text, description);

/**
 * Toast de loading persistente con un mensaje. Devuelve el id para cerrarlo
 * con `toast.dismiss(id)` cuando termine la operación.
 *
 * Útil para operaciones async (guardar/eliminar).
 */
export const notifyLoading = (message: string) => toast.loading(message, { duration: Infinity });

/**
 * Reexportamos `toast` para los casos que necesitan JSX custom,
 * confirmaciones con action/cancel, etc. Así los módulos no importan
 * `sonner` directamente y queda un único punto de entrada.
 */
export { toast };
