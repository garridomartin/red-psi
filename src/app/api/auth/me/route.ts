//src\app\api\auth\me\route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Revalidar contra la DB (Opción simple): si borraron al user o le cambiaron el rol,
    // nos enteramos acá.
    const supabaseAdmin = getSupabaseAdmin();
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name, role, avatar_url')
        .eq('id', session.sub)
        .single();

    if (error || !user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    return NextResponse.json({ user });
}