'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getProfessionals } from '@/lib/data/dataStore';
import { Professional } from '@/types';
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard';
import { Heart, Compass, LogIn, ArrowRight, Sparkles } from 'lucide-react';

export default function FavoritesPage() {
  const { user, favorites, loginWithGoogle } = useAuth();
  const [favoriteProfessionals, setFavoriteProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    if (favorites.length > 0) {
      const all = getProfessionals();
      setFavoriteProfessionals(all.filter((p) => favorites.includes(p.id)));
    } else {
      setFavoriteProfessionals([]);
    }
  }, [favorites]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
          <Heart className="w-8 h-8 fill-rose-500" />
        </div>
        <h1 className="text-3xl font-extrabold font-display text-neutral-900 dark:text-neutral-50">
          Mis Profesionales Favoritos
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          Iniciá sesión con tu cuenta de Google (Gmail) para guardar y acceder a tu lista personal de psicólogos en cualquier dispositivo.
        </p>
        <button
          onClick={() => loginWithGoogle()}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Iniciar sesión con Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Lista personal de {user.name}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-neutral-50">
            Mis Favoritos ({favoriteProfessionals.length})
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Los profesionales que guardaste para consultar o comparar.
          </p>
        </div>

        <Link
          href="/profesionales"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700"
        >
          <Compass className="w-4 h-4" />
          <span>Seguir explorando el directorio</span>
        </Link>
      </div>

      {favoriteProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProfessionals.map((prof) => (
            <ProfessionalCard key={prof.id} professional={prof} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-12 text-center border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Todavía no guardaste ningún profesional
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Hacé clic en la estrella de cualquier tarjeta de psicólogo para tenerlo siempre a mano acá.
          </p>
          <Link
            href="/profesionales"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-400 text-neutral-950 font-bold text-xs hover:bg-primary-300"
          >
            <span>Ver profesionales</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
