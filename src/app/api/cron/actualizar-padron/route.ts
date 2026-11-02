import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Forzar runtime Node.js (sharp/cheerio no corren en Edge)
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutos (Vercel Pro) o 60s en Hobby

// ==========================================
// Parser del HTML del padrón de COLPSIBA
// ==========================================
// El HTML de mtr.php típicamente contiene filas de tabla o bloques
// con la matrícula y el nombre. Este parser es tolerante:
// busca patrones "matrícula" seguido de número y "nombre" seguido de texto.
//
// ⚠️ IMPORTANTE: Si el HTML real tiene otra estructura, este regex
// debe ajustarse. Podés inspeccionar el HTML en el navegador y
// pasarme un fragmento para afinarlo.

interface MatriculaRecord {
    matricula: string;
    nombre: string;
}

// Distrito objetivo
const DISTRITO_OBJETIVO = 'XI';

function parsePadronHtml(html: string): MatriculaRecord[] {
    const records: MatriculaRecord[] = [];

    // Buscar filas de tabla
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch: RegExpExecArray | null;

    while ((trMatch = trRegex.exec(html)) !== null) {
        const rowHtml = trMatch[1];

        // Extraer celdas de la fila
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        const cells: string[] = [];
        let tdMatch: RegExpExecArray | null;

        while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
            const text = tdMatch[1]
                .replace(/<[^>]+>/g, ' ')
                .replace(/&nbsp;/gi, ' ')
                .replace(/&amp;/gi, '&')
                .replace(/&aacute;/gi, 'á')
                .replace(/&eacute;/gi, 'é')
                .replace(/&iacute;/gi, 'í')
                .replace(/&oacute;/gi, 'ó')
                .replace(/&uacute;/gi, 'ú')
                .replace(/&ntilde;/gi, 'ñ')
                .replace(/\s+/g, ' ')
                .trim();
            cells.push(text);
        }

        // Necesitamos al menos 3 columnas: Matrícula, Profesional, Distrito
        if (cells.length < 3) continue;

        // Estrategia: buscar la celda que sea solo dígitos (matrícula)
        // y la celda que contenga "XI" o "Distrito XI" (distrito)
        const matriculaCell = cells.find((c) => /^\d{1,6}$/.test(c));
        const distritoCell = cells.find((c) =>
            new RegExp(`(^|\\s)${DISTRITO_OBJETIVO}(\\s|$)`, 'i').test(c),
        );
        const nombreCell = cells.find(
            (c) => c.length > 3 && /[a-záéíóúñ]/i.test(c) && !/^\d+$/.test(c) && c !== distritoCell,
        );

        // Solo guardamos si encontramos las tres cosas y el distrito es XI
        if (matriculaCell && nombreCell && distritoCell) {
            // Verificación extra: que el distrito sea exactamente XI (no XII, XIII, XIV, XV)
            const distritoLimpio = distritoCell
                .replace(/distrito/i, '')
                .trim()
                .toUpperCase();
            if (distritoLimpio === 'XI') {
                records.push({
                    matricula: matriculaCell.padStart(6, '0'),
                    nombre: nombreCell,
                });
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

// ==========================================
// Handler del Cron
// ==========================================
export async function GET(request: NextRequest) {
    // 1. Verificar CRON_SECRET (Vercel lo envía automáticamente)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        console.log('[cron/actualizar-padron] Iniciando descarga del padrón...');

        // 2. Fetch al padrón de COLPSIBA
        const response = await fetch('https://colpsiba.com.ar/pad/mtr.php', {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (compatible; RedEpsilonBot/1.0; +https://tu-dominio.com)',
                Accept: 'text/html,application/xhtml+xml',
            },
            // No cachear: queremos datos frescos
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Fetch falló con status ${response.status}`);
        }

        const html = await response.text();
        console.log(`[cron/actualizar-padron] HTML recibido: ${html.length} bytes`);

        // 3. Parsear
        const records = parsePadronHtml(html);
        console.log(`[cron/actualizar-padron] Registros parseados: ${records.length}`);

        if (records.length === 0) {
            // No lanzamos error para no romper el cron; logueamos y salimos
            console.warn(
                '[cron/actualizar-padron] No se parsearon registros. Revisar estructura del HTML.',
            );
            return Response.json({
                success: false,
                message: 'No se parsearon registros. Revisar estructura del HTML.',
                htmlLength: html.length,
            });
        }

        // 4. Upsert en Supabase (service_role bypassea RLS)
        const supabaseAdmin = getSupabaseAdmin();

        // Hacemos upsert en lotes de 1000 para no exceder límites
        const BATCH_SIZE = 1000;
        let inserted = 0;

        for (let i = 0; i < records.length; i += BATCH_SIZE) {
            const batch = records.slice(i, i + BATCH_SIZE);

            const { error } = await supabaseAdmin.from('matriculas').upsert(
                batch.map((r) => ({
                    matricula: r.matricula,
                    nombre: r.nombre,
                })),
                {
                    onConflict: 'matricula',
                    ignoreDuplicates: false, // actualizar nombre si cambió
                },
            );

            if (error) {
                throw new Error(`Error en upsert lote ${i / BATCH_SIZE}: ${error.message}`);
            }

            inserted += batch.length;
            console.log(
                `[cron/actualizar-padron] Lote ${i / BATCH_SIZE + 1} OK (${inserted}/${records.length})`,
            );
        }

        console.log(`[cron/actualizar-padron] Completado. ${inserted} registros upserted.`);

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
