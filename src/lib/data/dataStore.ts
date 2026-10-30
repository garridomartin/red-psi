import { Professional, Specialty, Insurance, Article } from '@/types';
import {
    MOCK_PROFESSIONALS,
    SPECIALTIES_CATALOG,
    INSURANCES_CATALOG,
    MOCK_ARTICLES,
} from './mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const PROFESSIONALS_STORAGE_KEY = 'red_epsilon_professionals_v1';
const ARTICLES_STORAGE_KEY = 'red_epsilon_articles_v1';
const FAVORITES_STORAGE_KEY = 'red_epsilon_favorites_v1';
const STATS_STORAGE_KEY = 'red_epsilon_stats_v1';

export interface AppStats {
    totalViews: number;
    totalContacts: number;
    totalFavorites: number;
    topContactedId?: string;
}

// In-memory fallback (para escrituras del admin y stats)
let inMemoryProfessionals = [...MOCK_PROFESSIONALS];
let inMemoryArticles = [...MOCK_ARTICLES];
let inMemoryStats: AppStats = {
    totalViews: 1420,
    totalContacts: 382,
    totalFavorites: 519,
};

// ============================================================
// LECTURAS: Supabase si está configurado, si no mocks
// ============================================================

export async function getProfessionals(): Promise<Professional[]> {
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase
                .from('professionals')
                .select('*')
                .eq('is_active', true)
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false });
            if (error) {
                console.warn('[dataStore] getProfessionals fallo:', error.message);
                return MOCK_PROFESSIONALS;
            }
            return (data ?? []) as Professional[];
        } catch (e) {
            console.warn('[dataStore] getProfessionals excepción:', e);
            return MOCK_PROFESSIONALS;
        }
    }
    // Fallback: localStorage / memory
    if (typeof window === 'undefined') return inMemoryProfessionals;
    try {
        const raw = localStorage.getItem(PROFESSIONALS_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(PROFESSIONALS_STORAGE_KEY, JSON.stringify(MOCK_PROFESSIONALS));
            return MOCK_PROFESSIONALS;
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : MOCK_PROFESSIONALS;
    } catch {
        return inMemoryProfessionals;
    }
}

export async function getProfessionalBySlug(slug: string): Promise<Professional | undefined> {
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase
                .from('professionals')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .maybeSingle();
            if (error) {
                console.warn('[dataStore] getProfessionalBySlug fallo:', error.message);
                return MOCK_PROFESSIONALS.find((p) => p.slug === slug);
            }
            return (data ?? undefined) as Professional | undefined;
        } catch (e) {
            console.warn('[dataStore] getProfessionalBySlug excepción:', e);
            return MOCK_PROFESSIONALS.find((p) => p.slug === slug);
        }
    }
    const list = await getProfessionals();
    return list.find((p) => p.slug === slug);
}

export async function getArticles(): Promise<Article[]> {
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });
            if (error) {
                console.warn('[dataStore] getArticles fallo:', error.message);
                return MOCK_ARTICLES;
            }
            return (data ?? []) as Article[];
        } catch (e) {
            console.warn('[dataStore] getArticles excepción:', e);
            return MOCK_ARTICLES;
        }
    }
    if (typeof window === 'undefined') return inMemoryArticles;
    try {
        const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(MOCK_ARTICLES));
            return MOCK_ARTICLES;
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : MOCK_ARTICLES;
    } catch {
        return inMemoryArticles;
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .maybeSingle();
            if (error) {
                console.warn('[dataStore] getArticleBySlug fallo:', error.message);
                return MOCK_ARTICLES.find((a) => a.slug === slug);
            }
            return (data ?? undefined) as Article | undefined;
        } catch (e) {
            console.warn('[dataStore] getArticleBySlug excepción:', e);
            return MOCK_ARTICLES.find((a) => a.slug === slug);
        }
    }
    const list = await getArticles();
    return list.find((a) => a.slug === slug);
}

// ============================================================
// ESCRITURAS: se quedan en localStorage por ahora
// (se migran a Supabase cuando haya auth real con rol admin)
// ============================================================

export function saveProfessionals(list: Professional[]): void {
    inMemoryProfessionals = list;
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(PROFESSIONALS_STORAGE_KEY, JSON.stringify(list));
            window.dispatchEvent(new Event('red_epsilon_data_changed'));
        } catch (e) {
            console.warn('Error saving professionals to localStorage:', e);
        }
    }
}

export function addProfessional(
    data: Omit<Professional, 'id' | 'created_at' | 'updated_at'>,
): Professional {
    const current = inMemoryProfessionals;
    const newProf: Professional = {
        ...data,
        id: `prof-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    saveProfessionals([newProf, ...current]);
    return newProf;
}

export function updateProfessional(
    id: string,
    updates: Partial<Professional>,
): Professional | null {
    const current = inMemoryProfessionals;
    const index = current.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updatedProf = { ...current[index], ...updates, updated_at: new Date().toISOString() };
    current[index] = updatedProf;
    saveProfessionals([...current]);
    return updatedProf;
}

export function deleteProfessional(id: string): boolean {
    const current = inMemoryProfessionals;
    const filtered = current.filter((p) => p.id !== id);
    if (filtered.length === current.length) return false;
    saveProfessionals(filtered);
    return true;
}

export function toggleFeaturedProfessional(id: string): boolean {
    const current = inMemoryProfessionals;
    const p = current.find((item) => item.id === id);
    if (!p) return false;
    p.is_featured = !p.is_featured;
    saveProfessionals([...current]);
    return true;
}

export function toggleActiveProfessional(id: string): boolean {
    const current = inMemoryProfessionals;
    const p = current.find((item) => item.id === id);
    if (!p) return false;
    p.is_active = !p.is_active;
    saveProfessionals([...current]);
    return true;
}

export function saveArticles(list: Article[]): void {
    inMemoryArticles = list;
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(list));
            window.dispatchEvent(new Event('red_epsilon_data_changed'));
        } catch (e) {
            console.warn('Error saving articles to localStorage:', e);
        }
    }
}

export function addArticle(data: Omit<Article, 'id' | 'published_at'>): Article {
    const current = inMemoryArticles;
    const newArt: Article = {
        ...data,
        id: `art-${Date.now()}`,
        published_at: new Date().toISOString(),
    };
    saveArticles([newArt, ...current]);
    return newArt;
}

export function deleteArticle(id: string): boolean {
    const current = inMemoryArticles;
    const filtered = current.filter((a) => a.id !== id);
    if (filtered.length === current.length) return false;
    saveArticles(filtered);
    return true;
}

// ============================================================
// STATS (localStorage, por ahora)
// ============================================================

export function incrementContactCount(professionalId?: string): void {
    if (typeof window !== 'undefined') {
        try {
            const stats = getStats();
            stats.totalContacts += 1;
            localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
        } catch {}
    }
}

export function getStats(): AppStats {
    if (typeof window === 'undefined') return inMemoryStats;
    try {
        const raw = localStorage.getItem(STATS_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(inMemoryStats));
            return inMemoryStats;
        }
        return JSON.parse(raw);
    } catch {
        return inMemoryStats;
    }
}
