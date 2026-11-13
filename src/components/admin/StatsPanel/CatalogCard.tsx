'use client';

import type { LucideIcon } from 'lucide-react';

interface CatalogItem {
    id: string;
    name: string;
}

interface CatalogCardProps {
    title: string;
    icon: LucideIcon;
    iconClassName?: string;
    items: CatalogItem[];
    emptyText?: string;
}

export default function CatalogCard({
    title,
    icon: Icon,
    iconClassName = 'text-primary-500',
    items,
    emptyText = 'Sin elementos cargados.',
}: CatalogCardProps) {
    return (
        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm'>
            <h4 className='font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2'>
                <Icon className={`w-4 h-4 ${iconClassName}`} />
                {title} ({items.length})
            </h4>

            {items.length === 0 ? (
                <p className='text-xs text-neutral-500'>{emptyText}</p>
            ) : (
                <div className='flex flex-wrap gap-1.5'>
                    {items.map((item) => (
                        <span
                            key={item.id}
                            className='px-2.5 py-1 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        >
                            {item.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
