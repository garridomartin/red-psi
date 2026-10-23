'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2, AlertCircle, Clipboard } from 'lucide-react';
import { allowedImageMimeTypes, maxImageSizeBytes } from '@/lib/validations';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clipboard paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleFileProcess(blob, 'Captura pegada desde portapapeles');
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFileProcess = async (file: File, fallbackName?: string) => {
    setErrorMsg(null);

    // Validate type
    if (!allowedImageMimeTypes.includes(file.type)) {
      setErrorMsg('Formato no válido. Solo se permiten imágenes JPG, PNG o WebP.');
      return;
    }

    // Validate size (5MB max)
    if (file.size > maxImageSizeBytes) {
      setErrorMsg('El archivo excede el tamaño máximo permitido de 5 MB.');
      return;
    }

    const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    setFileDetails({
      name: file.name || fallbackName || 'imagen.jpg',
      size: formattedSize,
    });

    setIsUploading(true);

    try {
      // If Supabase Storage is configured, upload to bucket
      if (isSupabaseConfigured) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `prof_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `professionals/${fileName}`;

        const { data, error } = await supabase.storage
          .from('professionals-photos')
          .upload(filePath, file, { upsert: true });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('professionals-photos')
            .getPublicUrl(filePath);

          onChange(publicUrlData.publicUrl);
          setIsUploading(false);
          return;
        }
      }

      // Local reader fallback (Base64 URL) for instant preview and offline support
      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        onChange(resultUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMsg('Error al procesar la imagen: ' + (err.message || 'Desconocido'));
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setFileDetails(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
        Foto del profesional *
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box with Controls */
        <div className="relative rounded-2xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-3 flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 border border-neutral-300 dark:border-neutral-600 bg-neutral-900">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Imagen cargada correctamente</span>
            </div>
            {fileDetails && (
              <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                {fileDetails.name} ({fileDetails.size})
              </p>
            )}
            <p className="text-[10px] text-neutral-400 mt-1 truncate">
              URL: {value.startsWith('data:') ? 'Codificada en Base64' : value}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="Cambiar imagen"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Eliminar imagen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone / Paste Area */
        <div
          ref={containerRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-950/20 scale-[1.01]'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-400 bg-neutral-50/50 dark:bg-neutral-800/40'
          }`}
        >
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary-400/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3">
            {isUploading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
            {isDragging ? 'Soltá la foto acá' : 'Arrastrá tu imagen o hacé clic para explorar'}
          </h4>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200/60 dark:bg-neutral-700/60 text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 my-2">
            <Clipboard className="w-3.5 h-3.5 text-primary-500" />
            <span>O presioná Ctrl+V para pegar captura de pantalla</span>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Admite JPG, PNG o WebP hasta 5 MB.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
