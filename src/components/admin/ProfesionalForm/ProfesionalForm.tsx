'use client';

import { CheckCircle2 } from 'lucide-react';

import CheckboxGroup from './CheckboxGroup';
import {
    CLIENT_AGE_OPTIONS,
    ClientAge,
    Insurance,
    MatriculaStatus,
    ProfFormData,
    Specialty,
} from '@/types';
import { INSURANCES_CATALOG, SPECIALTIES_CATALOG } from '@/lib/data/mockData';
import { ImageUploader } from '../ImageUploader';
import { LicenseCheck } from '../LicenseCheck';

interface ProfesionalFormProps {
    profFormData: ProfFormData;
    setProfFormData: React.Dispatch<React.SetStateAction<ProfFormData>>;
    editingProfId: string | null;

    onSubmit: (e: React.FormEvent) => void | Promise<void>;
    onCancelEdit?: () => void;
    onCancel: () => void;

    matriculaDebounceRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
    matriculaStatus: MatriculaStatus;
    setMatriculaStatus: React.Dispatch<React.SetStateAction<MatriculaStatus>>;

    // opcionales
    specialtiesCatalog?: Specialty[];
    insurancesCatalog?: Insurance[];
    showFeaturedToggle?: boolean;
}

export default function ProfesionalForm({
    profFormData,
    setProfFormData,
    editingProfId,
    onSubmit,
    onCancelEdit,
    onCancel,
    matriculaDebounceRef,
    matriculaStatus,
    setMatriculaStatus,
    specialtiesCatalog = SPECIALTIES_CATALOG,
    insurancesCatalog = INSURANCES_CATALOG,
    showFeaturedToggle = true,
}: ProfesionalFormProps) {
    const patch = (partial: Partial<ProfFormData>) =>
        setProfFormData((prev) => ({ ...prev, ...partial }));

    const toggleArrayField = <K extends 'client_age' | 'specialties' | 'insurances'>(
        field: K,
        value: ProfFormData[K][number],
    ) => {
        setProfFormData((prev) => {
            const current = prev[field] as readonly unknown[];
            const exists = current.includes(value);
            return {
                ...prev,
                [field]: exists ? current.filter((v) => v !== value) : [...current, value],
            };
        });
    };

    const handleCopyMatriculaForSearch = () => {
        const matriculaLimpia = profFormData.license.replace(/[^0-9]/g, '');
        if (matriculaLimpia) {
            navigator.clipboard.writeText(matriculaLimpia);
        }
    };

    return (
        <form
            onSubmit={onSubmit}
            className='bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-card space-y-6'
        >
            {/* Header */}
            <div className='flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800'>
                <h3 className='font-bold text-lg font-display text-neutral-900 dark:text-neutral-50'>
                    {editingProfId ? 'Editar datos del profesional' : 'Carga de nuevo psicólogo/a'}
                </h3>
                {editingProfId && onCancelEdit && (
                    <button
                        type='button'
                        onClick={onCancelEdit}
                        className='text-xs font-semibold text-neutral-500 hover:text-neutral-700'
                    >
                        Cancelar edición
                    </button>
                )}
            </div>

            {/* Image Uploader */}
            <ImageUploader
                value={profFormData.photo_url}
                onChange={(url) => patch({ photo_url: url })}
            />

            {/* Nombre + Matrícula + Edad del paciente */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Nombre y Apellido *
                    </label>
                    <input
                        type='text'
                        required
                        value={profFormData.name}
                        onChange={(e) => patch({ name: e.target.value })}
                        placeholder='Ej: Lic. Sofía Valenzuela'
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    />
                </div>

                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Matrícula *
                    </label>
                    <LicenseCheck
                        setProfFormData={setProfFormData}
                        profFormData={profFormData}
                        matriculaDebounceRef={matriculaDebounceRef}
                        setMatriculaStatus={setMatriculaStatus}
                    />

                    {matriculaStatus.checking && (
                        <p className='mt-1.5 text-[11px] text-neutral-500 animate-pulse'>
                            Verificando matrícula en el padrón...
                        </p>
                    )}

                    {matriculaStatus.found === true && matriculaStatus.nombreSugerido && (
                        <p className='mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1'>
                            <CheckCircle2 className='w-3 h-3' />
                            Matrícula válida: {matriculaStatus.nombreSugerido}
                        </p>
                    )}

                    {matriculaStatus.found === false && (
                        <div className='mt-1.5 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800'>
                            <p className='text-[11px] text-red-700 dark:text-red-300 font-semibold'>
                                Matrícula no encontrada en el padrón. Chequeá el número.
                            </p>
                            <a
                                href='https://www.argentina.gob.ar/salud/buscador-nacional-de-profesionales-de-la-salud'
                                target='_blank'
                                rel='noopener noreferrer'
                                onClick={handleCopyMatriculaForSearch}
                                className='text-[11px] text-red-600 dark:text-red-400 underline hover:no-underline mt-1 inline-block'
                            >
                                Verificar en el Buscador Nacional (selecciona Matrícula y haz
                                CTRL+V) →
                            </a>
                        </div>
                    )}
                </div>

                {/* Edad del paciente */}
                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2'>
                        Edad del paciente (A quién atiende)
                    </label>
                    <CheckboxGroup
                        options={CLIENT_AGE_OPTIONS}
                        selected={profFormData.client_age}
                        onToggle={(id) => toggleArrayField('client_age', id as ClientAge)}
                        gridClassName='grid-cols-2 sm:grid-cols-4'
                    />
                </div>
            </div>

            {/* Género / Edad / Modalidad */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Género *
                    </label>
                    <select
                        value={profFormData.gender}
                        onChange={(e) =>
                            patch({ gender: e.target.value as ProfFormData['gender'] })
                        }
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    >
                        <option value='femenino'>Femenino</option>
                        <option value='masculino'>Masculino</option>
                        <option value='no-binario'>No binario</option>
                        <option value='otro'>Otro</option>
                    </select>
                </div>

                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Edad *
                    </label>
                    <input
                        type='number'
                        min={22}
                        max={99}
                        value={profFormData.age}
                        onChange={(e) => patch({ age: parseInt(e.target.value, 10) || 30 })}
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    />
                </div>

                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Modalidad *
                    </label>
                    <select
                        value={profFormData.modality}
                        onChange={(e) =>
                            patch({ modality: e.target.value as ProfFormData['modality'] })
                        }
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    >
                        <option value='ambas'>Presencial y Online</option>
                        <option value='presencial'>Solo Presencial</option>
                        <option value='online'>Solo Online</option>
                    </select>
                </div>
            </div>

            {/* Especialidades */}
            <div>
                <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2'>
                    Especialidades (alimentan el motor de búsqueda y filtros) *
                </label>
                <CheckboxGroup
                    options={specialtiesCatalog.map((s) => ({ id: s.name, label: s.name }))}
                    selected={profFormData.specialties}
                    onToggle={(name) => toggleArrayField('specialties', name)}
                />
            </div>

            {/* Obras sociales */}
            <div>
                <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2'>
                    Obras sociales y prepagas aceptadas *
                </label>
                <CheckboxGroup
                    options={insurancesCatalog.map((i) => ({ id: i.name, label: i.name }))}
                    selected={profFormData.insurances}
                    onToggle={(name) => toggleArrayField('insurances', name)}
                    gridClassName='grid-cols-2 sm:grid-cols-4'
                />
            </div>

            {/* Ubicación */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Dirección del consultorio *
                    </label>
                    <input
                        type='text'
                        required
                        value={profFormData.address}
                        onChange={(e) => patch({ address: e.target.value })}
                        placeholder='Ej: Calle 12 esquina Calle 55, La Plata'
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    />
                </div>
                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Barrio / Localidad
                    </label>
                    <input
                        type='text'
                        value={profFormData.neighborhood ?? ''}
                        onChange={(e) => patch({ neighborhood: e.target.value })}
                        placeholder='La Plata'
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    />
                </div>
                <div className='grid grid-cols-2 gap-2'>
                    <div>
                        <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                            Lat
                        </label>
                        <input
                            type='number'
                            step='0.0001'
                            value={profFormData.lat}
                            onChange={(e) => patch({ lat: parseFloat(e.target.value) || 0 })}
                            className='w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                        />
                    </div>
                    <div>
                        <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                            Lng
                        </label>
                        <input
                            type='number'
                            step='0.0001'
                            value={profFormData.lng}
                            onChange={(e) => patch({ lng: parseFloat(e.target.value) || 0 })}
                            className='w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                        />
                    </div>
                </div>
            </div>

            {/* Contacto */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Link a Instagram del profesional *
                    </label>
                    <input
                        type='url'
                        required
                        value={profFormData.instagram_url}
                        onChange={(e) => patch({ instagram_url: e.target.value })}
                        placeholder='https://instagram.com/nombre.psi'
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    />
                </div>
                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        Email de contacto *
                    </label>
                    <input
                        type='email'
                        required
                        value={profFormData.contact_email}
                        onChange={(e) => patch({ contact_email: e.target.value })}
                        placeholder='profesional@gmail.com'
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    />
                </div>
                <div>
                    <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                        WhatsApp / Teléfono *
                    </label>
                    <input
                        type='text'
                        required
                        value={profFormData.contact_phone}
                        onChange={(e) => patch({ contact_phone: e.target.value })}
                        placeholder='+5491145678901'
                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                    />
                </div>
            </div>

            {/* Bio */}
            <div>
                <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                    Biografía / Resumen clínico profesional *
                </label>
                <textarea
                    rows={4}
                    required
                    value={profFormData.bio}
                    onChange={(e) => patch({ bio: e.target.value })}
                    placeholder='Describí la trayectoria, enfoque teórico y motivos de consulta frecuentes...'
                    className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 resize-none'
                />
            </div>

            {/* Toggles */}
            <div className='flex items-center gap-6 pt-2'>
                {showFeaturedToggle && (
                    <label className='flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200'>
                        <input
                            type='checkbox'
                            checked={profFormData.is_featured}
                            onChange={(e) => patch({ is_featured: e.target.checked })}
                            className='rounded text-primary-500 focus:ring-primary-400'
                        />
                        <span>Marcar como Profesional Destacado en Inicio</span>
                    </label>
                )}

                <label className='flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200'>
                    <input
                        type='checkbox'
                        checked={profFormData.is_active}
                        onChange={(e) => patch({ is_active: e.target.checked })}
                        className='rounded text-primary-500 focus:ring-primary-400'
                    />
                    <span>Activo (visible en la web pública)</span>
                </label>
            </div>

            {/* Footer */}
            <div className='pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3'>
                <button
                    type='button'
                    onClick={onCancel}
                    className='py-2.5 px-4 text-xs font-bold rounded-xl text-neutral-600 hover:bg-neutral-100'
                >
                    Cancelar
                </button>
                <button
                    type='submit'
                    className='py-2.5 px-6 text-xs font-bold rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950 shadow-sm'
                >
                    {editingProfId ? 'Guardar cambios' : 'Publicar profesional'}
                </button>
            </div>
        </form>
    );
}
