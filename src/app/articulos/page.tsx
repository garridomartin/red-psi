'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticles } from '@/lib/data/dataStore';
import { Article } from '@/types';
import { BookOpen, Clock, Calendar, ArrowRight, User } from 'lucide-react';

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
      const load = async () => {
        const all = await getArticles();
        setArticles(all.filter((a) => a.is_published));
      };
      load();
  }, []);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12'>
            {/* Header */}
            <div className='text-center max-w-2xl mx-auto space-y-3'>
                <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-400/20 text-neutral-900 dark:text-neutral-100'>
                    <BookOpen className='w-3.5 h-3.5 text-primary-500' />
                    <span>Divulgación & Bienestar</span>
                </div>
                <h1 className='text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-neutral-50'>
                    Artículos de interés y psicoeducación
                </h1>
                <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                    Recursos, guías y reflexiones escritas por nuestro equipo de psicólogos para
                    ayudarte a comprender tu salud mental.
                </p>
            </div>

            {/* Articles Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {articles.map((art) => (
                    <article
                        key={art.id}
                        className='group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-card hover:shadow-hover hover:border-primary-400/50 transition-all duration-300 flex flex-col justify-between'
                    >
                        <div>
                            <div className='relative aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800'>
                                <img
                                    src={art.cover_url}
                                    alt={art.title}
                                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                                />
                            </div>

                            <div className='p-6 space-y-3'>
                                <div className='flex items-center gap-3 text-xs text-neutral-500'>
                                    <span className='flex items-center gap-1'>
                                        <Clock className='w-3.5 h-3.5' />
                                        {art.reading_time_minutes} min de lectura
                                    </span>
                                </div>

                                <Link href={`/articulos/${art.slug}`}>
                                    <h3 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2'>
                                        {art.title}
                                    </h3>
                                </Link>

                                <p className='text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed'>
                                    {art.excerpt}
                                </p>
                            </div>
                        </div>

                        <div className='p-6 pt-0 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between mt-4'>
                            <div className='flex items-center gap-2'>
                                <div className='w-7 h-7 rounded-full bg-primary-400/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold'>
                                    {art.author.charAt(0)}
                                </div>
                                <span className='text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
                                    {art.author}
                                </span>
                            </div>

                            <Link
                                href={`/articulos/${art.slug}`}
                                className='inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:translate-x-0.5 transition-transform'
                            >
                                <span>Leer</span>
                                <ArrowRight className='w-3.5 h-3.5' />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
