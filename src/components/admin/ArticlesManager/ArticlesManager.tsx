'use client';

import type { Article } from '@/types';
import ArticleForm from './ArticleForm';
import ArticleCard from './ArticleCard';
import type { ArticleFormData } from './types';

interface ArticlesManagerProps {
  articleFormData: ArticleFormData;
  setArticleFormData: React.Dispatch<React.SetStateAction<ArticleFormData>>;
  onSubmitArticle: (e: React.FormEvent) => void | Promise<void>;

  articles: Article[];
  onDeleteArticle: (id: string, title: string) => void;

  // opcionales
  isSubmittingArticle?: boolean;
  deletingArticleId?: string | null;
  emptyStateText?: string;
}

export default function ArticlesManager({
  articleFormData,
  setArticleFormData,
  onSubmitArticle,
  articles,
  onDeleteArticle,
  isSubmittingArticle = false,
  deletingArticleId = null,
  emptyStateText = 'Todavía no hay artículos publicados.',
}: ArticlesManagerProps) {
  return (
    <div className='space-y-6'>
      <ArticleForm
        formData={articleFormData}
        setFormData={setArticleFormData}
        onSubmit={onSubmitArticle}
        isSubmitting={isSubmittingArticle}
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
              onDelete={onDeleteArticle}
              isDeleting={deletingArticleId === art.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}