'use client';

import { Professional, ProfessionalListItem } from '@/types';
import ProfessionalRow from './Rows';
import { ProfessionalsSortBy, SortDir } from '@/lib/data/dataStore';
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from 'lucide-react';

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
    sortBy: ProfessionalsSortBy;
    sortDir: SortDir;
    sortLoading: boolean;
    onSortByHiredAt: () => void;
    onSortByStatus: () => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active) return <ArrowUpDown className='w-3.5 h-3.5 opacity-50' />;
    return dir === 'asc' ? (
        <ArrowUp className='w-3.5 h-3.5' />
    ) : (
        <ArrowDown className='w-3.5 h-3.5' />
    );
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
    sortBy,
    sortDir,
    sortLoading,
    onSortByHiredAt,
    onSortByStatus,
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

                            {/* === FECHA DE ALTA como botón (con flechitas) === */}
                            <th className='p-4 text-center'>
                                <button
                                    type='button'
                                    onClick={onSortByHiredAt}
                                    disabled={sortLoading}
                                    aria-sort={
                                        sortBy === 'hired_at'
                                            ? sortDir === 'asc'
                                                ? 'ascending'
                                                : 'descending'
                                            : 'none'
                                    }
                                    className='inline-flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-60 transition-colors'
                                >
                                    {sortLoading && sortBy === 'hired_at' ? (
                                        <Loader2 className='w-3.5 h-3.5 animate-spin' />
                                    ) : (
                                        <SortIcon active={sortBy === 'hired_at'} dir={sortDir} />
                                    )}
                                    Fecha de alta
                                </button>
                            </th>

                            {/* === ESTADO como botón (sin flechita) === */}
                            <th className='p-4 text-center'>
                                <button
                                    type='button'
                                    onClick={onSortByStatus}
                                    disabled={sortLoading}
                                    aria-sort={
                                        sortBy === 'is_active'
                                            ? sortDir === 'asc'
                                                ? 'ascending'
                                                : 'descending'
                                            : 'none'
                                    }
                                    className='inline-flex items-center justify-center text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 disabled:opacity-60 transition-colors'
                                >
                                    {sortLoading && sortBy === 'is_active' ? (
                                        <Loader2 className='w-3.5 h-3.5 animate-spin mr-1.5' />
                                    ) : null}
                                    Estado
                                </button>
                            </th>

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
