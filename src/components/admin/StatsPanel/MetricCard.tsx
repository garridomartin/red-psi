'use client';

import type { LucideIcon } from 'lucide-react';

type MetricColor = 'sky' | 'emerald' | 'rose' | 'amber' | 'violet';

const COLOR_CLASSES: Record<MetricColor, { wrap: string; icon: string }> = {
    sky: {
        wrap: 'bg-sky-50 dark:bg-sky-950/40',
        icon: 'text-sky-600 dark:text-sky-400',
    },
    emerald: {
        wrap: 'bg-emerald-50 dark:bg-emerald-950/40',
        icon: 'text-emerald-600 dark:text-emerald-400',
    },
    rose: {
        wrap: 'bg-rose-50 dark:bg-rose-950/40',
        icon: 'text-rose-600 dark:text-rose-400',
    },
    amber: {
        wrap: 'bg-amber-50 dark:bg-amber-950/40',
        icon: 'text-amber-600 dark:text-amber-400',
    },
    violet: {
        wrap: 'bg-violet-50 dark:bg-violet-950/40',
        icon: 'text-violet-600 dark:text-violet-400',
    },
};

interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: number;
    color?: MetricColor;
}

export default function MetricCard({ icon: Icon, label, value, color = 'sky' }: MetricCardProps) {
    const classes = COLOR_CLASSES[color];
    return (
        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm'>
            <div
                className={`w-10 h-10 rounded-2xl ${classes.wrap} ${classes.icon} flex items-center justify-center mb-3`}
            >
                <Icon className='w-5 h-5' />
            </div>
            <p className='text-xs font-semibold text-neutral-500'>{label}</p>
            <h3 className='text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1'>
                {value.toLocaleString()}
            </h3>
        </div>
    );
}
