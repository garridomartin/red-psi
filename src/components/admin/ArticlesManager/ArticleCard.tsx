'use client';

import { Trash2 } from 'lucide-react';
import type { Article } from '@/types';

interface ArticleCardProps {
    article: Article;
    onDelete: (id: string, title: string) => void;
    isDeleting?: boolean;
}

export default function ArticleCard({ article, onDelete, isDeleting = false }: ArticleCardProps) {
    return (
        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start gap-4'>
            <img
                src={article.cover_url}
                alt={article.title}
                className='w-20 h-20 rounded-2xl object-cover shrink-0'
            />
            <div className='flex-1 min-w-0'>
                <h4 className='font-bold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1'>
                    {article.title}
                </h4>
                <p className='text-xs text-neutral-500 line-clamp-2 mt-1'>{article.excerpt}</p>
                <div className='mt-3 flex items-center justify-between text-[11px] text-neutral-400'>
                    <span>{article.author}</span>
                    <button
                        type='button'
                        onClick={() => onDelete(article.id, article.title)}
                        disabled={isDeleting}
                        className='text-red-500 hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Trash2 className='w-3 h-3' />
                        <span>Eliminar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
