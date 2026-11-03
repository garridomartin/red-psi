import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const matricula = searchParams.get('matricula');

    if (!matricula) {
        return Response.json({ error: 'Falta el parámetro matricula' }, { status: 400 });
    }

    // Normalizar: quitar todo lo que no sea dígito y asegurar 6 dígitos con ceros a la izquierda ("3800" -> "003800")
    const digitos = matricula.replace(/\D/g, '');
    const matriculaQuery = digitos.padStart(6, '0'); // Mantiene el formato exacto de texto de la DB

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
        .from('matriculas')
        .select('matricula, nombre')
        .eq('matricula', matriculaQuery) // Buscamos como string formateado
        .single();

    if (error && error.code !== 'PGRST116') {
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
