'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getArticleBySlug, getArticles } from '@/lib/data/dataStore';
import { Article } from '@/types';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, User, Compass } from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null | undefined>(undefined);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = getArticleBySlug(slug);
      setArticle(found || null);

      const all = getArticles().filter((a) => a.slug !== slug && a.is_published);
      setRecentArticles(all.slice(0, 3));
    }
  }, [slug]);

  if (article === null) {
    notFound();
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-neutral-500">
        Cargando artículo...
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/articulos"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a todos los artículos</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? '¡Link copiado!' : 'Compartir'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400">
            <BookOpen className="w-3.5 h-3.5" />
            Psicoeducación
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.reading_time_minutes} min de lectura
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.2]">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
          {article.excerpt}
        </p>

        {/* Author metadata */}
        <div className="pt-4 flex items-center gap-3 border-t border-neutral-200 dark:border-neutral-800">
          <div className="w-10 h-10 rounded-full bg-primary-400/20 text-neutral-950 dark:text-primary-300 font-bold flex items-center justify-center">
            {article.author.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{article.author}</p>
            <p className="text-[11px] text-neutral-500">{article.author_role || 'Profesional de Salud Mental'}</p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg">
        <img
          src={article.cover_url}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-sm sm:text-base leading-relaxed space-y-4">
        {article.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('###')) {
            return (
              <h3 key={index} className="text-xl font-bold font-display text-neutral-900 dark:text-neutral-50 pt-4">
                {paragraph.replace('###', '').trim()}
              </h3>
            );
          }
          return <p key={index}>{paragraph.trim()}</p>;
        })}
      </div>

      {/* CTA Box: Find psychologist */}
      <div className="p-8 rounded-3xl bg-primary-50 dark:bg-neutral-900 border border-primary-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold font-display text-neutral-900 dark:text-neutral-100">
            ¿Buscás iniciar terapia con profesionales especializados?
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Explorá los perfiles y consultorios más cercanos a tu ubicación.
          </p>
        </div>
        <Link
          href="/profesionales"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-400 hover:bg-primary-300 text-neutral-950 font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Ver Directorio</span>
        </Link>
      </div>

      {/* Related articles */}
      {recentArticles.length > 0 && (
        <div className="pt-10 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
          <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-neutral-50">
            Otros artículos que te pueden interesar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentArticles.map((ra) => (
              <Link
                key={ra.id}
                href={`/articulos/${ra.slug}`}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-primary-400 transition-colors space-y-2 group"
              >
                <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-primary-500 line-clamp-2">
                  {ra.title}
                </h4>
                <p className="text-[11px] text-neutral-500 line-clamp-2">{ra.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
