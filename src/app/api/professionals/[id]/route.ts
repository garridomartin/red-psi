import { NextRequest, NextResponse } from 'next/server';
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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        return NextResponse.json({ professional: data });
    } catch (err: any) {
        console.error('Error actualizando:', err);
        return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 });
    }
}
