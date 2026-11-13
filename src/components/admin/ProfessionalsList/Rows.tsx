'use client';

import { Professional, ProfessionalListItem } from '@/types';
import { Star, Edit3, Trash2 } from 'lucide-react';

interface ProfessionalRowProps {
    professional: Professional;
    formatHiredAt: (date: string) => string;
    onToggleFeatured: (p: Professional) => void;
    onToggleActive: (p: Professional) => void;
    onEdit: (p: Professional) => void;
    onDelete: (id: string, name: string) => void;
}

export default function ProfessionalRow({
    professional: p,
    formatHiredAt,
    onToggleFeatured,
    onToggleActive,
    onEdit,
    onDelete,
}: ProfessionalRowProps) {
    return (
        <tr className='hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors'>
            <td className='p-4'>
                <div className='flex items-center gap-3'>
                    <img
                        src={p.photo_url}
                        alt={p.name}
                        className='w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-neutral-200 dark:ring-neutral-700'
                    />
                    <div>
                        <p className='font-bold text-neutral-900 dark:text-neutral-100'>{p.name}</p>
                        <p className='text-[11px] text-neutral-500'>
                            M.N. {p.license} • {p.age} años
                        </p>
                    </div>
                </div>
            </td>
            <td className='p-4 text-neutral-600 dark:text-neutral-300 max-w-[200px] truncate'>
                {p.specialties.join(', ')}
            </td>
            <td className='p-4 capitalize'>
                <span className='px-2 py-0.5 rounded-md font-medium text-[11px] bg-neutral-100 dark:bg-neutral-800'>
                    {p.modality}
                </span>
            </td>
            <td className='p-4 text-neutral-600 dark:text-neutral-300'>
                {p.neighborhood || p.city}
            </td>
            <td className='p-4 text-center'>
                <button
                    onClick={() => onToggleFeatured(p)}
                    className={`p-1.5 rounded-lg transition-colors ${
                        p.is_featured
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'text-neutral-300 hover:text-neutral-500'
                    }`}
                    title='Alternar destacado'
                >
                    <Star className={`w-4 h-4 ${p.is_featured ? 'fill-amber-400' : ''}`} />
                </button>
            </td>
            <td className='p-4 text-center text-neutral-600 dark:text-neutral-300'>
                {formatHiredAt(p.hired_at)}
            </td>
            <td className='p-4 text-center'>
                <button
                    onClick={() => onToggleActive(p)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                        p.is_active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                >
                    {p.is_active ? 'Activo' : 'Oculto'}
                </button>
            </td>
            <td className='p-4 text-right space-x-1'>
                <button
                    onClick={() => onEdit(p)}
                    className='p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    title='Editar'
                >
                    <Edit3 className='w-4 h-4' />
                </button>
                <button
                    onClick={() => onDelete(p.id, p.name)}
                    className='p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                    title='Eliminar'
                >
                    <Trash2 className='w-4 h-4' />
                </button>
            </td>
        </tr>
    );
}
