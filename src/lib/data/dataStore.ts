import { createClient } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Professional, Article } from '@/types';
import { MOCK_PROFESSIONALS, MOCK_ARTICLES } from './mockData';

// ==========================================
// HELPER PARA ESCRITURAS (JWT Dinámico)
// ==========================================
function getSupabaseWithAuth() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('red_epsilon_jwt') : null;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!token) {
        console.warn(
            'No hay JWT en localStorage. Las escrituras fallarán si las RLS están activas.',
        );
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
    });
}

// ==========================================
// LECTURAS (Ya funcionan, no tocar)
// ==========================================
export async function getProfessionals(): Promise<Professional[]> {
    if (!isSupabaseConfigured) return MOCK_PROFESSIONALS;
    const { data, error } = await supabase.from('professionals').select('*');
    if (error) {
        console.error('Error fetching professionals:', error);
        return MOCK_PROFESSIONALS;
    }
    return data as Professional[];
}

export async function getProfessionalBySlug(slug: string): Promise<Professional | undefined> {
    if (!isSupabaseConfigured) return MOCK_PROFESSIONALS.find((p) => p.slug === slug);
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

export async function getArticles(): Promise<Article[]> {
    if (!isSupabaseConfigured) return MOCK_ARTICLES;
    const { data, error } = await supabase.from('articles').select('*');
    if (error) {
        console.error('Error fetching articles:', error);
        return MOCK_ARTICLES;
    }
    return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    if (!isSupabaseConfigured) return MOCK_ARTICLES.find((a) => a.slug === slug);
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (error) {
        console.error('Error fetching article:', error);
        return undefined;
    }
    return data as Article;
}

// ==========================================
// ESCRITURAS (Ahora van a Postgres)
// ==========================================

export async function addProfessional(data: Omit<Professional, 'id'>) {
    const authSupabase = getSupabaseWithAuth();
    const newId = `prof-${Date.now()}`;

    const { error } = await authSupabase.from('professionals').insert({
        ...data,
        id: newId,
    });

    if (error) throw new Error(error.message);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function updateProfessional(id: string, data: Partial<Professional>) {
    const authSupabase = getSupabaseWithAuth();
    const { error } = await authSupabase.from('professionals').update(data).eq('id', id);

    if (error) throw new Error(error.message);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function deleteProfessional(id: string) {
    const authSupabase = getSupabaseWithAuth();
    const { error } = await authSupabase.from('professionals').delete().eq('id', id);

    if (error) throw new Error(error.message);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function toggleFeaturedProfessional(id: string) {
    const authSupabase = getSupabaseWithAuth();
    const { data: prof, error: readError } = await authSupabase
        .from('professionals')
        .select('is_featured')
        .eq('id', id)
        .single();

    if (readError) throw new Error(readError.message);

    const { error } = await authSupabase
        .from('professionals')
        .update({ is_featured: !prof.is_featured })
        .eq('id', id);

    if (error) throw new Error(error.message);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function toggleActiveProfessional(id: string) {
    const authSupabase = getSupabaseWithAuth();
    const { data: prof, error: readError } = await authSupabase
        .from('professionals')
        .select('is_active')
        .eq('id', id)
        .single();

    if (readError) throw new Error(readError.message);

    const { error } = await authSupabase
        .from('professionals')
        .update({ is_active: !prof.is_active })
        .eq('id', id);

    if (error) throw new Error(error.message);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function addArticle(data: Omit<Article, 'id'>) {
    const authSupabase = getSupabaseWithAuth();
    const newId = `art-${Date.now()}`;

    const { error } = await authSupabase.from('articles').insert({
        ...data,
        id: newId,
    });

    if (error) throw new Error(error.message);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

export async function deleteArticle(id: string) {
    const authSupabase = getSupabaseWithAuth();
    const { error } = await authSupabase.from('articles').delete().eq('id', id);

    if (error) throw new Error(error.message);
    window.dispatchEvent(new Event('red_epsilon_data_changed'));
}

// Al final de src/lib/data/dataStore.ts

export interface AppStats {
    totalViews: number;
    totalContacts: number;
    totalFavorites: number;
}

export function incrementContactCount(professionalId?: string) {
    if (typeof window === 'undefined') return;
    // El professionalId no se usa para el contador global, pero lo aceptamos
    // para no romper la llamada desde ContactModal
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
