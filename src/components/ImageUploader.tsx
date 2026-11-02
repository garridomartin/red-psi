'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Link as LinkIcon, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('El archivo debe ser una imagen (JPG, PNG, etc.)');
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Error al subir la imagen');

            onChange(data.url); // Guardamos la URL del .avif en el formulario
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    }, []);

    const onPaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
        const file = e.clipboardData.files?.[0];
        if (file) handleUpload(file);
    }, []);

    return (
        <div className='space-y-2'>
            <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200'>
                Foto de perfil *
            </label>

            {value ? (
                // VISTA PREVIA (Si ya hay una imagen)
                <div className='relative w-full h-48 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 group'>
                    <img
                        src={value}
                        alt='Vista previa'
                        className='w-full h-full object-cover'
                    />
                    <button
                        type='button'
                        onClick={() => onChange('')}
                        className='absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                        title='Eliminar imagen'
                    >
                        <X className='w-4 h-4' />
                    </button>
                </div>
            ) : (
                // ZONA DE SUBIDA (Si no hay imagen)
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    onPaste={onPaste}
                    tabIndex={0} // Para poder hacer foco y pegar
                    className='relative w-full h-48 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400'
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <div className='flex flex-col items-center text-primary-500'>
                            <Loader2 className='w-8 h-8 animate-spin mb-2' />
                            <span className='text-xs font-semibold'>Convirtiendo a AVIF y subiendo...</span>
                        </div>
                    ) : (
                        <>
                            <UploadCloud className='w-8 h-8 text-neutral-400 mb-2' />
                            <p className='text-xs font-semibold text-neutral-700 dark:text-neutral-300 text-center px-4'>
                                Hacé clic para buscar, arrastrá una imagen o pegala con Ctrl+V
                            </p>
                            <p className='text-[10px] text-neutral-500 mt-1'>
                                Formatos: JPG, PNG, WEBP (se convierten a AVIF)
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Input oculto para el click */}
            <input
                type='file'
                accept='image/*'
                className='hidden'
                ref={fileInputRef}
                onChange={onFileChange}
            />

            {error && <p className='text-xs text-red-500 font-semibold'>{error}</p>}

            {/* Alternativa: ingresar URL manual (por si suben desde otro lado) */}
            {!value && !isUploading && (
                <div className='flex items-center gap-2 mt-2'>
                    <LinkIcon className='w-3 h-3 text-neutral-400' />
                    <input
                        type='url'
                        placeholder='O pegá una URL externa acá...'
                        className='flex-1 text-[11px] bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-primary-400 py-1'
                        onChange={(e) => {
                            // Solo actualiza si es una URL válida básica
                            if (e.target.value.startsWith('http')) onChange(e.target.value);
                        }}
                    />
                </div>
            )}
        </div>
    );
};