//src/app/api/professionals/route.ts
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
    'is_active',
    'is_featured',
    'whatsapp_number',
];

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    if (session.role !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const insert: Record<string, unknown> = {};
        for (const key of ALLOWED) {
            if (key in body) insert[key] = body[key];
        }

        if (!insert.name || typeof insert.name !== 'string') {
            return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 });
        }
        if (!insert.slug || typeof insert.slug !== 'string') {
            return NextResponse.json({ error: 'Falta el slug' }, { status: 400 });
        }

        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('professionals')
            .insert(insert)
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'Ya existe un profesional con ese slug' },
                    { status: 409 },
                );
            }
            console.error('Error creando profesional:', error);
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        }

        return NextResponse.json({ professional: data }, { status: 201 });
    } catch (err) {
        console.error('Error creando profesional:', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    if (session.role !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error leyendo profesionales (admin):', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }

    return NextResponse.json({ professionals: data });
}
