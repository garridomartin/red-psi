//src\lib\data\dataStore.ts
import { supabase } from '@/lib/supabase';
import { Professional, Article, ProfessionalFilters } from '@/types';
import { MOCK_PROFESSIONALS, MOCK_ARTICLES } from './mockData';

// ==========================================
// LECTURAS (públicas, van directo a Supabase)
// ==========================================
export async function getProfessionals(filters: ProfessionalFilters = {}): Promise<Professional[]> {
    let query = supabase.from('professionals').select('*').is('deleted_at', null); // Solo traemos los no eliminados

    // Solo activos (por defecto true, igual que hoy)
    query = query.eq('is_active', true);

    // Búsqueda de texto (nombre, bio o barrio)
    if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.trim();
        query = query.or(`name.ilike.%${q}%,bio.ilike.%${q}%,neighborhood.ilike.%${q}%`);
    }

    // Género
    if (filters.gender && filters.gender !== 'all') {
        query = query.eq('gender', filters.gender);
    }

    // Modalidad
    if (filters.modality && filters.modality !== 'all') {
        if (filters.modality === 'ambas') {
            query = query.eq('modality', 'ambas');
        } else {
            // Si pide "presencial", le mostramos los "presencial" y los "ambas"
            query = query.in('modality', [filters.modality, 'ambas']);
        }
    }

    // Especialidad (el array de la DB debe contener el valor)
    if (filters.specialty && filters.specialty !== 'all') {
        query = query.contains('specialties', [filters.specialty]);
    }

    // Obra social (el array de la DB debe contener el valor)
    if (filters.insurance && filters.insurance !== 'all') {
        query = query.contains('insurances', [filters.insurance]);
    }

    // Rango de edad del profesional
    if (filters.ageRange && filters.ageRange !== 'all') {
        if (filters.ageRange === '20-35') query = query.gte('age', 20).lte('age', 35);
        if (filters.ageRange === '36-49') query = query.gte('age', 36).lte('age', 49);
        if (filters.ageRange === '50+') query = query.gte('age', 50);
    }

    // Edad del paciente (client_age) - "overlaps" (&&) busca que compartan al menos un elemento
    if (filters.clientAge && filters.clientAge.length > 0) {
        query = query.overlaps('client_age', filters.clientAge);
    }

    // Ordenar por fecha de creación descendente por defecto
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching professionals:', error);
        return MOCK_PROFESSIONALS;
    }

    return data as Professional[];
}

export async function getProfessionalBySlug(slug: string): Promise<Professional | undefined> {
    const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error) {
        console.error('Error fetching professional:', error);
        return undefined;
    }
    return data as Professional;
}

// ==========================================
// GETS PROFESIONALES PARA ADMINS
// ==========================================
export async function getProfessionalsForAdmin(): Promise<Professional[]> {
    const res = await fetch('/api/professionals', {
        credentials: 'include',
    });
    if (!res.ok) {
        console.error('Error fetching professionals (admin):', res.status);
        return [];
    }
    const data = await res.json();
    return (data.professionals ?? []) as Professional[];
}

export async function getArticles(): Promise<Article[]> {
    const { data, error } = await supabase.from('articles').select('*');
    if (error) {
        console.error('Error fetching articles:', error);
        return MOCK_ARTICLES;
    }
    return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (error) {
        console.error('Error fetching article:', error);
        return undefined;
    }
    return data as Article;
}

// ==========================================
// PROFESIONALES (escrituras vía Route Handlers)
// ==========================================

export async function addProfessional(data: Omit<Professional, 'id'>) {
    const res = await fetch('/api/professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Error ${res.status} al crear`);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
    return body.professional;
}

export async function updateProfessional(id: string, data: Partial<Professional>) {
    const res = await fetch(`/api/professionals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Error ${res.status} al actualizar`);
    return body.professional;
}

export async function deleteProfessional(id: string) {
    const res = await fetch(`/api/professionals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Error ${res.status} al eliminar`);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function toggleFeaturedProfessional(id: string, currentValue: boolean) {
    const res = await fetch(`/api/professionals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_featured: !currentValue }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Error ${res.status} al actualizar`);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function toggleActiveProfessional(id: string, currentValue: boolean) {
    const res = await fetch(`/api/professionals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_active: !currentValue }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Error ${res.status} al actualizar`);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function updateProfessionalExample(id: string, exampleValue: 1 | 2 | null) {
    const res = await fetch(`/api/professionals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ example: exampleValue }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error actualizando ejemplo');
    }
    // Opcional: emitir el evento para refrescar listas si es necesario
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('red_epsilon_data_changed'));
    }
    return res.json();
}

// ==========================================
// ARTÍCULOS (escrituras — por ahora siguen con supabase anónimo)
// ==========================================
// NOTA: articles todavía no tiene Route Handlers propios. Estas tres funciones
// van a fallar si las RLS de `articles` exigen autenticación. Se migran a
// /api/articles en el próximo paso, igual que professionals.

export async function addArticle(data: Omit<Article, 'id'>) {
    const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Error ${res.status} al crear`);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
    return body.article;
}

export async function updateArticle(id: string, data: Partial<Article>) {
    const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Error ${res.status} al actualizar`);
    return body.article;
}

export async function deleteArticle(id: string) {
    const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Error ${res.status} al eliminar`);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

// ==========================================
// HELPERS LOCALES (Stats)
// ==========================================

export interface AppStats {
    totalViews: number;
    totalContacts: number;
    totalFavorites: number;
}

export function incrementContactCount(professionalId?: string) {
    if (typeof window === 'undefined') return;
    const stats: AppStats = JSON.parse(
        localStorage.getItem('red_epsilon_stats_v1') ||
            '{"totalViews":0,"totalContacts":0,"totalFavorites":0}',
    );
    stats.totalContacts = (stats.totalContacts || 0) + 1;
    localStorage.setItem('red_epsilon_stats_v1', JSON.stringify(stats));
}

export function getStats(): AppStats {
    if (typeof window === 'undefined')
        return { totalViews: 0, totalContacts: 0, totalFavorites: 0 };
    return JSON.parse(
        localStorage.getItem('red_epsilon_stats_v1') ||
            '{"totalViews":0,"totalContacts":0,"totalFavorites":0}',
    );
}
