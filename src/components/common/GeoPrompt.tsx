'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, X, Compass, CheckCircle2 } from 'lucide-react';
import { requestBrowserLocation } from '@/lib/geo';
import { UserLocation } from '@/types';

interface GeoPromptProps {
  onLocationObtained?: (location: UserLocation) => void;
}

const GEO_DECISION_KEY = 'red_epsilon_geo_prompt_dismissed_v1';
const SAVED_LOCATION_KEY = 'red_epsilon_user_location_v1';

export const GeoPrompt: React.FC<GeoPromptProps> = ({ onLocationObtained }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(GEO_DECISION_KEY);
      const savedLocation = localStorage.getItem(SAVED_LOCATION_KEY);

      if (!dismissed && !savedLocation) {
        // Show after a gentle 1.5s delay so page finishes loading
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      } else if (savedLocation && onLocationObtained) {
        try {
          const loc = JSON.parse(savedLocation);
          onLocationObtained(loc);
        } catch {}
      }
    }
  }, [onLocationObtained]);

  const handleAllow = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const loc = await requestBrowserLocation();
      localStorage.setItem(SAVED_LOCATION_KEY, JSON.stringify(loc));
      localStorage.setItem(GEO_DECISION_KEY, 'allowed');
      setIsSuccess(true);
      if (onLocationObtained) {
        onLocationObtained(loc);
      }
      setTimeout(() => {
        setIsOpen(false);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudo obtener la ubicación.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = (forever: boolean = false) => {
    if (forever) {
      localStorage.setItem(GEO_DECISION_KEY, 'dismissed_forever');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full mx-auto p-1 animate-in slide-in-from-bottom-5 fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 relative">
        <button
          onClick={() => handleDismiss(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Cerrar aviso de ubicación"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-primary-400/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              ¿Descubrir psicólogos cerca de vos?
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              Activá tu ubicación aproximada para ordenar los profesionales por distancia a tu barrio o consultorio más cercano.
            </p>
          </div>
        </div>

        {errorMsg && (
          <p className="mt-3 text-xs text-red-500 font-medium bg-red-50 dark:bg-red-950/40 p-2 rounded-xl">
            {errorMsg}
          </p>
        )}

        {isSuccess ? (
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>¡Ubicación configurada con éxito!</span>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 pt-1">
            <button
              onClick={handleAllow}
              disabled={isLoading}
              className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950 shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Ubicando...' : 'Activar ubicación'}</span>
            </button>
            <button
              onClick={() => handleDismiss(true)}
              className="py-2 px-3 text-xs font-semibold rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Ahora no
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
