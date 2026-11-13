'use client';

import SearchBar from './SearchBar';
import ProfessionalsTable from './ProfessionalsTable';
import { Professional, ProfessionalListItem, ProfessionalSuggestion } from '@/types';

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
            />
        </div>
    );
}
