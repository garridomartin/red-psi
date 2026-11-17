'use client';

import { Loader2, X } from 'lucide-react';
import { ArticleFormFields } from '@/types';

interface ArticleFormProps<T extends ArticleFormFields> {
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    onSubmit: (e: React.FormEvent) => void | Promise<void>;
    isSubmitting?: boolean;
    editingArticleId?: string | null;
    onCancelEdit?: () => void;
}

export default function ArticleForm<T extends ArticleFormFields>({
    formData,
    setFormData,
    onSubmit,
    isSubmitting = false,
    editingArticleId = null,
    onCancelEdit,
}: ArticleFormProps<T>) {
    const isEditing = Boolean(editingArticleId);

    const patch = (partial: Partial<ArticleFormFields>) =>
        setFormData((prev) => ({ ...prev, ...partial }));

    return (
        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-card'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-bold text-base font-display text-neutral-900 dark:text-neutral-50'>
                    {isEditing
                        ? 'Editar artículo de divulgación'
                        : 'Publicar nuevo artículo de divulgación'}
                </h3>

                {isEditing && onCancelEdit && (
                    <button
                        type='button'
                        onClick={onCancelEdit}
                        disabled={isSubmitting}
                        className='inline-flex items-center gap-1.5 text-[11px] font-bold rounded-lg px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <X className='w-3.5 h-3.5' />
                        Cancelar edición
                    </button>
                )}
            </div>

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

                <div className='flex justify-end gap-2'>
                    {isEditing && onCancelEdit && (
                        <button
                            type='button'
                            onClick={onCancelEdit}
                            disabled={isSubmitting}
                            className='py-2.5 px-5 text-xs font-bold rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            Cancelar
                        </button>
                    )}

                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='inline-flex items-center gap-2 py-2.5 px-5 text-xs font-bold rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950 disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                        {isSubmitting && <Loader2 className='w-3.5 h-3.5 animate-spin' />}
                        {isSubmitting
                            ? isEditing
                                ? 'Guardando...'
                                : 'Publicando...'
                            : isEditing
                              ? 'Guardar cambios'
                              : 'Publicar artículo'}
                    </button>
                </div>
            </form>
        </div>
    );
}
