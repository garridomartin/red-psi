//src/app/api/articles/[id]/route.ts
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
            .from('articles')
            .update(update)
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('Error actualizando artículo:', error);
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        }
        if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        return NextResponse.json({ article: data });
    } catch (err) {
        console.error('Error actualizando artículo:', err);
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
    const { data, error } = await supabaseAdmin
        .from('articles')
        .delete()
        .eq('id', params.id)
        .select('id')
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
        }
        console.error('Error eliminando artículo:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, deleted: data.id });
}