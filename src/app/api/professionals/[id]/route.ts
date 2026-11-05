//src/app/api/professionals/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

const ALLOWED = [
    'name',
    'slug',
    'title',
    'license',
    'bio',
    'photo_url',
    'gender',
    'age',
    'birth_date',
    'specialties',
    'insurances',
    'modality',
    'address',
    'neighborhood',
    'city',
    'lat',
    'lng',
    'instagram_url',
    'contact_email',
    'contact_phone',
    'session_price',
    'approach',
    'example', // <-- AGREGAR
    'client_age',
    'is_active',
    'is_featured',
    'whatsapp_number',
];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    if (session.role !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const update: Record<string, unknown> = {};
        for (const key of ALLOWED) {
            if (key in body) update[key] = body[key];
        }
        if (Object.keys(update).length === 0) {
            return NextResponse.json({ error: 'No hay campos válidos' }, { status: 400 });
        }
        update.updated_at = new Date().toISOString();

        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('professionals')
            .update(update)
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('Error actualizando profesional:', error);
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        }
        if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        return NextResponse.json({ professional: data });
    } catch (err) {
        console.error('Error actualizando:', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    if (session.role !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // .select() + .single() nos permite detectar si el id no existía (404)
    const { data, error } = await supabaseAdmin
        .from('professionals')
        .delete()
        .eq('id', params.id)
        .select('id')
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned: el id no existe
            return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        }
        console.error('Error eliminando profesional:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, deleted: data.id });
}
