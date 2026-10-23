import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="mx-auto w-16 h-16 rounded-3xl bg-primary-400/20 text-neutral-900 dark:text-primary-300 flex items-center justify-center font-black text-2xl font-display">
        404
      </div>
      <h1 className="text-3xl font-extrabold font-display text-neutral-900 dark:text-neutral-50">
        Página no encontrada
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
        El perfil o contenido que estás buscando no existe o fue reubicado. Podés volver al inicio o explorar nuestro directorio de profesionales.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold text-xs hover:bg-neutral-800"
        >
          <Home className="w-4 h-4" />
          <span>Ir al Inicio</span>
        </Link>
        <Link
          href="/profesionales"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-400 text-neutral-950 font-bold text-xs hover:bg-primary-300"
        >
          <Compass className="w-4 h-4" />
          <span>Ver Profesionales</span>
        </Link>
      </div>
    </div>
  );
}
