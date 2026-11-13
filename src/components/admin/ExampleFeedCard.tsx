'use client';

import { Plus } from 'lucide-react';
import type { Professional } from '@/types'; // ajustá el import al path real

interface Props {
    exampleNumber: 1 | 2;
    professional?: Professional | null;
    isAdmin: boolean;
    onOpenPicker: (val: 1 | 2) => void;
}

export default function ExampleFeedCard({
    exampleNumber,
    professional,
    isAdmin,
    onOpenPicker,
}: Props) {
    return (
        <div className='rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 space-y-3'>
            <div className='flex items-center gap-2'>
                <div className='w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 p-0.5'>
                    <div className='w-full h-full bg-neutral-900 rounded-full flex items-center justify-center text-[10px] font-bold'>
                        Ψ
                    </div>
                </div>
                <span className='text-xs font-bold'>psicologolaplata</span>
            </div>

            <div className='aspect-square rounded-xl bg-neutral-800/80 overflow-hidden relative'>
                {professional?.photo_url ? (
                    <img
                        src={professional.photo_url}
                        alt='Tarjeta Instagram'
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div className='w-full h-full bg-neutral-800/80' />
                )}

                {/* Overlay con nombre (solo si hay profesional) */}
                {professional && (
                    <div className='absolute inset-0 bg-neutral-950/40 p-2.5 flex flex-col justify-end pointer-events-none'>
                        <p className='text-[11px] font-bold leading-tight'>
                            {professional.name}
                        </p>
                    </div>
                )}

                {/* Overlay admin: reemplaza la card siempre */}
                {isAdmin && (
                    <button
                        type='button'
                        onClick={() => onOpenPicker(exampleNumber)}
                        className='absolute inset-0 z-10 flex items-center justify-center bg-neutral-950/30 backdrop-blur-[2px] hover:bg-neutral-950/50 transition-colors group'
                        aria-label={`Cambiar Ejemplo ${exampleNumber}`}
                        title={`Cambiar Ejemplo ${exampleNumber}`}
                    >
                        <Plus
                            size={48}
                            strokeWidth={1.5}
                            className='text-white/70 group-hover:text-white transition-colors'
                        />
                    </button>
                )}
            </div>
        </div>
    );
}