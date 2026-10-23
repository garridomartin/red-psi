'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="mx-auto w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold font-display text-neutral-900 dark:text-neutral-50">
        Ocurrió un error inesperado
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
        Disculpas por las molestias. Ya registramos el inconveniente para solucionarlo a la brevedad.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-400 text-neutral-950 font-bold text-xs hover:bg-primary-300"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Intentar nuevamente</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold text-xs hover:bg-neutral-800"
        >
          <Home className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </div>
  );
}
