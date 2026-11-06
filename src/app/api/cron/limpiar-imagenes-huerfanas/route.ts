// src/app/api/cron/limpiar-imagenes-huerfanas/route.ts
import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    // Seguridad para Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const BUCKET = 'professionals-photos';

    try {
        // 1. Listar todos los archivos del bucket
        const { data: files, error: listError } = await supabase.storage
            .from(BUCKET)
            .list('', { limit: 10000 });

        if (listError) throw listError;
        if (!files || files.length === 0) {
            return Response.json({ success: true, deleted: 0, message: 'Bucket vacío' });
        }

        // 2. Traer todos los photo_url referenciados
        const { data: profs, error: dbError } = await supabase
            .from('professionals')
            .select('photo_url');

        if (dbError) throw dbError;

        // Extraer los nombres de archivo de las URLs (último segmento después del /)
        const usedFileNames = new Set(
            (profs || [])
                .map((p) => p.photo_url)
                .filter((url): url is string => !!url)
                .map((url) => url.split('/').pop())
                .filter(Boolean),
        );

        // 3. Filtrar los archivos huérfanos
        const orphanFiles = files
            .filter((f) => f.name && !usedFileNames.has(f.name))
            .map((f) => f.name);

        if (orphanFiles.length === 0) {
            return Response.json({ success: true, deleted: 0, message: 'No hay huérfanos' });
        }

        // 4. Borrar en lotes de 100 (límite de Supabase Storage)
        const BATCH = 100;
        let deleted = 0;
        for (let i = 0; i < orphanFiles.length; i += BATCH) {
            const batch = orphanFiles.slice(i, i + BATCH);
            const { error: delError } = await supabase.storage.from(BUCKET).remove(batch);
            if (delError) {
                console.error(
                    `[limpiar-imagenes] Error borrando lote ${i / BATCH}:`,
                    delError.message,
                );
                continue;
            }
            deleted += batch.length;
        }

        return Response.json({
            success: true,
            totalFiles: files.length,
            referenced: usedFileNames.size,
            orphansFound: orphanFiles.length,
            deleted,
        });
    } catch (err: any) {
        console.error('[limpiar-imagenes] Error:', err.message);
        return Response.json({ success: false, error: err.message }, { status: 500 });
    }
}
