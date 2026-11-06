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
                classNames: {
                    toast: 'flex items-center gap-3 w-full p-4 rounded-2xl border shadow-lg font-sans',
                    title: 'text-sm font-bold',
                    description: 'text-xs mt-0.5',
                    actionButton:
                        'text-xs font-bold rounded-lg px-2.5 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900',
                    cancelButton:
                        'text-xs font-bold rounded-lg px-2.5 py-1.5 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
                    closeButton:
                        'rounded-full bg-white/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700',
                    success:
                        'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
                    error: 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
                    warning:
                        'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
                    info: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-100',
                    loading:
                        'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 [&_[data-icon]]:flex [&_[data-icon]]:items-center [&_[data-icon]]:justify-start [&_[data-icon]]:relative [&_[data-icon]]:size-4 [&_.sonner-loader]:static [&_.sonner-loader]:transform-none',
                },
            }}
        />
    );
}
