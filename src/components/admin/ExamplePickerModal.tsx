'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Professional } from '@/types';

interface Props {
    open: boolean;
    slot: 1 | 2;
    professionals: Professional[];
    saving: boolean;
    onClose: () => void;
    onSelect: (prof: Professional, val: 1 | 2) => void;
}

export default function ExamplePickerModal({
    open,
    slot,
    professionals,
    saving,
    onClose,
    onSelect,
}: Props) {
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset al abrir
    useEffect(() => {
        if (open) {
            setQuery('');
            setFocused(false);
            // focus luego del mount
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Cerrar con Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    // Base: activos, excluyendo los ya tomados en el otro slot
    const base = useMemo(() => {
        return professionals
            .filter((p) => p.is_active)
            .filter((p) => p.example === null || p.example === slot);
    }, [professionals, slot]);

    // Sugerencias mientras escribe (para el dropdown)
    const suggestions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return base
            .filter((p) => p.name.toLowerCase().includes(q))
            .slice(0, 6);
    }, [base, query]);

    // Lista mostrada en el grid: si hay query, filtramos; si no, todos
    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return base;
        return base.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.license || '').toLowerCase().includes(q) ||
                (p.neighborhood || '').toLowerCase().includes(q) ||
                (p.city || '').toLowerCase().includes(q),
        );
    }, [base, query]);

    if (!open) return null;

    return (
        <div
            className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4'
            onClick={onClose}
        >
            <div
                className='bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className='flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800'>
                    <h3 className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
                        Seleccionar Ejemplo {slot}
                    </h3>
                    <button
                        type='button'
                        onClick={onClose}
                        className='w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors'
                        aria-label='Cerrar'
                    >
                        <X size={18} />
                    </button>
                </header>

                {/* Buscador */}
                <div className='p-3 border-b border-neutral-200 dark:border-neutral-800 relative'>
                    <div className='flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2'>
                        <Search size={14} className='text-neutral-400 shrink-0' />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setTimeout(() => setFocused(false), 150)}
                            placeholder='Buscar profesional por nombre...'
                            className='flex-1 bg-transparent text-xs outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400'
                        />
                        {query && (
                            <button
                                type='button'
                                onClick={() => setQuery('')}
                                className='text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                                aria-label='Limpiar'
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>

                    {/* Dropdown de sugerencias */}
                    {focused && suggestions.length > 0 && (
                        <div className='absolute z-20 left-3 right-3 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden'>
                            {suggestions.map((p) => (
                                <button
                                    key={p.id}
                                    type='button'
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        setQuery(p.name);
                                        setFocused(false);
                                    }}
                                    className='w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'
                                >
                                    {p.photo_url && (
                                        <img
                                            src={p.photo_url}
                                            alt={p.name}
                                            className='w-8 h-8 rounded-lg object-cover shrink-0'
                                        />
                                    )}
                                    <div className='min-w-0 flex-1'>
                                        <p className='text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate'>
                                            {p.name}
                                        </p>
                                        <p className='text-[11px] text-neutral-500 truncate'>
                                            {p.license || 'Sin matrícula'} •{' '}
                                            {p.neighborhood || p.city}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grid de profesionales */}
                <div className='overflow-y-auto p-3 grid grid-cols-3 sm:grid-cols-4 gap-2'>
                    {visible.map((p) => (
                        <button
                            key={p.id}
                            type='button'
                            disabled={saving}
                            onClick={() => onSelect(p, slot)}
                            className='rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 flex flex-col disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            <div className='aspect-square overflow-hidden bg-neutral-200 dark:bg-neutral-700'>
                                {p.photo_url && (
                                    <img
                                        src={p.photo_url}
                                        alt={p.name}
                                        className='w-full h-full object-cover'
                                    />
                                )}
                            </div>
                            <span className='text-[10px] font-semibold px-1.5 py-1 truncate text-neutral-900 dark:text-neutral-100'>
                                {p.name}
                            </span>
                        </button>
                    ))}
                    {visible.length === 0 && (
                        <p className='col-span-full text-center text-xs text-neutral-400 py-8'>
                            {base.length === 0
                                ? 'No hay profesionales disponibles.'
                                : 'Sin resultados para tu búsqueda.'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
