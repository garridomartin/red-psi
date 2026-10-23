'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FavoriteStarProps {
  professionalId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onRequireLogin?: () => void;
}

export const FavoriteStar: React.FC<FavoriteStarProps> = ({
  professionalId,
  size = 'md',
  className = '',
  onRequireLogin,
}) => {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const favorited = isFavorite(professionalId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (onRequireLogin) {
        onRequireLogin();
      } else {
        alert('Iniciá sesión con tu cuenta de Google para guardar tus psicólogos favoritos.');
      }
      return;
    }

    toggleFavorite(professionalId);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      title={user ? (favorited ? 'Quitar de favoritos' : 'Guardar en favoritos') : 'Iniciá sesión para guardar favoritos'}
      className={`p-2 rounded-full transition-transform active:scale-90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-sm border border-neutral-200/60 dark:border-neutral-800 ${className}`}
    >
      <Star
        className={`${sizeClasses} transition-colors ${
          favorited
            ? 'fill-amber-400 text-amber-400'
            : 'text-neutral-400 hover:text-amber-400 dark:text-neutral-500'
        }`}
      />
    </button>
  );
};
