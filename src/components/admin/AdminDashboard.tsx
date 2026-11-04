//AdminDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Professional, Article, Gender, Modality } from '@/types';
import {
    getProfessionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    toggleFeaturedProfessional,
    toggleActiveProfessional,
    getArticles,
    addArticle,
    deleteArticle,
    getStats,
    updateArticle,
    AppStats,
} from '@/lib/data/dataStore';
import { SPECIALTIES_CATALOG, INSURANCES_CATALOG } from '@/lib/data/mockData';
import { ImageUploader } from './ImageUploader';
import { professionalSchema, articleSchema } from '@/lib/validations';
import {
    Shield,
    Plus,
    Users,
    FileText,
    BarChart3,
    Star,
    Eye,
    Trash2,
    Edit3,
    CheckCircle2,
    AlertCircle,
    Instagram,
    Phone,
    Mail,
    MapPin,
    TrendingUp,
    Tag,
    Search,
    X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'list' | 'create-prof' | 'articles' | 'stats'>(
        'list',
    );
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);

    const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
    const [stats, setStats] = useState<AppStats>({
        totalViews: 0,
        totalContacts: 0,
        totalFavorites: 0,
    });
    const [feedbackMsg, setFeedbackMsg] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);
    // Búsqueda de profesionales
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [appliedFilter, setAppliedFilter] = useState<string | null>(null);
    const [geocodeCandidates, setGeocodeCandidates] = useState<
        Array<{
            lat: number;
            lng: number;
            label: string;
            localidad: string | null;
            localidadCensal: string | null;
            departamento: string | null;
            provincia: string | null;
        }>
    >([]);
    const [showGeocodeModal, setShowGeocodeModal] = useState(false);
    const [geocodePendingAction, setGeocodePendingAction] = useState<null | {
        type: 'save';
        formData: any;
        slug: string;
    }>(null);
    const [geocodeDebug, setGeocodeDebug] = useState<any>(null);
    const [geocodeLoading, setGeocodeLoading] = useState(false);

    // Geocode: debug (botón "Probar")

    // Form State for Professional
    const [editingProfId, setEditingProfId] = useState<string | null>(null);
    const [profFormData, setProfFormData] = useState<{
        name: string;
        title: string;
        license: string;
        bio: string;
        photo_url: string;
        gender: Gender;
        age: number;
        specialties: string[];
        insurances: string[];
        modality: Modality;
        address: string;
        neighborhood: string;
        city: string;
        lat: number;
        lng: number;
        instagram_url: string;
        contact_email: string;
        contact_phone: string;
        session_price: string;
        approach: string;
        is_active: boolean;
        is_featured: boolean;
    }>({
        name: '',
        title: '',
        license: '',
        bio: '',
        photo_url: '',
        gender: 'femenino',
        age: 32,
        specialties: [],
        insurances: [],
        modality: 'ambas',
        address: '',
        neighborhood: '',
        city: 'Buenos Aires',
        lat: -34.6037,
        lng: -58.3816,
        instagram_url: 'https://instagram.com/',
        contact_email: '',
        contact_phone: '+549221',
        session_price: '$40.000 / sesión',
        approach: '',
        is_active: true,
        is_featured: false,
    });

    // Form State for Article
    const [articleFormData, setArticleFormData] = useState({
        title: '',
        slug: '',
        cover_url:
            'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
        excerpt: '',
        content: '',
        author: 'Equipo Editorial Psicologos La Plata',
        author_role: 'Psicología & Divulgación',
        reading_time_minutes: 5,
        tags: ['Salud Mental', 'Terapia'],
        is_published: true,
    });

    // Estado para validación de matrícula
    const [matriculaStatus, setMatriculaStatus] = useState<{
        checking: boolean;
        found: boolean | null;
        nombreSugerido: string | null;
    }>({ checking: false, found: null, nombreSugerido: null });

    const loadAllData = async () => {
        const [profs, arts] = await Promise.all([getProfessionals(), getArticles()]);
        setProfessionals(profs);
        setArticles(arts);
        setStats(getStats()); // getStats sigue siendo sync (localStorage)
    };

    useEffect(() => {
        // Limpiar formularios AL MONTAR (garantiza que arranquen vacíos)
        resetProfForm();
        resetArticleForm();

        loadAllData();
        const handleSync = () => loadAllData();
        window.addEventListener('red_epsilon_data_changed', handleSync);
        return () => {
            window.removeEventListener('red_epsilon_data_changed', handleSync);
            if (matriculaDebounceRef.current) {
                clearTimeout(matriculaDebounceRef.current);
                matriculaDebounceRef.current = null;
            }
        };
    }, []);

    const showNotification = (type: 'success' | 'error', text: string) => {
        setFeedbackMsg({ type, text });
        setTimeout(() => setFeedbackMsg(null), 4000);
    };

    // Debounce ref para no spamear la API
    const matriculaDebounceRef = React.useRef<NodeJS.Timeout | null>(null);

    const buscarMatricula = (matricula: string) => {
        // Limpiar timeout anterior

        if (matriculaDebounceRef.current) {
            clearTimeout(matriculaDebounceRef.current);
        }

        const limpia = matricula.replace(/\D/g, '');

        if (limpia.length < 3) {
            setMatriculaStatus({ checking: false, found: null, nombreSugerido: null });
            return;
        }

        setMatriculaStatus({ checking: true, found: null, nombreSugerido: null });

        matriculaDebounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/api/matriculas/buscar?matricula=${encodeURIComponent(limpia)}`,
                );

                const data = await res.json();

                if (data.found) {
                    setMatriculaStatus({
                        checking: false,
                        found: true,
                        nombreSugerido: data.nombre,
                    });
                    // Autocompletar el nombre solo si está vacío o si el usuario no lo tocó
                    setProfFormData((prev) => ({
                        ...prev,
                        name: prev.name.trim() === '' ? data.nombre : prev.name,
                    }));
                } else {
                    setMatriculaStatus({
                        checking: false,
                        found: false,
                        nombreSugerido: null,
                    });
                }
            } catch (err) {
                console.error('🔴 [buscarMatricula] Error en fetch:', err);
                setMatriculaStatus({ checking: false, found: null, nombreSugerido: null });
            }
        }, 500); // 500ms debounce
    };

    const probarGeocode = async () => {
        if (!profFormData.address || profFormData.address.trim().length < 3) {
            setGeocodeDebug({ error: 'Escribí una dirección primero' });
            return;
        }
        setGeocodeLoading(true);
        setGeocodeDebug(null);
        try {
            const res = await fetch('/api/geocode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: profFormData.address }),
            });
            const data = await res.json();
            setGeocodeDebug({ status: res.status, ...data });
        } catch (err: any) {
            setGeocodeDebug({ error: err.message });
        } finally {
            setGeocodeLoading(false);
        }
    };

    const resetProfForm = () => {
        setEditingProfId(null);
        setProfFormData({
            name: '',
            title: 'Licenciada/o en Psicología',
            license: '',
            bio: '',
            photo_url: '',
            gender: 'femenino',
            age: 32,
            specialties: ['Terapia Cognitivo Conductual (TCC)'],
            insurances: ['OSDE', 'Particular'],
            modality: 'ambas',
            address: 'Av. Corrientes 2000, CABA',
            neighborhood: 'Balvanera',
            city: 'Buenos Aires',
            lat: -34.6037,
            lng: -58.3816,
            instagram_url: 'https://instagram.com/',
            contact_email: '',
            contact_phone: '+549221',
            session_price: '$32.000 / sesión',
            approach: 'Integrativo y Basado en Evidencia',
            is_active: true,
            is_featured: false,
        });
        setMatriculaStatus({ checking: false, found: null, nombreSugerido: null });

        // Cancelar debounce pendiente
        if (matriculaDebounceRef.current) {
            clearTimeout(matriculaDebounceRef.current);
            matriculaDebounceRef.current = null;
        }
    };

    const resetArticleForm = () => {
        setEditingArticleId(null);
        setArticleFormData({
            title: '',
            slug: '',
            cover_url:
                'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
            excerpt: '',
            content: '',
            author: 'Equipo Editorial Psicologos La Plata',
            author_role: 'Psicología & Divulgación',
            reading_time_minutes: 5,
            tags: ['Salud Mental', 'Terapia'],
            is_published: true,
        });
    };

    const handleEditProf = (prof: Professional) => {
        // Limpiar estado de validación de matrícula previo
        setMatriculaStatus({ checking: false, found: null, nombreSugerido: null });
        if (matriculaDebounceRef.current) {
            clearTimeout(matriculaDebounceRef.current);
            matriculaDebounceRef.current = null;
        }
        setEditingProfId(prof.id);
        setProfFormData({
            name: prof.name,
            title: prof.title || '',
            license: prof.license || '',
            bio: prof.bio,
            photo_url: prof.photo_url || '',
            gender: prof.gender,
            age: prof.age,
            specialties: prof.specialties,
            insurances: prof.insurances,
            modality: prof.modality,
            address: prof.address,
            neighborhood: prof.neighborhood || '',
            city: prof.city || 'La Plata',
            lat: prof.lat,
            lng: prof.lng,
            instagram_url: prof.instagram_url,
            contact_email: prof.contact_email,
            contact_phone: prof.contact_phone,
            session_price: prof.session_price || '',
            approach: prof.approach || '',
            is_active: prof.is_active,
            is_featured: prof.is_featured,
        });
        setActiveTab('create-prof');
    };

    const handleSaveProf = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Generar slug
        const generatedSlug = profFormData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // 2. Validar antes de geocodificar (para no geocodificar si el form está mal)
        const validated = professionalSchema.safeParse(profFormData);
        if (!validated.success) {
            const firstError =
                validated.error.issues[0]?.message || 'Verificá los datos del formulario';
            showNotification('error', firstError);
            return;
        }

        // 3. Geocodificar la dirección (si tiene sentido)
        let candidates: typeof geocodeCandidates = [];
        if (profFormData.address && profFormData.address.trim().length >= 5) {
            try {
                const geoRes = await fetch('/api/geocode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: profFormData.address }),
                });
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    candidates = geoData.candidates ?? [];
                }
            } catch (err) {
                console.error('Error geocodificando, se usan coordenadas actuales:', err);
            }
        }

        // 4. Preparar los datos finales (con las coords actuales por ahora)
        const buildFinalData = (lat: number, lng: number) => ({
            ...profFormData,
            lat,
            lng,
            slug: generatedSlug,
        });

        // 5. Si no hay candidatos, guardar con las coords actuales
        if (candidates.length === 0) {
            await persistProf(buildFinalData(profFormData.lat, profFormData.lng));
            return;
        }

        // 6. Si hay 1 solo candidato, usarlo directo
        if (candidates.length === 1) {
            await persistProf(buildFinalData(candidates[0].lat, candidates[0].lng));
            return;
        }

        // 7. Si hay varios, abrir el modal y guardar la acción pendiente
        setGeocodeCandidates(candidates);
        setGeocodePendingAction({
            type: 'save',
            formData: profFormData,
            slug: generatedSlug,
        });
        setShowGeocodeModal(true);
    };

    // Función auxiliar que hace el guardado real
    const persistProf = async (finalData: any) => {
        try {
            if (editingProfId) {
                await updateProfessional(editingProfId, finalData);
                showNotification('success', `Profesional "${finalData.name}" actualizado.`);
            } else {
                await addProfessional(finalData);
                showNotification('success', `Nuevo profesional "${finalData.name}" registrado.`);
            }
            resetProfForm();
            await loadAllData();
            setActiveTab('list');
        } catch (err: any) {
            console.error('🔴 [AdminDashboard] Error al guardar:', err.message);
            showNotification('error', `Error al guardar: ${err.message}`);
        }
    };

    // Handler cuando el admin elige un candidato en el modal
    const handleSelectCandidate = async (candidate: (typeof geocodeCandidates)[0]) => {
        if (!geocodePendingAction || geocodePendingAction.type !== 'save') {
            setShowGeocodeModal(false);
            return;
        }
        setShowGeocodeModal(false);
        const finalData = {
            ...geocodePendingAction.formData,
            lat: candidate.lat,
            lng: candidate.lng,
            slug: geocodePendingAction.slug,
        };
        setGeocodePendingAction(null);
        setGeocodeCandidates([]);
        await persistProf(finalData);
    };

    // Handler si el admin cancela (guarda con las coords actuales)
    const handleCancelGeocodeModal = async () => {
        if (!geocodePendingAction) {
            setShowGeocodeModal(false);
            return;
        }
        // Opción: guardar con las coordenadas actuales, o abortar.
        // Acá elegimos abortar para que el admin pueda corregir la dirección.
        setShowGeocodeModal(false);
        setGeocodePendingAction(null);
        setGeocodeCandidates([]);
        showNotification('error', 'Elegí una dirección para continuar. No se guardó nada.');
    };
    const handleDeleteProf = (id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar a ${name}? Esta acción no se puede deshacer.`)) {
            deleteProfessional(id);
            loadAllData();
            showNotification('success', `Profesional ${name} eliminado.`);
        }
    };

    const handleToggleFeatured = (p: Professional) => {
        toggleFeaturedProfessional(p.id, p.is_featured);
        loadAllData();
    };

    const handleToggleActive = (p: Professional) => {
        toggleActiveProfessional(p.id, p.is_active);
        loadAllData();
    };

    const handleCreateArticle = async (e: React.FormEvent) => {
        e.preventDefault();

        const slug = articleFormData.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const validated = articleSchema.safeParse(articleFormData);
        if (!validated.success) {
            showNotification('error', validated.error.issues[0]?.message || 'Verificá los datos');
            return;
        }

        try {
            if (editingArticleId) {
                // MODO EDICIÓN
                await updateArticle(editingArticleId, { ...articleFormData, slug });
                showNotification('success', 'Artículo actualizado con éxito.');
                setEditingArticleId(null);
            } else {
                // MODO CREACIÓN
                await addArticle({ ...articleFormData, slug });
                showNotification('success', 'Artículo publicado con éxito.');
            }

            // Limpiar formulario
            setArticleFormData({
                title: '',
                slug: '',
                cover_url:
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
                excerpt: '',
                content: '',
                author: 'Equipo Editorial Psicologos La Plata',
                author_role: 'Psicología & Divulgación',
                reading_time_minutes: 5,
                tags: ['Salud Mental', 'Terapia'],
                is_published: true,
            });

            await loadAllData();
        } catch (err: any) {
            showNotification('error', `Error al guardar: ${err.message}`);
        }
    };

    const handleDeleteArticle = async (id: string, title: string) => {
        if (!confirm(`¿Eliminar artículo "${title}"?`)) return;

        try {
            await deleteArticle(id);
            await loadAllData();
            showNotification('success', 'Artículo eliminado.');
        } catch (err: any) {
            console.error('Error eliminando artículo:', err);
            showNotification('error', err.message || 'No se pudo eliminar el artículo.');
        }
    };
    // ===== Búsqueda de profesionales =====
    const normalize = (s: string) =>
        s
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim() === '') {
            setAppliedFilter(null);
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const q = searchQuery.trim();
            setAppliedFilter(q.length === 0 ? null : q);
            setSearchFocused(false);
        }
        if (e.key === 'Escape') {
            setSearchFocused(false);
        }
    };

    const handleSelectSuggestion = (prof: Professional) => {
        setSearchQuery(prof.name);
        setAppliedFilter(prof.name);
        setSearchFocused(false);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setAppliedFilter(null);
        setSearchFocused(false);
    };
    return (
        <div className='space-y-8'>
            {/* Top Banner / Feedback alert */}
            {feedbackMsg && (
                <div
                    className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in ${
                        feedbackMsg.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                            : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200'
                    }`}
                >
                    {feedbackMsg.type === 'success' ? (
                        <CheckCircle2 className='w-5 h-5 shrink-0' />
                    ) : (
                        <AlertCircle className='w-5 h-5 shrink-0' />
                    )}
                    <span className='text-xs font-semibold'>{feedbackMsg.text}</span>
                </div>
            )}

            {/* Header Info */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800'>
                <div>
                    <div className='flex items-center gap-2'>
                        <span className='px-2.5 py-1 text-[11px] font-bold rounded-lg bg-primary-400 text-neutral-950'>
                            ROL: ADMINISTRADOR
                        </span>
                        <span className='text-xs text-neutral-500'>{}</span>
                    </div>
                    <h2 className='text-2xl font-bold font-display text-neutral-900 dark:text-neutral-50 mt-1'>
                        Gestión de Agencia y Profesionales
                    </h2>
                </div>

                <button
                    onClick={() => {
                        resetProfForm();
                        setActiveTab('create-prof');
                    }}
                    className='inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-400 hover:bg-primary-300 text-neutral-950 font-bold text-xs shadow-sm transition-all'
                >
                    <Plus className='w-4 h-4' />
                    <span>Cargar nuevo profesional</span>
                </button>
            </div>

            {/* Tabs */}
            <div className='flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3'>
                {[
                    { id: 'list', label: `Profesionales (${professionals.length})`, icon: Users },
                    {
                        id: 'create-prof',
                        label: editingProfId ? 'Editar profesional' : 'Cargar profesional',
                        icon: Plus,
                    },
                    { id: 'articles', label: `Artículos (${articles.length})`, icon: FileText },
                    { id: 'stats', label: 'Estadísticas & Catálogos', icon: BarChart3 },
                ].map((tab) => {
                    const IconComp = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                isActive
                                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 border border-neutral-200 dark:border-neutral-800'
                            }`}
                        >
                            <IconComp className='w-4 h-4' />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: LIST OF PROFESSIONALS */}

            {activeTab === 'list' && (
                <div className='space-y-4'>
                    {/* Barra de búsqueda con autocompletar */}
                    <div className='relative'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none' />
                            <input
                                type='text'
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => {
                                    setTimeout(() => setSearchFocused(false), 150);
                                }}
                                placeholder='Buscar por nombre o matrícula... (mín. 3 caracteres)'
                                className='w-full pl-10 pr-10 py-3 text-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400'
                            />
                            {searchQuery && (
                                <button
                                    type='button'
                                    onClick={handleClearSearch}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                    title='Limpiar búsqueda'
                                >
                                    <X className='w-4 h-4' />
                                </button>
                            )}
                        </div>

                        {searchFocused && suggestions.length > 0 && (
                            <div className='absolute z-20 left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden'>
                                {suggestions.map((p) => (
                                    <button
                                        key={p.id}
                                        type='button'
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSelectSuggestion(p)}
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
                                                {p.license || 'Sin matrícula'} •{' '}
                                                {p.neighborhood || p.city}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Indicador de filtro activo */}
                    {appliedFilter && (
                        <div className='flex items-center justify-between text-xs text-neutral-500'>
                            <span>
                                Filtrando por:{' '}
                                <strong className='text-neutral-900 dark:text-neutral-100'>
                                    {appliedFilter}
                                </strong>{' '}
                                — {filteredProfessionals.length} de {professionals.length}{' '}
                                profesionales
                            </span>
                            <button
                                type='button'
                                onClick={handleClearSearch}
                                className='text-primary-600 hover:underline font-semibold'
                            >
                                Limpiar filtro
                            </button>
                        </div>
                    )}

                    <div className='bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-card overflow-hidden'>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left border-collapse text-xs'>
                                <thead>
                                    <tr className='border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-500 uppercase tracking-wider font-semibold'>
                                        <th className='p-4'>Profesional</th>
                                        <th className='p-4'>Especialidades</th>
                                        <th className='p-4'>Modalidad</th>
                                        <th className='p-4'>Ubicación</th>
                                        <th className='p-4 text-center'>Destacado</th>
                                        <th className='p-4 text-center'>Estado</th>
                                        <th className='p-4 text-right'>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-neutral-100 dark:divide-neutral-800'>
                                    {filteredProfessionals.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className='p-8 text-center text-neutral-500'
                                            >
                                                {appliedFilter
                                                    ? `No se encontraron profesionales que coincidan con "${appliedFilter}".`
                                                    : 'No hay profesionales cargados.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProfessionals.map((p) => (
                                            <tr
                                                key={p.id}
                                                className='hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors'
                                            >
                                                <td className='p-4'>
                                                    <div className='flex items-center gap-3'>
                                                        <img
                                                            src={p.photo_url}
                                                            alt={p.name}
                                                            className='w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-neutral-200 dark:ring-neutral-700'
                                                        />
                                                        <div>
                                                            <p className='font-bold text-neutral-900 dark:text-neutral-100'>
                                                                {p.name}
                                                            </p>
                                                            <p className='text-[11px] text-neutral-500'>
                                                                M.N. {p.license} • {p.age} años
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='p-4 text-neutral-600 dark:text-neutral-300 max-w-[200px] truncate'>
                                                    {p.specialties.join(', ')}
                                                </td>
                                                <td className='p-4 capitalize'>
                                                    <span className='px-2 py-0.5 rounded-md font-medium text-[11px] bg-neutral-100 dark:bg-neutral-800'>
                                                        {p.modality}
                                                    </span>
                                                </td>
                                                <td className='p-4 text-neutral-600 dark:text-neutral-300'>
                                                    {p.neighborhood || p.city}
                                                </td>
                                                <td className='p-4 text-center'>
                                                    <button
                                                        onClick={() => handleToggleFeatured(p)}
                                                        className={`p-1.5 rounded-lg transition-colors ${
                                                            p.is_featured
                                                                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                                                                : 'text-neutral-300 hover:text-neutral-500'
                                                        }`}
                                                        title='Alternar destacado'
                                                    >
                                                        <Star
                                                            className={`w-4 h-4 ${p.is_featured ? 'fill-amber-400' : ''}`}
                                                        />
                                                    </button>
                                                </td>
                                                <td className='p-4 text-center'>
                                                    <button
                                                        onClick={() => handleToggleActive(p)}
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                                                            p.is_active
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                                                : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                                                        }`}
                                                    >
                                                        {p.is_active ? 'Activo' : 'Oculto'}
                                                    </button>
                                                </td>
                                                <td className='p-4 text-right space-x-1'>
                                                    <button
                                                        onClick={() => handleEditProf(p)}
                                                        className='p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                                        title='Editar'
                                                    >
                                                        <Edit3 className='w-4 h-4' />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteProf(p.id, p.name)
                                                        }
                                                        className='p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                                                        title='Eliminar'
                                                    >
                                                        <Trash2 className='w-4 h-4' />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: CREATE / EDIT PROFESSIONAL */}
            {activeTab === 'create-prof' && (
                <form
                    onSubmit={handleSaveProf}
                    className='bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-card space-y-6'
                >
                    <div className='flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800'>
                        <h3 className='font-bold text-lg font-display text-neutral-900 dark:text-neutral-50'>
                            {editingProfId
                                ? 'Editar datos del profesional'
                                : 'Carga de nuevo psicólogo/a'}
                        </h3>
                        {editingProfId && (
                            <button
                                type='button'
                                onClick={resetProfForm}
                                className='text-xs font-semibold text-neutral-500 hover:text-neutral-700'
                            >
                                Cancelar edición
                            </button>
                        )}
                    </div>

                    {/* ADVANCED IMAGE UPLOADER (Drag, Drop, File & Clipboard Ctrl+V Paste) */}
                    <ImageUploader
                        value={profFormData.photo_url}
                        onChange={(url) => setProfFormData({ ...profFormData, photo_url: url })}
                    />

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                                Nombre y Apellido *
                            </label>
                            <input
                                type='text'
                                required
                                value={profFormData.name}
                                onChange={(e) =>
                                    setProfFormData({ ...profFormData, name: e.target.value })
                                }
                                placeholder='Ej: Lic. Sofía Valenzuela'
                                className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                                Matrícula *
                            </label>
                            <div className='relative'>
                                <input
                                    type='text'
                                    required
                                    value={profFormData.license}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setProfFormData({ ...profFormData, license: value });
                                        buscarMatricula(value);
                                    }}
                                    placeholder='Ej: 48912'
                                    className='w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                                />
                                {profFormData.license && (
                                    <button
                                        type='button'
                                        onClick={() => {
                                            // Cancelar debounce pendiente
                                            if (matriculaDebounceRef.current) {
                                                clearTimeout(matriculaDebounceRef.current);
                                                matriculaDebounceRef.current = null;
                                            }
                                            // Limpiar matrícula y nombre
                                            setProfFormData({
                                                ...profFormData,
                                                license: '',
                                                name: '',
                                            });
                                            // Limpiar estado de validación
                                            setMatriculaStatus({
                                                checking: false,
                                                found: null,
                                                nombreSugerido: null,
                                            });
                                        }}
                                        className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
                                        title='Limpiar matrícula y nombre'
                                    >
                                        <svg
                                            className='w-3.5 h-3.5'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2.5}
                                                d='M6 18L18 6M6 6l12 12'
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Feedback de validación de matrícula */}
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
                                        onClick={() => {
                                            // Copia la matrícula al portapapeles (sin el MP- ni ceros extra)
                                            const matriculaLimpia = profFormData.license.replace(
                                                /[^0-9]/g,
                                                '',
                                            );
                                            if (matriculaLimpia) {
                                                navigator.clipboard.writeText(matriculaLimpia);
                                            }
                                        }}
                                        className='text-[11px] text-red-600 dark:text-red-400 underline hover:no-underline mt-1 inline-block'
                                    >
                                        Verificar en el Buscador Nacional (selecciona Matrícula y
                                        haz CTRL+V) →
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                                Género *
                            </label>
                            <select
                                value={profFormData.gender}
                                onChange={(e) =>
                                    setProfFormData({
                                        ...profFormData,
                                        gender: e.target.value as any,
                                    })
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
                                onChange={(e) =>
                                    setProfFormData({
                                        ...profFormData,
                                        age: parseInt(e.target.value, 10) || 30,
                                    })
                                }
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
                                    setProfFormData({
                                        ...profFormData,
                                        modality: e.target.value as any,
                                    })
                                }
                                className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                            >
                                <option value='ambas'>Presencial y Online</option>
                                <option value='presencial'>Solo Presencial</option>
                                <option value='online'>Solo Online</option>
                            </select>
                        </div>
                    </div>

                    {/* Specialties Checkbox selector */}
                    <div>
                        <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2'>
                            Especialidades (alimentan el motor de búsqueda y filtros) *
                        </label>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                            {SPECIALTIES_CATALOG.map((s) => {
                                const checked = profFormData.specialties.includes(s.name);
                                return (
                                    <label
                                        key={s.id}
                                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                            checked
                                                ? 'bg-primary-400/20 border-primary-400 text-neutral-900 dark:text-neutral-100 font-semibold'
                                                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                                        }`}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={checked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setProfFormData({
                                                        ...profFormData,
                                                        specialties: [
                                                            ...profFormData.specialties,
                                                            s.name,
                                                        ],
                                                    });
                                                } else {
                                                    setProfFormData({
                                                        ...profFormData,
                                                        specialties:
                                                            profFormData.specialties.filter(
                                                                (item) => item !== s.name,
                                                            ),
                                                    });
                                                }
                                            }}
                                            className='rounded text-primary-500 focus:ring-primary-400'
                                        />
                                        <span className='truncate'>{s.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Insurances Checkbox selector */}
                    <div>
                        <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2'>
                            Obras sociales y prepagas aceptadas *
                        </label>
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                            {INSURANCES_CATALOG.map((ins) => {
                                const checked = profFormData.insurances.includes(ins.name);
                                return (
                                    <label
                                        key={ins.id}
                                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                            checked
                                                ? 'bg-primary-400/20 border-primary-400 text-neutral-900 dark:text-neutral-100 font-semibold'
                                                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                                        }`}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={checked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setProfFormData({
                                                        ...profFormData,
                                                        insurances: [
                                                            ...profFormData.insurances,
                                                            ins.name,
                                                        ],
                                                    });
                                                } else {
                                                    setProfFormData({
                                                        ...profFormData,
                                                        insurances: profFormData.insurances.filter(
                                                            (item) => item !== ins.name,
                                                        ),
                                                    });
                                                }
                                            }}
                                            className='rounded text-primary-500 focus:ring-primary-400'
                                        />
                                        <span className='truncate'>{ins.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Location & Coordinates */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                                Dirección del consultorio *
                            </label>
                            <input
                                type='text'
                                required
                                value={profFormData.address}
                                onChange={(e) =>
                                    setProfFormData({ ...profFormData, address: e.target.value })
                                }
                                placeholder='Av. Santa Fe 3200'
                                className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                            />
                        </div>
                        <div>
                            <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                                Barrio / Localidad
                            </label>
                            <input
                                type='text'
                                value={profFormData.neighborhood}
                                onChange={(e) =>
                                    setProfFormData({
                                        ...profFormData,
                                        neighborhood: e.target.value,
                                    })
                                }
                                placeholder='Palermo'
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
                                    onChange={(e) =>
                                        setProfFormData({
                                            ...profFormData,
                                            lat: parseFloat(e.target.value) || 0,
                                        })
                                    }
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
                                    onChange={(e) =>
                                        setProfFormData({
                                            ...profFormData,
                                            lng: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className='w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Instagram */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                        <div>
                            <label className='block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1'>
                                Link a Instagram del profesional *
                            </label>
                            <input
                                type='url'
                                required
                                value={profFormData.instagram_url}
                                onChange={(e) =>
                                    setProfFormData({
                                        ...profFormData,
                                        instagram_url: e.target.value,
                                    })
                                }
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
                                onChange={(e) =>
                                    setProfFormData({
                                        ...profFormData,
                                        contact_email: e.target.value,
                                    })
                                }
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
                                onChange={(e) =>
                                    setProfFormData({
                                        ...profFormData,
                                        contact_phone: e.target.value,
                                    })
                                }
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
                            onChange={(e) =>
                                setProfFormData({ ...profFormData, bio: e.target.value })
                            }
                            placeholder='Describí la trayectoria, enfoque teórico y motivos de consulta frecuentes...'
                            className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 resize-none'
                        />
                    </div>

                    {/* Toggles */}
                    <div className='flex items-center gap-6 pt-2'>
                        <label className='flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200'>
                            <input
                                type='checkbox'
                                checked={profFormData.is_featured}
                                onChange={(e) =>
                                    setProfFormData({
                                        ...profFormData,
                                        is_featured: e.target.checked,
                                    })
                                }
                                className='rounded text-primary-500 focus:ring-primary-400'
                            />
                            <span>Marcar como Profesional Destacado en Inicio</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800 dark:text-neutral-200'>
                            <input
                                type='checkbox'
                                checked={profFormData.is_active}
                                onChange={(e) =>
                                    setProfFormData({
                                        ...profFormData,
                                        is_active: e.target.checked,
                                    })
                                }
                                className='rounded text-primary-500 focus:ring-primary-400'
                            />
                            <span>Activo (visible en la web pública)</span>
                        </label>
                    </div>

                    <div className='pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3'>
                        <button
                            type='button'
                            onClick={() => setActiveTab('list')}
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
            )}

            {/* TAB 3: ARTICLES MANAGEMENT */}
            {activeTab === 'articles' && (
                <div className='space-y-6'>
                    <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-card'>
                        <h3 className='font-bold text-base font-display text-neutral-900 dark:text-neutral-50 mb-4'>
                            Publicar nuevo artículo de divulgación
                        </h3>
                        <form onSubmit={handleCreateArticle} className='space-y-4'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                        Título del artículo
                                    </label>
                                    <input
                                        type='text'
                                        required
                                        value={articleFormData.title}
                                        onChange={(e) =>
                                            setArticleFormData({
                                                ...articleFormData,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder='Ej: Cómo elegir tu primer psicólogo'
                                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                        URL de la imagen de portada
                                    </label>
                                    <input
                                        type='url'
                                        required
                                        value={articleFormData.cover_url}
                                        onChange={(e) =>
                                            setArticleFormData({
                                                ...articleFormData,
                                                cover_url: e.target.value,
                                            })
                                        }
                                        placeholder='https://images.unsplash.com/...'
                                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                    Resumen o copete
                                </label>
                                <textarea
                                    rows={2}
                                    required
                                    value={articleFormData.excerpt}
                                    onChange={(e) =>
                                        setArticleFormData({
                                            ...articleFormData,
                                            excerpt: e.target.value,
                                        })
                                    }
                                    placeholder='Breve introducción para la tarjeta...'
                                    className='w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 resize-none'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                    Contenido completo
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    value={articleFormData.content}
                                    onChange={(e) =>
                                        setArticleFormData({
                                            ...articleFormData,
                                            content: e.target.value,
                                        })
                                    }
                                    placeholder='Texto completo del artículo...'
                                    className='w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                                />
                            </div>

                            <div className='flex justify-end'>
                                <button
                                    type='submit'
                                    className='py-2.5 px-5 text-xs font-bold rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950'
                                >
                                    Publicar artículo
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Articles list */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {articles.map((art) => (
                            <div
                                key={art.id}
                                className='bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start gap-4'
                            >
                                <img
                                    src={art.cover_url}
                                    alt={art.title}
                                    className='w-20 h-20 rounded-2xl object-cover shrink-0'
                                />
                                <div className='flex-1 min-w-0'>
                                    <h4 className='font-bold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1'>
                                        {art.title}
                                    </h4>
                                    <p className='text-xs text-neutral-500 line-clamp-2 mt-1'>
                                        {art.excerpt}
                                    </p>
                                    <div className='mt-3 flex items-center justify-between text-[11px] text-neutral-400'>
                                        <span>{art.author}</span>
                                        <button
                                            onClick={() => handleDeleteArticle(art.id, art.title)}
                                            className='text-red-500 hover:underline flex items-center gap-1'
                                        >
                                            <Trash2 className='w-3 h-3' />
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 4: STATS & CATALOG MANAGEMENT */}
            {activeTab === 'stats' && (
                <div className='space-y-6'>
                    {/* Key Metric Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm'>
                            <div className='w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3'>
                                <Eye className='w-5 h-5' />
                            </div>
                            <p className='text-xs font-semibold text-neutral-500'>
                                Visualizaciones de perfil
                            </p>
                            <h3 className='text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1'>
                                {stats.totalViews.toLocaleString()}
                            </h3>
                        </div>

                        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm'>
                            <div className='w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3'>
                                <Phone className='w-5 h-5' />
                            </div>
                            <p className='text-xs font-semibold text-neutral-500'>
                                Contactos generados (WhatsApp/Email)
                            </p>
                            <h3 className='text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1'>
                                {stats.totalContacts.toLocaleString()}
                            </h3>
                        </div>

                        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm'>
                            <div className='w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3'>
                                <Star className='w-5 h-5' />
                            </div>
                            <p className='text-xs font-semibold text-neutral-500'>
                                Favoritos guardados por pacientes
                            </p>
                            <h3 className='text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-1'>
                                {stats.totalFavorites.toLocaleString()}
                            </h3>
                        </div>
                    </div>

                    {/* Catalogs Overview */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm'>
                            <h4 className='font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2'>
                                <Tag className='w-4 h-4 text-primary-500' />
                                Catálogo de Especialidades ({SPECIALTIES_CATALOG.length})
                            </h4>
                            <div className='flex flex-wrap gap-1.5'>
                                {SPECIALTIES_CATALOG.map((s) => (
                                    <span
                                        key={s.id}
                                        className='px-2.5 py-1 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                    >
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm'>
                            <h4 className='font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2'>
                                <Shield className='w-4 h-4 text-emerald-500' />
                                Catálogo de Obras Sociales y Prepagas ({INSURANCES_CATALOG.length})
                            </h4>
                            <div className='flex flex-wrap gap-1.5'>
                                {INSURANCES_CATALOG.map((ins) => (
                                    <span
                                        key={ins.id}
                                        className='px-2.5 py-1 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                    >
                                        {ins.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de selección de dirección (geocode) — FUERA del form y del space-y-8 */}
            {showGeocodeModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm'>
                    <div className='bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-start justify-between mb-4'>
                            <div>
                                <h3 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-50'>
                                    Elegí la dirección correcta
                                </h3>
                                <p className='text-xs text-neutral-500 mt-1'>
                                    Georef encontró varias coincidencias para{' '}
                                    <strong>{profFormData.address}</strong>. Seleccioná la que
                                    corresponda.
                                </p>
                            </div>
                            <button
                                type='button'
                                onClick={handleCancelGeocodeModal}
                                className='p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                            >
                                ✕
                            </button>
                        </div>

                        <div className='space-y-2'>
                            {geocodeCandidates.map((c, idx) => (
                                <button
                                    key={idx}
                                    type='button'
                                    onClick={() => handleSelectCandidate(c)}
                                    className='w-full text-left p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-colors'
                                >
                                    <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
                                        {c.label}
                                    </p>
                                    <p className='text-[11px] text-neutral-500 mt-0.5'>
                                        📍 {c.localidad || c.localidadCensal || 'Sin localidad'} •{' '}
                                        {c.departamento || 'Sin partido'} • {c.provincia || ''}
                                    </p>
                                    <p className='text-[10px] text-neutral-400 font-mono mt-1'>
                                        {c.lat.toFixed(5)}, {c.lng.toFixed(5)}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <div className='mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2'>
                            <button
                                type='button'
                                onClick={handleCancelGeocodeModal}
                                className='py-2 px-4 text-xs font-bold rounded-xl text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
