import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

export const isSupabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// En dataStore.ts, helper:
function getSupabaseWithAuth() {
    const token = localStorage.getItem('red_epsilon_jwt');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    return createClient(supabaseUrl, token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        global: {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
    });
}

// Ejemplo en addProfessional:
export async function addProfessional(data: any) {
    const supabase = getSupabaseWithAuth();
    const { error } = await supabase.from('professionals').insert(data);
    if (error) throw error;
    // disparar evento de cambio, etc.
}
