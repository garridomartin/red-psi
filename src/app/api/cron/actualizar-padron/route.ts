import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos por seguridad para el lote grande

interface MatriculaRecord {
    matricula: string;
    nombre: string;
}

// Umbrales de integridad — ajustá según el padrón real
const MIN_HTML_BYTES = 100_000; // HTML sospechosamente chico = abortar
const MIN_RECORDS = 500; // menos registros que esto = abortar
const HTML_MARKER = '<table'; // marcador esperado del padrón

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

        // --- Validaciones de integridad ANTES de escribir ---
        if (html.length < MIN_HTML_BYTES) {
            throw new Error(
                `HTML demasiado corto (${html.length} bytes < ${MIN_HTML_BYTES}). Se aborta sin escribir.`,
            );
        }
        if (!html.toLowerCase().includes(HTML_MARKER)) {
            throw new Error(
                `HTML no contiene el marcador esperado "${HTML_MARKER}". Posible página de error. Se aborta sin escribir.`,
            );
        }

        const records = parsePadronHtml(html);
        console.log(
            `[cron/actualizar-padron] Registros parseados (Distrito XI): ${records.length}`,
        );

        if (records.length < MIN_RECORDS) {
            throw new Error(
                `Solo ${records.length} registros parseados (< ${MIN_RECORDS}). Se aborta sin escribir para no truncar el padrón.`,
            );
        }

        // --- Escritura atómica vía RPC ---
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin.rpc('replace_matriculas', {
            payload: records,
        });

        if (error) {
            throw new Error(`Error en replace_matriculas: ${error.message}`);
        }

        console.log(
            `[cron/actualizar-padron] Completado. ${data} registros guardados atómicamente.`,
        );
        return Response.json({
            success: true,
            totalParsed: records.length,
            totalUpserted: data,
        });
    } catch (error: any) {
        console.error('[cron/actualizar-padron] Error:', error.message);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
