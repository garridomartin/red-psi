'use client';

import { MatriculaStatus, Professional, ProfFormData } from '@/types';
import React, { useRef } from 'react';
import { toast } from 'sonner';

interface Props {
    profFormData: ProfFormData;
    setProfFormData: React.Dispatch<React.SetStateAction<ProfFormData>>;
    matriculaDebounceRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
    setMatriculaStatus: React.Dispatch<React.SetStateAction<MatriculaStatus>>;
}

export const LicenseCheck = ({
    profFormData,
    setProfFormData,
    matriculaDebounceRef,
    setMatriculaStatus,
}: Props) => {
    // Flag: el usuario tocó el campo "name" manualmente → no autocompletar más
    const nameTouchedRef = useRef(false);
    // AbortController del fetch en vuelo (evita race conditions)
    const abortRef = useRef<AbortController | null>(null);

    const buscarMatricula = (matricula: string) => {
        if (matriculaDebounceRef.current) {
            clearTimeout(matriculaDebounceRef.current);
            matriculaDebounceRef.current = null;
        }

        // Cancelar fetch en vuelo
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }

        const limpia = matricula.replace(/\D/g, '');

        if (limpia.length < 3) {
            setMatriculaStatus({ checking: false, found: null, nombreSugerido: null });
            return;
        }

        setMatriculaStatus({ checking: true, found: null, nombreSugerido: null });

        matriculaDebounceRef.current = setTimeout(async () => {
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const res = await fetch(
                    `/api/matriculas/buscar?matricula=${encodeURIComponent(limpia)}`,
                    { signal: controller.signal },
                );

                const data = await res.json();

                if (data.found) {
                    setMatriculaStatus({
                        checking: false,
                        found: true,
                        nombreSugerido: data.nombre,
                    });
                    // Autocompletar solo si el usuario nunca tocó "name"
                    if (!nameTouchedRef.current) {
                        setProfFormData((prev) => ({
                            ...prev,
                            name: data.nombre,
                        }));
                    }
                } else {
                    setMatriculaStatus({
                        checking: false,
                        found: false,
                        nombreSugerido: null,
                    });
                }
            } catch (err) {
                // AbortError es esperable, no toastear
                if ((err as Error)?.name === 'AbortError') return;

                console.error('🔴 [buscarMatricula] Error en fetch:', err);
                setMatriculaStatus({ checking: false, found: null, nombreSugerido: null });
                toast.error('No se pudo verificar la matrícula.', {
                    description: 'Revisá tu conexión o intentá de nuevo en unos segundos.',
                    duration: 6000,
                });
            } finally {
                if (abortRef.current === controller) abortRef.current = null;
            }
        }, 500);
    };

    const handleClear = () => {
        if (matriculaDebounceRef.current) {
            clearTimeout(matriculaDebounceRef.current);
            matriculaDebounceRef.current = null;
        }
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
        nameTouchedRef.current = false; // reseteo el flag al limpiar
        setProfFormData((prev) => ({
            ...prev,
            license: '',
            name: '',
        }));
        setMatriculaStatus({ checking: false, found: null, nombreSugerido: null });
    };

    return (
        <div className='relative'>
            <input
                type='text'
                required
                value={profFormData.license}
                onChange={(e) => {
                    const value = e.target.value;
                    setProfFormData((prev) => ({ ...prev, license: value }));
                    buscarMatricula(value);
                }}
                placeholder='Ej: 48912'
                className='w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
            />
            {profFormData.license && (
                <button
                    type='button'
                    onClick={handleClear}
                    className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
                    title='Limpiar matrícula y nombre'
                >
                    <svg
                        className='w-3.5 h-3.5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2.5}
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};
