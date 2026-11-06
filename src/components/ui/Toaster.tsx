// src/components/ui/Toaster.tsx
'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export function Toaster() {
    const { isDarkMode } = useAuth();

    return (
        <SonnerToaster
            theme={isDarkMode ? 'dark' : 'light'}
            position='bottom-right'
            closeButton
            offset={24}
            mobileOffset={16}
            toastOptions={{
                unstyled: true,
                style: {
                    // Desktop: más ancho. Mobile: casi todo el viewport.
                    width: '420px',
                    maxWidth: 'calc(100vw - 2rem)',
                } as React.CSSProperties,
                classNames: {
                    toast: 'flex items-center gap-3 w-full bg-white dark:bg-neutral-900 p-4 rounded-2xl border shadow-lg font-sans [&_.sonner-loader]:static [&_.sonner-loader]:transform-none [&_.sonner-loader]:m-0',
                    title: 'text-sm font-bold flex-1',
                    description: 'text-xs mt-0.5 opacity-90 flex-1',
                    // Botones: min-width para que no se parta "Cancelar" / "Eliminar"
                    actionButton:
                        'text-xs font-bold rounded-lg px-4 py-2 min-w-[88px] justify-center bg-neutral-900 text-white dark:bg-white dark:text-neutral-900',
                    cancelButton:
                        'text-xs font-bold rounded-lg px-4 py-2 min-w-[88px] justify-center bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
                    closeButton:
                        'w-6 h-6 rounded-full bg-white/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center [&_svg]:w-3 [&_svg]:h-3',
                    success:
                        'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
                    error: 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
                    warning:
                        'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
                    info: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-100',
                    loading:
                        'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 [&_[data-icon]]:flex [&_[data-icon]]:items-center [&_[data-icon]]:justify-center [&_[data-icon]]:size-5 [&_[data-icon]]:shrink-0',
                },
            }}
        />
    );
}
