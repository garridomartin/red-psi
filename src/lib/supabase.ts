import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

export const isSupabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder');

// Cliente público (para lecturas)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Cliente autenticado (para escrituras con JWT)
export function getAuthClient() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('red_epsilon_jwt') : null;

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

export function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Faltan variables de entorno de Supabase');
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
