'use client';

import { Professional, ProfessionalListItem } from '@/types';
import ProfessionalRow from './Rows';

interface ProfessionalsTableProps {
    professionals: Professional[];
    filteredProfessionals: Professional[];
    appliedFilter: string | null;
    formatHiredAt: (date: string) => string;
    onToggleFeatured: (p: Professional) => void;
    onToggleActive: (p: Professional) => void;
    onEdit: (p: Professional) => void;
    onDelete: (id: string, name: string) => void;
    emptyText?: string;
}

export default function ProfessionalsTable({
    professionals: _professionals, // no se usa en el render, solo para tipado — lo dejo por claridad
    filteredProfessionals,
    appliedFilter,
    formatHiredAt,
    onToggleFeatured,
    onToggleActive,
    onEdit,
    onDelete,
    emptyText,
}: ProfessionalsTableProps) {
    return (
        <div className='bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-card overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse text-xs'>
                    <thead>
                        <tr className='border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-500 uppercase tracking-wider font-semibold'>
                            <th className='p-4'>Profesional</th>
                            <th className='p-4'>Enfoque</th>
                            <th className='p-4'>Modalidad</th>
                            <th className='p-4'>Ubicación</th>
                            <th className='p-4 text-center'>Destacado</th>
                            <th className='p-4 text-center'>Fecha de alta</th>
                            <th className='p-4 text-center'>Estado</th>
                            <th className='p-4 text-right'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-neutral-100 dark:divide-neutral-800'>
                        {filteredProfessionals.length === 0 ? (
                            <tr>
                                <td colSpan={8} className='p-8 text-center text-neutral-500'>
                                    {appliedFilter
                                        ? `No se encontraron profesionales que coincidan con "${appliedFilter}".`
                                        : emptyText || 'No hay profesionales cargados.'}
                                </td>
                            </tr>
                        ) : (
                            filteredProfessionals.map((p) => (
                                <ProfessionalRow
                                    key={p.id}
                                    professional={p}
                                    formatHiredAt={formatHiredAt}
                                    onToggleFeatured={onToggleFeatured}
                                    onToggleActive={onToggleActive}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
