'use client';

import { ProfessionalSuggestion } from '@/types';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    onClear: () => void;

    focused: boolean;
    suggestions: ProfessionalSuggestion[];
    onSelectSuggestion: (suggestion: ProfessionalSuggestion) => void;

    placeholder?: string;
}

export default function SearchBar({
    value,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    onClear,
    focused,
    suggestions,
    onSelectSuggestion,
    placeholder = 'Buscar por nombre o matrícula... (mín. 3 caracteres)',
}: SearchBarProps) {
    return (
        <div className='relative'>
            <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none' />
                <input
                    type='text'
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className='w-full pl-10 pr-10 py-3 text-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400'
                />
                {value && (
                    <button
                        type='button'
                        onClick={onClear}
                        className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        title='Limpiar búsqueda'
                    >
                        <X className='w-4 h-4' />
                    </button>
                )}
            </div>

            {focused && suggestions.length > 0 && (
                <div className='absolute z-20 left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden'>
                    {suggestions.map((p) => (
                        <button
                            key={p.id}
                            type='button'
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => onSelectSuggestion(p)}
                            className='w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'
                        >
                            <img
                                src={p.photo_url}
                                alt={p.name}
                                className='w-8 h-8 rounded-lg object-cover shrink-0'
                            />
                            <div className='min-w-0 flex-1'>
                                <p className='text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate'>
                                    {p.name}
                                </p>
                                <p className='text-[11px] text-neutral-500 truncate'>
                                    {p.license || 'Sin matrícula'} • {p.neighborhood || p.city}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
