import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos por seguridad para el lote grande

interface MatriculaRecord {
    matricula: string;
    nombre: string;
}

function parsePadronHtml(html: string): MatriculaRecord[] {
    const records: MatriculaRecord[] = [];
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch: RegExpExecArray | null;

    while ((trMatch = trRegex.exec(html)) !== null) {
        const rowHtml = trMatch[1];
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        const cells: string[] = [];
        let tdMatch: RegExpExecArray | null;

        while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
            const text = tdMatch[1]
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/gi, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            cells.push(text);
        }

        if (cells.length >= 3) {
            const matriculaRaw = cells[0];
            const nombre = cells[1];
            const distritoRaw = cells[2];

            const isDistritoXI = /^XI\b/i.test(distritoRaw);

            if (isDistritoXI) {
                // Normalización a 6 dígitos (alineada con el buscador)
                const digitosMatricula = matriculaRaw.replace(/^MP-/i, '').replace(/\D/g, '');
                const matriculaLimpia = digitosMatricula.padStart(6, '0');

                if (matriculaLimpia && nombre) {
                    records.push({
                        matricula: matriculaLimpia,
                        nombre: nombre,
                    });
                }
            }
        }
    }

    // Deduplicar por matrícula
    const map = new Map<string, MatriculaRecord>();
    for (const r of records) {
        map.set(r.matricula, r);
    }

    return Array.from(map.values());
}

export async function GET(request: NextRequest) {
    // Seguridad para Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        console.log('[cron/actualizar-padron] Iniciando descarga del padrón...');

        const response = await fetch('https://colpsiba.com.ar/pad/mtr.php', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; RedEpsilonBot/1.0)',
                Accept: 'text/html,application/xhtml+xml',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Fetch falló con status ${response.status}`);
        }

        const html = await response.text();
        console.log(`[cron/actualizar-padron] HTML recibido: ${html.length} bytes`);

        const records = parsePadronHtml(html);
        console.log(
            `[cron/actualizar-padron] Registros parseados (Distrito XI): ${records.length}`,
        );

        if (records.length === 0) {
            console.warn('[cron/actualizar-padron] No se parsearon registros del Distrito XI.');
            return Response.json({
                success: false,
                message: 'No se parsearon registros. Revisar estructura del HTML.',
                htmlLength: html.length,
            });
        }

        const supabaseAdmin = getSupabaseAdmin();
        const BATCH_SIZE = 1000;
        let inserted = 0;

        for (let i = 0; i < records.length; i += BATCH_SIZE) {
            const batch = records.slice(i, i + BATCH_SIZE);
            const { error } = await supabaseAdmin.from('matriculas').upsert(
                batch.map((r) => ({
                    matricula: r.matricula,
                    nombre: r.nombre,
                })),
                { onConflict: 'matricula', ignoreDuplicates: false },
            );

            if (error) {
                throw new Error(`Error en upsert lote ${i / BATCH_SIZE}: ${error.message}`);
            }

            inserted += batch.length;
        }

        console.log(
            `[cron/actualizar-padron] Completado. ${inserted} registros guardados en Supabase.`,
        );
        return Response.json({
            success: true,
            totalParsed: records.length,
            totalUpserted: inserted,
        });
    } catch (error: any) {
        console.error('[cron/actualizar-padron] Error:', error.message);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
