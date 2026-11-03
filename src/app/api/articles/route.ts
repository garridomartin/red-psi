//src/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

const ALLOWED = [
    'title',
    'slug',
    'cover_url',
    'excerpt',
    'content',
    'author',
    'author_role',
    'reading_time_minutes',
    'tags',
    'is_published',
    'published_at',
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

        // Obligatorios sin default en la DB
        const required = ['title', 'slug', 'cover_url', 'excerpt', 'content', 'author'];
        for (const field of required) {
            if (!insert[field] || typeof insert[field] !== 'string') {
                return NextResponse.json({ error: `Falta el campo: ${field}` }, { status: 400 });
            }
        }

        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('articles')
            .insert(insert)
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'Ya existe un artículo con ese slug' },
                    { status: 409 },
                );
            }
            console.error('Error creando artículo:', error);
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        }

        return NextResponse.json({ article: data }, { status: 201 });
    } catch (err) {
        console.error('Error creando artículo:', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}