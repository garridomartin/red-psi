'use client';

import { Loader2, Search, X } from 'lucide-react';
import { ArticleFormFields, Professional } from '@/types';
import { useProfessionalSearch } from '@/app/hooks/useProfessionalSearch';
import { useEffect, useRef } from 'react';

interface ArticleFormProps<T extends ArticleFormFields> {
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    onSubmit: (e: React.FormEvent) => void | Promise<void>;
    isSubmitting?: boolean;
    editingArticleId?: string | null;
    onCancelEdit?: () => void;
    professionals: Professional[];
}

export default function ArticleForm<T extends ArticleFormFields>({
    formData,
    setFormData,
    onSubmit,
    isSubmitting = false,
    editingArticleId = null,
    onCancelEdit,
    professionals,
}: ArticleFormProps<T>) {
    const initialQuery = editingArticleId ? (formData as ArticleFormFields).author : '';
    const search = useProfessionalSearch(professionals, { initialQuery });
    const isEditing = Boolean(editingArticleId);

    const patch = (partial: Partial<ArticleFormFields>) =>
        setFormData((prev) => ({ ...prev, ...partial }));

    // Reset del buscador cuando se resetea el form (cancelar / crear / editar exitoso)
    const DEFAULT_AUTHOR = 'Equipo Editorial Psicologos La Plata';
    const prevEditingId = useRef<string | null | undefined>(editingArticleId);
    useEffect(() => {
        const wasEditing = prevEditingId.current !== null && prevEditingId.current !== undefined;
        prevEditingId.current = editingArticleId;
        // Transición edición -> creación, o reset del form en creación
        if (wasEditing && !editingArticleId) search.onClearSearch();
        if (!editingArticleId && formData.author === DEFAULT_AUTHOR && formData.cover_url === '') {
            search.onClearSearch();
        }
    }, [editingArticleId, formData.author, formData.cover_url]);

    const handleSelectProfessional = (prof: Professional) => {
        search.onSelectSuggestion(prof);
        patch({
            cover_url: prof.photo_url,
            author: prof.name,
            author_role: prof.specialties.join(', '),
        });
    };

    const handleClearProfessional = () => {
        patch({
            cover_url: '',
            author: '',
            author_role: 'Psicología & Divulgación',
        });
        search.onClearSearch();
    };

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

                    <div className='relative'>
                        <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                            Profesional del artículo
                        </label>
                        <div className='relative'>
                            <Search className='w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400' />
                            <input
                                type='text'
                                value={search.searchQuery}
                                onChange={search.onSearchChange}
                                onKeyDown={search.onSearchKeyDown}
                                onFocus={search.onSearchFocus}
                                onBlur={search.onSearchBlur}
                                placeholder='Buscar por nombre o matrícula…'
                                className='w-full pl-8 pr-8 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                            />
                            {search.searchQuery && (
                                <button
                                    type='button'
                                    onClick={search.onClearSearch}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                    aria-label='Limpiar búsqueda'
                                >
                                    <X className='w-3 h-3' />
                                </button>
                            )}
                        </div>

                        {search.searchFocused && search.suggestions.length > 0 && (
                            <ul className='absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg'>
                                {search.suggestions.map((prof) => (
                                    <li key={prof.id}>
                                        <button
                                            type='button'
                                            onClick={() => handleSelectProfessional(prof)}
                                            className='w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        >
                                            <span className='font-semibold'>{prof.name}</span>
                                            {prof.license && (
                                                <span className='text-neutral-500'>
                                                    {' '}
                                                    — MP {prof.license}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {formData.cover_url && (
                            <div className='mt-2 flex items-center gap-2 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={formData.cover_url}
                                    alt={formData.author || 'Profesional seleccionado'}
                                    className='w-10 h-10 rounded-lg object-cover'
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs font-semibold truncate'>
                                        {formData.author || 'Profesional seleccionado'}
                                    </p>
                                    <p className='text-[10px] text-neutral-500 truncate'>
                                        {formData.excerpt}
                                    </p>
                                </div>
                                <button
                                    type='button'
                                    onClick={handleClearProfessional}
                                    className='p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                    aria-label='Quitar profesional'
                                >
                                    <X className='w-3.5 h-3.5' />
                                </button>
                            </div>
                        )}
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
