import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

// Inicializamos Supabase con la Service Role Key para saltar RLS en el servidor.
// (NUNCA expongas esta key en el frontend, por eso no tiene NEXT_PUBLIC_).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // 👈 Ojo con esto

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
        }

        // 1. Convertir el archivo a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Convertir a AVIF usando sharp
        const avifBuffer = await sharp(buffer)
            .avif({ quality: 60 }) // Calidad 60 es un buen balance peso/calidad
            .toBuffer();

        // 3. Generar un nombre único para el archivo
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.avif`;

        // 4. Subir a Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from('professionals-photos')
            .upload(fileName, avifBuffer, {
                contentType: 'image/avif',
                upsert: false,
            });

        if (error) {
            console.error('Error subiendo a Supabase:', error);
            return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
        }

        // 5. Obtener la URL pública
        const { data: urlData } = supabaseAdmin.storage
            .from('professionals-photos')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: urlData.publicUrl });
    } catch (error) {
        console.error('Error procesando la imagen:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}