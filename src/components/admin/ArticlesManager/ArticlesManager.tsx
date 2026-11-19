'use client';

import type { Article, ArticleFormFields, Professional } from '@/types';
import ArticleForm from './ArticleForm';
import ArticleCard from './ArticleCard';
import { notifyError, notifySuccess } from '@/lib/utils/toast';
import { useEffect, useState } from 'react';
import { articleSchema } from '@/lib/validations';
import {
    addArticle,
    deleteArticle,
    getArticles,
    getProfessionalsForAdmin,
    updateArticle,
} from '@/lib/data/dataStore';
import { toast } from 'sonner';

interface ArticlesManagerProps<T extends ArticleFormFields> {
    isSubmittingArticle?: boolean;
    deletingArticleId?: string | null;
    emptyStateText?: string;
    professionals: Professional[];
    articles: Article[];
    onRefresh: () => Promise<void> | void;
    onArticlesChange?: (articles: Article[]) => void;
}

export default function ArticlesManager<T extends ArticleFormFields>({
    isSubmittingArticle = false,
    deletingArticleId = null,
    emptyStateText = 'Todavía no hay artículos publicados.',
    professionals,
    articles,
    onRefresh,
    onArticlesChange,
}: ArticlesManagerProps<T>) {
    const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

    // Form State for Article
    const [articleFormData, setArticleFormData] = useState({
        title: '',
        slug: '',
        cover_url:
            'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
        excerpt: '',
        content: '',
        author: 'Equipo Editorial Psicologos La Plata',
        author_role: 'Psicología & Divulgación',
        reading_time_minutes: 5,
        tags: ['Salud Mental', 'Terapia'],
        is_published: true,
    });

    const handleEditArticle = (article: Article) => {
        setEditingArticleId(article.id);
        setArticleFormData({
            title: article.title,
            slug: article.slug,
            cover_url: article.cover_url,
            excerpt: article.excerpt,
            content: article.content,
            author: article.author,
            author_role: article.author_role ?? 'Psicología & Divulgación',
            reading_time_minutes: article.reading_time_minutes,
            tags: article.tags,
            is_published: article.is_published,
        });
        // scroll al form (opcional pero recomendado)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateArticle = async (e: React.FormEvent) => {
        e.preventDefault();

        const slug = articleFormData.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const validated = articleSchema.safeParse(articleFormData);
        if (!validated.success) {
            notifyError(validated.error.issues[0]?.message || 'Verificá los datos');
            return;
        }

        try {
            if (editingArticleId) {
                // MODO EDICIÓN
                await updateArticle(editingArticleId, { ...articleFormData, slug });
                notifySuccess('Artículo actualizado con éxito.');
                setEditingArticleId(null);
            } else {
                // MODO CREACIÓN
                await addArticle({ ...articleFormData, slug });
                notifySuccess('Artículo creado con éxito.');
            }

            // Limpiar formulario
            setArticleFormData({
                title: '',
                slug: '',
                cover_url:
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
                excerpt: '',
                content: '',
                author: 'Equipo Editorial Psicologos La Plata',
                author_role: 'Psicología & Divulgación',
                reading_time_minutes: 5,
                tags: ['Salud Mental', 'Terapia'],
                is_published: true,
            });

            await onRefresh();
        } catch (err: any) {
            notifyError(`Error al guardar: ${err.message}`);
        }
    };

    const handleDeleteArticle = (id: string, title: string) => {
        toast(`¿Eliminar artículo "${title}"?`, {
            description: 'Esta acción no se puede deshacer.',
            duration: Infinity,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    const t = toast.loading('Eliminando artículo…');
                    try {
                        await deleteArticle(id);
                        await onRefresh();
                        toast.success('Artículo eliminado.', { id: t });
                    } catch (err: any) {
                        console.error('Error eliminando artículo:', err);
                        toast.error('No se pudo eliminar el artículo.', {
                            id: t,
                            description: err?.message ?? 'Intentá de nuevo en unos segundos.',
                            duration: 8000,
                        });
                    }
                },
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => toast.dismiss(),
            },
        });
    };

    const resetArticleForm = () => {
        setEditingArticleId(null);
        setArticleFormData({
            title: '',
            slug: '',
            cover_url:
                'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
            excerpt: '',
            content: '',
            author: 'Equipo Editorial Psicologos La Plata',
            author_role: 'Psicología & Divulgación',
            reading_time_minutes: 5,
            tags: ['Salud Mental', 'Terapia'],
            is_published: true,
        });
    };

    useEffect(() => {
        // Limpiar formularios AL MONTAR (garantiza que arranquen vacíos)
        resetArticleForm();
        onRefresh();
        const handleSync = () => onRefresh();
        window.addEventListener('red_epsilon_data_changed', handleSync);
        return () => {
            window.removeEventListener('red_epsilon_data_changed', handleSync);
        };
    }, []);

    return (
        <div className='space-y-6'>
            <ArticleForm
                formData={articleFormData}
                setFormData={setArticleFormData}
                onSubmit={handleCreateArticle}
                isSubmitting={isSubmittingArticle}
                editingArticleId={editingArticleId}
                onCancelEdit={resetArticleForm}
                professionals={professionals}
            />

            {articles.length === 0 ? (
                <div className='bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 text-center'>
                    <p className='text-xs text-neutral-500'>{emptyStateText}</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {articles.map((art) => (
                        <ArticleCard
                            key={art.id}
                            article={art}
                            onDelete={handleDeleteArticle}
                            onEdit={handleEditArticle}
                            isDeleting={deletingArticleId === art.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
