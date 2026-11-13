'use client';

import { GeocodeCandidate } from '@/types';

interface CandidateButtonProps {
    candidate: GeocodeCandidate;
    onSelect: (candidate: GeocodeCandidate) => void;
}

export default function CandidateButton({ candidate, onSelect }: CandidateButtonProps) {
    const localidad = candidate.localidad || candidate.localidadCensal || 'Sin localidad';
    const partido = candidate.departamento || 'Sin partido';
    const provincia = candidate.provincia || '';

    const parts = [
        candidate.localidad || candidate.localidadCensal || 'Sin localidad',
        candidate.departamento || 'Sin partido',
        candidate.provincia,
    ].filter(Boolean);

    return (
        <button
            type='button'
            onClick={() => onSelect(candidate)}
            className='w-full text-left p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-colors'
        >
            <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
                {candidate.label}
            </p>
            <p className='text-[11px] text-neutral-500 mt-0.5'>📍 {parts.join(' • ')}</p>
            <p className='text-[10px] text-neutral-400 font-mono mt-1'>
                {candidate.lat.toFixed(5)}, {candidate.lng.toFixed(5)}
            </p>
        </button>
    );
}
