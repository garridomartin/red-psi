'use client';

import { ArticleFormData } from '@/types';

interface ArticleFormProps {
    formData: ArticleFormData;
    setFormData: React.Dispatch<React.SetStateAction<ArticleFormData>>;
    onSubmit: (e: React.FormEvent) => void | Promise<void>;
    isSubmitting?: boolean;
}

export default function ArticleForm({
    formData,
    setFormData,
    onSubmit,
    isSubmitting = false,
}: ArticleFormProps) {
    const patch = (partial: Partial<ArticleFormData>) =>
        setFormData((prev) => ({ ...prev, ...partial }));

    return (
        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-card'>
            <h3 className='font-bold text-base font-display text-neutral-900 dark:text-neutral-50 mb-4'>
                Publicar nuevo artículo de divulgación
            </h3>

            <form onSubmit={onSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                            Título del artículo
                        </label>
                        <input
                            type='text'
                            required
                            value={formData.title}
                            onChange={(e) => patch({ title: e.target.value })}
                            placeholder='Ej: Cómo elegir tu primer psicólogo'
                            className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                            URL de la imagen de portada
                        </label>
                        <input
                            type='url'
                            required
                            value={formData.cover_url}
                            onChange={(e) => patch({ cover_url: e.target.value })}
                            placeholder='https://images.unsplash.com/...'
                            className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                        />
                    </div>
                </div>

                <div>
                    <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                        Resumen o copete
                    </label>
                    <textarea
                        rows={2}
                        required
                        value={formData.excerpt}
                        onChange={(e) => patch({ excerpt: e.target.value })}
                        placeholder='Breve introducción para la tarjeta...'
                        className='w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 resize-none'
                    />
                </div>

                <div>
                    <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                        Contenido completo
                    </label>
                    <textarea
                        rows={5}
                        required
                        value={formData.content}
                        onChange={(e) => patch({ content: e.target.value })}
                        placeholder='Texto completo del artículo...'
                        className='w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    />
                </div>

                <div className='flex justify-end'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='py-2.5 px-5 text-xs font-bold rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950 disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        {isSubmitting ? 'Publicando...' : 'Publicar artículo'}
                    </button>
                </div>
            </form>
        </div>
    );
}
