//AdminDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Professional, Article, MatriculaStatus, ProfFormData } from '@/types';
import {
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
    getProfessionalsForAdmin,
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
    Phone,
    Tag,
    Search,
    X,
    Check,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { LicenseCheck } from './LicenseCheck';
import ProfesionalForm from './ProfesionalForm/ProfesionalForm';
import ArticlesManager from './ArticlesManager/ArticlesManager';
import StatsPanel from './StatsPanel/StatsPanel';
import GeocodeModal from './GeocodeModal/GeocodeModal';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'list' | 'create-prof' | 'articles' | 'stats'>(
        'list',
    );
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [originalProf, setOriginalProf] = useState<Professional | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
    const [stats, setStats] = useState<AppStats>({
        totalViews: 0,
        totalContacts: 0,
        totalFavorites: 0,
    });
    const [showHiredAtModal, setShowHiredAtModal] = useState(false);
    const [pendingHiredAtAction, setPendingHiredAtAction] = useState<{
        formData: typeof profFormData & { slug: string; hired_at?: string };
        slug: string;
        hiredAt: string | null;
        addressChanged: boolean;
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

    const [geocodeQuery, setGeocodeQuery] = useState<{
        direccion: string;
        localidad_censal: string | null;
        provincia: string;
    } | null>(null);

    // Estado para validación de matrícula
    const [matriculaStatus, setMatriculaStatus] = useState<MatriculaStatus>({
        checking: false,
        found: null,
        nombreSugerido: null,
    });

    // Form State for Professional
    const [editingProfId, setEditingProfId] = useState<string | null>(null);
    const [profFormData, setProfFormData] = useState<ProfFormData>({
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
        client_age: [],
        is_active: true,
        is_featured: false,
        hired_at: '',
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

    const loadAllData = async () => {
        const [profs, arts] = await Promise.all([
            getProfessionalsForAdmin(), // ← dashboard: ve todos (incluidos inactivos)
            getArticles(),
        ]);
        setProfessionals(profs);
        setArticles(arts);
        setStats(getStats());
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
        if (type === 'success') {
            toast.success(text);
        } else {
            toast.error(text, {
                description: 'Revisá los datos e intentá de nuevo.',
                duration: 6000,
            });
        }
    };

    // Debounce ref para no spamear la API
    const matriculaDebounceRef = React.useRef<NodeJS.Timeout | null>(null);

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
            insurances: ['Particular'],
            modality: 'ambas',
            address: 'Ej: Calle 12 esquina Calle 55',
            neighborhood: 'La Plata',
            city: 'La Plata',
            lat: -34.9192637,
            lng: -57.9558382,
            instagram_url: 'https://instagram.com/',
            contact_email: '',
            contact_phone: '+549221',
            session_price: 'consultar',
            approach: 'Integrativo y Basado en Evidencia',
            client_age: [],
            is_active: true,
            is_featured: false,
            hired_at: '',
        });
        setMatriculaStatus({ checking: false, found: null, nombreSugerido: null });
        setOriginalProf(null);
        setPendingHiredAtAction(null);
        setShowHiredAtModal(false);
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
        setOriginalProf(prof);
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
            client_age: prof.client_age || [],
            is_active: prof.is_active,
            is_featured: prof.is_featured,
            hired_at: prof.hired_at ?? '',
        });
        setActiveTab('create-prof');
    };

    const handleSaveProf = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Slug
        const generatedSlug = profFormData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // 2. Validación
        const validated = professionalSchema.safeParse(profFormData);
        if (!validated.success) {
            const firstError =
                validated.error.issues[0]?.message || 'Verificá los datos del formulario';
            showNotification('error', firstError);
            return;
        }

        // 3. ¿Es edición? ¿Cambió la dirección?
        const isEdit = Boolean(editingProfId && originalProf);
        const addressChanged = isEdit
            ? originalProf!.address !== profFormData.address ||
              (originalProf!.neighborhood ?? '') !== (profFormData.neighborhood ?? '')
            : true;

        // 4. Si es edición, decidir hired_at ANTES del geocode.
        //    Armamos el payload base (sin lat/lng todavía).
        const baseData = {
            ...profFormData,
            slug: generatedSlug,
        };

        // Helper para continuar con el flujo una vez decidido hired_at.
        const continueWithHiredAt = async (hiredAt: string | null) => {
            const dataWithHiredAt = hiredAt ? { ...baseData, hired_at: hiredAt } : { ...baseData }; // si es null, NO mandamos hired_at (el backend no lo toca)

            await runGeocodeAndPersist(dataWithHiredAt, addressChanged);
        };

        // Si NO es edición, hired_at va por default (CURRENT_DATE en Postgres) → no preguntamos.
        if (!isEdit) {
            await continueWithHiredAt(null);
            return;
        }

        // Si es edición, abrimos modal de hired_at (la decisión se toma acá).
        setPendingHiredAtAction({
            formData: baseData,
            slug: generatedSlug,
            hiredAt: null,
            addressChanged, // <-- guardar
        });
        setShowHiredAtModal(true);
    };

    const runGeocodeAndPersist = async (
        data: typeof profFormData & { slug: string; hired_at?: string },
        addressChanged: boolean,
    ) => {
        // Si es edición y la dirección NO cambió → saltamos geocode por completo.
        if (!addressChanged) {
            await persistProf({
                ...data,
                lat: profFormData.lat,
                lng: profFormData.lng,
            });
            return;
        }

        // Geocode normal (solo si cambió la dirección o es alta nueva)
        let candidates: typeof geocodeCandidates = [];
        let query: typeof geocodeQuery = null;

        const fullAddress = [profFormData.address, profFormData.neighborhood]
            .map((s) => s?.trim())
            .filter(Boolean)
            .join(', ');

        if (fullAddress.length >= 5) {
            try {
                const geoRes = await fetch('/api/geocode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: fullAddress }),
                });
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    candidates = geoData.candidates ?? [];
                    query = geoData.query ?? null;
                }
            } catch (err) {
                console.error('Error geocodificando, se usan coordenadas actuales:', err);
            }
        }
        setGeocodeQuery(query);

        const buildFinalData = (lat: number, lng: number) => ({
            ...data,
            lat,
            lng,
        });

        if (candidates.length === 0) {
            await persistProf(buildFinalData(profFormData.lat, profFormData.lng));
            return;
        }
        if (candidates.length === 1) {
            await persistProf(buildFinalData(candidates[0].lat, candidates[0].lng));
            return;
        }

        // Varios → modal de geocode, arrastrando hired_at
        setGeocodeCandidates(candidates);
        setGeocodePendingAction({
            type: 'save',
            formData: data, // ya incluye hired_at si corresponde
            slug: data.slug,
        });
        setShowGeocodeModal(true);
    };

    // Función auxiliar que hace el guardado real
    const persistProf = async (finalData: any) => {
        // 1. Reemplazamos toast.loading por toast.custom
        const loadingId = toast.custom(
            () => (
                <div className='flex items-center gap-3 w-full shadow-lg font-sans'>
                    <Loader2 className='w-5 h-5 animate-spin text-neutral-500 shrink-0' />
                    <span className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
                        {editingProfId ? 'Actualizando profesional…' : 'Guardando profesional…'}
                    </span>
                </div>
            ),
            { duration: Infinity }, // Queda abierto hasta que lo cerremos
        );

        try {
            const wasEditing = Boolean(editingProfId);
            if (editingProfId) {
                await updateProfessional(editingProfId, finalData);
            } else {
                await addProfessional(finalData);
            }

            resetProfForm();
            await loadAllData();
            setActiveTab('list');

            toast.dismiss(loadingId);
            toast.success(
                wasEditing
                    ? `Profesional "${finalData.name}" actualizado.`
                    : `Nuevo profesional "${finalData.name}" registrado.`,
            );
        } catch (err: any) {
            console.error('🔴 [AdminDashboard] Error al guardar:', err.message);

            // 3. Cerramos el custom y mostramos el error
            toast.dismiss(loadingId);
            toast.error('No se pudo guardar el profesional.', {
                description: err?.message ?? 'Revisá los datos e intentá de nuevo.',
                duration: 8000,
            });
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
        setGeocodeQuery(null);
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
        setGeocodeQuery(null);
        showNotification('error', 'Elegí una dirección para continuar. No se guardó nada.');
    };

    const handleDeleteProf = (id: string, name: string) => {
        toast.custom(
            (t) => (
                <div className='flex flex-col gap-3 p-4 rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-lg w-full'>
                    <div>
                        <p className='text-sm font-bold text-neutral-900 dark:text-neutral-100'>
                            ¿Eliminar a &quot;{name}&quot;?
                        </p>
                        <p className='text-xs text-neutral-500 mt-0.5'>
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                    <div className='flex gap-2 justify-end'>
                        {/* Cancelar: ícono en mobile, texto en desktop */}
                        <button
                            onClick={() => toast.dismiss(t)}
                            className='inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg px-4 py-2 min-w-[88px] bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            aria-label='Cancelar'
                        >
                            <X className='w-4 h-4 sm:hidden' />
                            <span className='hidden sm:inline'>Cancelar</span>
                        </button>
                        {/* Eliminar: ícono en mobile, texto en desktop */}
                        <button
                            onClick={async () => {
                                toast.dismiss(t);
                                const loadingId = toast.loading('Eliminando profesional…');
                                try {
                                    await deleteProfessional(id);
                                    await loadAllData();
                                    toast.success(`Profesional "${name}" eliminado.`, {
                                        id: loadingId,
                                    });
                                } catch (err: any) {
                                    toast.error('No se pudo eliminar el profesional.', {
                                        id: loadingId,
                                        description:
                                            err?.message ?? 'Intentá de nuevo en unos segundos.',
                                        duration: 8000,
                                    });
                                }
                            }}
                            className='inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg px-4 py-2 min-w-[88px] bg-red-600 text-white'
                            aria-label='Eliminar'
                        >
                            <Check className='w-4 h-4 sm:hidden' />
                            <span className='hidden sm:inline'>Eliminar</span>
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity },
        );
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

    const handleDeleteArticle = (id: string, title: string) => {
        toast(`¿Eliminar artículo "${title}"?`, {
            description: 'Esta acción no se puede deshacer.',
            duration: Infinity,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    const t = toast.loading('Eliminando artículo…');
                    try {
                        await deleteArticle(id);
                        await loadAllData();
                        toast.success('Artículo eliminado.', { id: t });
                    } catch (err: any) {
                        console.error('Error eliminando artículo:', err);
                        toast.error('No se pudo eliminar el artículo.', {
                            id: t,
                            description: err?.message ?? 'Intentá de nuevo en unos segundos.',
                            duration: 8000,
                        });
                    }
                },
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => toast.dismiss(),
            },
        });
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

    const handleHiredAtKeepCurrent = async () => {
        if (!pendingHiredAtAction) return;
        setShowHiredAtModal(false);
        const action = pendingHiredAtAction;
        setPendingHiredAtAction(null);
        // hired_at === null → no se envía, el backend mantiene el actual
        await runGeocodeAndPersist(action.formData, action.addressChanged);
    };

    const handleHiredAtUseToday = async () => {
        if (!pendingHiredAtAction) return;
        setShowHiredAtModal(false);
        const action = pendingHiredAtAction;
        setPendingHiredAtAction(null);
        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
        await runGeocodeAndPersist({ ...action.formData, hired_at: today }, action.addressChanged);
    };

    const formatFecha = (iso: string | null | undefined) => {
        if (!iso) return '—';
        const [y, m, d] = iso.slice(0, 10).split('-');
        return `${d}/${m}/${y}`;
    };
    return (
        <div className='space-y-8'>
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
                                        <th className='p-4 text-center'>Fecha de alta</th>
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
                                                    <td className='p-4 text-center text-neutral-600 dark:text-neutral-300'>
                                                        {formatFecha(p.hired_at)}
                                                    </td>
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
                <ProfesionalForm
                    profFormData={profFormData}
                    setProfFormData={setProfFormData}
                    editingProfId={editingProfId}
                    onSubmit={handleSaveProf}
                    onCancelEdit={resetProfForm}
                    onCancel={() => setActiveTab('list')}
                    matriculaDebounceRef={matriculaDebounceRef}
                    matriculaStatus={matriculaStatus}
                    setMatriculaStatus={setMatriculaStatus}
                />
            )}

            {/* TAB 3: ARTICLES MANAGEMENT */}
            {activeTab === 'articles' && (
                <ArticlesManager
                    articleFormData={articleFormData}
                    setArticleFormData={setArticleFormData}
                    onSubmitArticle={handleCreateArticle}
                    articles={articles}
                    onDeleteArticle={handleDeleteArticle}
                    // opcionales si tenés los flags:
                    // isSubmittingArticle={isCreatingArticle}
                    // deletingArticleId={deletingArticleId}
                />
            )}

            {/* TAB 4: STATS & CATALOG MANAGEMENT */}
            {activeTab === 'stats' && (
                <StatsPanel
                    stats={{
                        totalViews: 12480,
                        totalContacts: 342,
                        totalFavorites: 89,
                    }}
                />
            )}

            {showHiredAtModal && pendingHiredAtAction && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                    <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-900'>
                        <h2 className='mb-2 text-lg font-bold'>Fecha de alta</h2>
                        <p className='mb-4 text-sm text-neutral-600 dark:text-neutral-300'>
                            Fecha de alta actual:{' '}
                            <strong>{formatFecha(originalProf?.hired_at ?? '')}</strong>
                            <br />
                            ¿Querés mantenerla o actualizarla a hoy (
                            {formatFecha(new Date().toISOString().slice(0, 10))})?
                        </p>
                        <div className='flex justify-end gap-2'>
                            <button
                                type='button'
                                onClick={handleHiredAtKeepCurrent}
                                className='rounded border px-4 py-2 text-sm'
                            >
                                Mantener actual
                            </button>
                            <button
                                type='button'
                                onClick={handleHiredAtUseToday}
                                className='rounded bg-blue-600 px-4 py-2 text-sm text-white'
                            >
                                Usar fecha de hoy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de selección de dirección (geocode) */}
            {showGeocodeModal && (
              <GeocodeModal
              isOpen={showGeocodeModal}
              address={profFormData.address}
              candidates={geocodeCandidates}
              onSelect={handleSelectCandidate}
              onCancel={handleCancelGeocodeModal}
            />
            )}
        </div>
    );
};
