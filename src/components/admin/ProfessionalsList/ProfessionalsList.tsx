'use client';

import SearchBar from './SearchBar';
import ProfessionalsTable from './ProfessionalsTable';
import { Professional, ProfessionalSuggestion } from '@/types';
import { ProfessionalsSortBy, SortDir } from '@/lib/data/dataStore';

import { useProfessionalSearch } from '@/app/hooks/useProfessionalSearch';

interface ProfessionalsListProps {
    // Datos
    professionals: Professional[];

    // Formato
    formatHiredAt: (iso: string | null | undefined, fallback?: string) => string;

    // Acciones por fila
    onToggleFeatured: (p: Professional) => void;
    onToggleActive: (p: Professional) => void;
    onEdit: (p: Professional) => void;
    onDelete: (id: string, name: string) => void;

    // Ordenamiento (server-side)
    sortBy: ProfessionalsSortBy;
    sortDir: SortDir;
    sortLoading: boolean;
    onSortByHiredAt: () => void;
    onSortByStatus: () => void;

    // Opcionales
    searchPlaceholder?: string;
    emptyText?: string;
}

export default function ProfessionalsList({
    professionals,
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
    const {
        searchQuery,
        searchFocused,
        appliedFilter,
        filteredProfessionals,
        suggestions,
        onSearchChange,
        onSearchKeyDown,
        onSelectSuggestion,
        onClearSearch,
        onSearchFocus,
        onSearchBlur,
    } = useProfessionalSearch(professionals);

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
                sortBy={sortBy}
                sortDir={sortDir}
                sortLoading={sortLoading}
                onSortByHiredAt={onSortByHiredAt}
                onSortByStatus={onSortByStatus}
            />
        </div>
    );
}
