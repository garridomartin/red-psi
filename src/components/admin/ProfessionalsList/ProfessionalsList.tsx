'use client';

import SearchBar from './SearchBar';
import ProfessionalsTable from './ProfessionalsTable';
import { Professional, ProfessionalListItem, ProfessionalSuggestion } from '@/types';
import { ProfessionalsSortBy, SortDir } from '@/lib/data/dataStore';
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from 'lucide-react';

interface ProfessionalsListProps {
    // Búsqueda
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSearchFocus: () => void;
    onSearchBlur: () => void;
    onClearSearch: () => void;
    searchFocused: boolean;
    suggestions: ProfessionalSuggestion[];
    onSelectSuggestion: (s: ProfessionalSuggestion) => void;

    // Ordenamiento (server-side)
    sortBy: ProfessionalsSortBy;
    sortDir: SortDir;
    sortLoading: boolean;
    onSortByHiredAt: () => void;
    onSortByStatus: () => void;

    // Filtro activo
    appliedFilter: string | null;

    // Datos
    professionals: Professional[];
    filteredProfessionals: Professional[];

    // Formato
    formatHiredAt: (date: string) => string;

    // Acciones por fila
    onToggleFeatured: (p: Professional) => void;
    onToggleActive: (p: Professional) => void;
    onEdit: (p: Professional) => void;
    onDelete: (id: string, name: string) => void;

    // Opcionales
    searchPlaceholder?: string;
    emptyText?: string;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active) return <ArrowUpDown className='w-3.5 h-3.5 opacity-50' />;
    return dir === 'asc' ? (
        <ArrowUp className='w-3.5 h-3.5' />
    ) : (
        <ArrowDown className='w-3.5 h-3.5' />
    );
}

export default function ProfessionalsList({
    searchQuery,
    onSearchChange,
    onSearchKeyDown,
    onSearchFocus,
    onSearchBlur,
    onClearSearch,
    searchFocused,
    suggestions,
    onSelectSuggestion,
    appliedFilter,
    professionals,
    filteredProfessionals,
    formatHiredAt,
    onToggleFeatured,
    onToggleActive,
    onEdit,
    onDelete,
    searchPlaceholder,
    emptyText,
    sortBy,
    sortDir,
    sortLoading,
    onSortByHiredAt,
    onSortByStatus,
}: ProfessionalsListProps) {
    return (
        <div className='space-y-4'>
            <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                onKeyDown={onSearchKeyDown}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
                onClear={onClearSearch}
                focused={searchFocused}
                suggestions={suggestions}
                onSelectSuggestion={onSelectSuggestion}
                placeholder={searchPlaceholder}
            />

            {appliedFilter && (
                <div className='flex items-center justify-between text-xs text-neutral-500'>
                    <span>
                        Filtrando por:{' '}
                        <strong className='text-neutral-900 dark:text-neutral-100'>
                            {appliedFilter}
                        </strong>{' '}
                        — {filteredProfessionals.length} de {professionals.length} profesionales
                    </span>
                    <button
                        type='button'
                        onClick={onClearSearch}
                        className='text-primary-600 hover:underline font-semibold'
                    >
                        Limpiar filtro
                    </button>
                </div>
            )}

            <ProfessionalsTable
                professionals={professionals}
                filteredProfessionals={filteredProfessionals}
                appliedFilter={appliedFilter}
                formatHiredAt={formatHiredAt}
                onToggleFeatured={onToggleFeatured}
                onToggleActive={onToggleActive}
                onEdit={onEdit}
                onDelete={onDelete}
                emptyText={emptyText}
                // === NUEVO: pasamos el estado y handlers de sort a la tabla ===
                sortBy={sortBy}
                sortDir={sortDir}
                sortLoading={sortLoading}
                onSortByHiredAt={onSortByHiredAt}
                onSortByStatus={onSortByStatus}
            />
        </div>
    );
}
