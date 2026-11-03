//src\app\api\favorites\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

// GET: devuelve los IDs de los profesionales favoritos del usuario logueado
export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
        .from('favorites')
        .select('professional_id')
        .eq('user_id', session.sub);

    if (error) {
        console.error('Error leyendo favoritos:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }

    return NextResponse.json({
        favorites: data.map((f) => f.professional_id),
    });
}

// POST: agrega un favorito (body: { professionalId })
export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { professionalId } = await req.json();
    if (!professionalId || typeof professionalId !== 'string') {
        return NextResponse.json({ error: 'professionalId inválido' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Validar que el profesional existe y está activo (evita insertar basura)
    const { data: professional } = await supabaseAdmin
        .from('professionals')
        .select('id')
        .eq('id', professionalId)
        .eq('is_active', true)
        .maybeSingle();

    if (!professional) {
        return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
        .from('favorites')
        .insert({ user_id: session.sub, professional_id: professionalId });

    // Si ya existía, no es un error real (idempotente)
    if (error && error.code !== '23505') {
        console.error('Error insertando favorito:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}

// DELETE: quita un favorito (body: { professionalId })
export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { professionalId } = await req.json();
    if (!professionalId || typeof professionalId !== 'string') {
        return NextResponse.json({ error: 'professionalId inválido' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
        .from('favorites')
        .delete()
        .eq('user_id', session.sub)
        .eq('professional_id', professionalId);

    if (error) {
        console.error('Error borrando favorito:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
