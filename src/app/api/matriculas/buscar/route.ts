import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const matricula = searchParams.get('matricula');

    if (!matricula) {
        return Response.json({ error: 'Falta el parámetro matricula' }, { status: 400 });
    }

    // Normalizar: quitar puntos, espacios, guiones; dejar solo dígitos
    const matriculaNormalizada = matricula.replace(/\D/g, '');
    const matriculaQuery = Number(matriculaNormalizada); // Convierte "053794" a 53794 (número)
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
        .from('matriculas')
        .select('matricula, nombre')
        .eq('matricula', matriculaQuery) // Buscamos como número
        .single();

    if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (lo tratamos como "no encontrada")
        console.error('[matriculas/buscar] Error:', error.message);
        return Response.json({ error: 'Error interno' }, { status: 500 });
    }

    if (!data) {
        return Response.json({ found: false }, { status: 404 });
    }

    return Response.json({
        found: true,
        matricula: data.matricula,
        nombre: data.nombre,
    });
}
