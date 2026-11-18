// hooks/useProfessionalSearch.ts
import React from 'react';
import { Professional } from '@/types';
import { normalizeText as normalize } from '@/lib/utils/strings';

export function useProfessionalSearch(professionals: Professional[]) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchFocused, setSearchFocused] = React.useState(false);
    const [appliedFilter, setAppliedFilter] = React.useState<string | null>(null);

    const filteredProfessionals = React.useMemo(() => {
        if (!appliedFilter) return professionals;
        const q = normalize(appliedFilter.trim());
        return professionals.filter(
            (p) => normalize(p.name).includes(q) || (p.license && normalize(p.license).includes(q)),
        );
    }, [professionals, appliedFilter]);

    const suggestions = React.useMemo(() => {
        const q = normalize(searchQuery.trim());
        if (q.length < 3) return [];
        return professionals
            .filter(
                (p) =>
                    normalize(p.name).includes(q) ||
                    (p.license && normalize(p.license).includes(q)),
            )
            .slice(0, 8);
    }, [professionals, searchQuery]);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim() === '') setAppliedFilter(null);
    };

    const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const q = searchQuery.trim();
            setAppliedFilter(q.length === 0 ? null : q);
            setSearchFocused(false);
        }
        if (e.key === 'Escape') setSearchFocused(false);
    };

    const onSelectSuggestion = (prof: Professional) => {
        setSearchQuery(prof.name);
        setAppliedFilter(prof.name);
        setSearchFocused(false);
    };

    const onClearSearch = () => {
        setSearchQuery('');
        setAppliedFilter(null);
        setSearchFocused(false);
    };

    const onSearchFocus = () => setSearchFocused(true);

    const onSearchBlur = () => {
        setTimeout(() => setSearchFocused(false), 150);
    };

    return {
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
    };
}
