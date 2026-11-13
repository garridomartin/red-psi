'use client';

import { GeocodeCandidate } from '@/types';
import CandidateButton from './CandidateButton';
import { useEffect } from 'react';

interface GeocodeModalProps {
    isOpen: boolean;
    address: string;
    candidates: GeocodeCandidate[];
    onSelect: (candidate: GeocodeCandidate) => void;
    onCancel: () => void;
    // opcionales
    title?: string;
    cancelLabel?: string;
}

export default function GeocodeModal({
    isOpen,
    address,
    candidates,
    onSelect,
    onCancel,
    title = 'Elegí la dirección correcta',
    cancelLabel = 'Cancelar',
}: GeocodeModalProps) {
    if (!isOpen) return null;

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onCancel]);

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm'>
            <div className='bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto'>
                <div className='flex items-start justify-between mb-4'>
                    <div>
                        <h3 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-50'>
                            {title}
                        </h3>
                        <p className='text-xs text-neutral-500 mt-1'>
                            Georef encontró varias coincidencias para <strong>{address}</strong>.
                            Seleccioná la que corresponda.
                        </p>
                    </div>
                    <button
                        type='button'
                        onClick={onCancel}
                        aria-label='Cerrar'
                        className='p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                    >
                        ✕
                    </button>
                </div>

                <div className='space-y-2'>
                    {candidates.length === 0 ? (
                        <p className='text-xs text-neutral-500 text-center py-6'>
                            No hay coincidencias para mostrar.
                        </p>
                    ) : (
                        candidates.map((c, idx) => (
                            <CandidateButton
                                key={`${c.lat}-${c.lng}-${idx}`}
                                candidate={c}
                                onSelect={onSelect}
                            />
                        ))
                    )}
                </div>

                <div className='mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2'>
                    <button
                        type='button'
                        onClick={onCancel}
                        className='py-2 px-4 text-xs font-bold rounded-xl text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
