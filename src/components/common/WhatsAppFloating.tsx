'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloating: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const agencyWhatsAppNumber = '5491145678901';
  const defaultText = encodeURIComponent(
    'Hola Psicologos La Plata, quisiera asesoramiento para encontrar el psicólogo ideal para mí.'
  );

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      <a
        href={`https://wa.me/${agencyWhatsAppNumber}?text=${defaultText}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Contactar a la agencia por WhatsApp"
        className="group w-13 h-13 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center relative"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </a>

      {showTooltip && (
        <div className="hidden sm:block bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold py-2 px-3.5 rounded-2xl shadow-xl animate-in fade-in slide-in-from-left-2">
          ¿Dudas sobre con quién empezar? Escribinos por WhatsApp
        </div>
      )}
    </div>
  );
};
