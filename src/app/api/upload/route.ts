import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import sharp from 'sharp';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs'; // sharp no funciona en edge
export const dynamic = 'force-dynamic';

const BUCKET = 'professionals-photos';
const MAX_INPUT_BYTES = 8 * 1024 * 1024; // 8 MB de entrada

function getAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    }
    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 });
        }
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
        }
        if (file.size > MAX_INPUT_BYTES) {
            return NextResponse.json(
                { error: 'Imagen demasiado grande (máx 8 MB)' },
                { status: 413 },
            );
        }

        const input = Buffer.from(await file.arrayBuffer());

        // rotate() respeta la orientación EXIF; resize evita pasar el límite de 256 KB
        const avif = await sharp(input)
            .rotate()
            .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
            .avif({ quality: 50 })
            .toBuffer();

        if (avif.length > 256 * 1024) {
            return NextResponse.json(
                {
                    error: `La imagen convertida pesa ${Math.round(avif.length / 1024)} KB (máx 256 KB)`,
                },
                { status: 413 },
            );
        }

        const fileName = `prof_${Date.now()}-${Math.random().toString(36).slice(2, 8)}.avif`;
        const supabaseAdmin = getAdmin();

        const body = new Blob([new Uint8Array(avif)], { type: 'image/avif' });

        const { error } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(fileName, body, { contentType: 'image/avif', upsert: false });

        if (error) {
            console.error('Error subiendo a Supabase:', error);
            return NextResponse.json({ error: `Storage: ${error.message}` }, { status: 500 });
        }

        const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);
        console.log('✅ [API Upload] URL pública generada:', data.publicUrl);
        return NextResponse.json({ url: data.publicUrl });
    } catch (err: any) {
        console.error('Error procesando imagen:', err);
        return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 });
    }
}

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
            return NextResponse.json(
                { error: 'No hay campos válidos para actualizar' },
                { status: 400 },
            );
        }
        update.updated_at = new Date().toISOString();

        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('professionals')
            .update(update)
            .eq('id', params.id)
            .select()
            .single();

        console.log('🔎 [api/professionals] update', {
            id: params.id,
            campos: Object.keys(update),
            error,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        if (!data) {
            return NextResponse.json({ error: 'Profesional no encontrado' }, { status: 404 });
        }
        return NextResponse.json({ professional: data });
    } catch (err: any) {
        console.error('Error actualizando profesional:', err);
        return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 });
    }
}
