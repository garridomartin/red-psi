//src/app/api/geocode/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();
        if (!address || typeof address !== 'string' || address.trim().length < 5) {
            return NextResponse.json({ error: 'Dirección inválida' }, { status: 400 });
        }

        // Georef: endpoint de normalización de direcciones
        // max=1 para traer solo el mejor resultado
        const url = `https://apis.datos.gob.ar/georef/api/v2.0/direcciones?direccion=${encodeURIComponent(
            address.trim(),
        )}&max=1`;

        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
            // Cacheamos 1 hora para no golpear la API en cada submit con la misma dirección
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error('Georef error status:', res.status);
            return NextResponse.json({ error: 'Error consultando Georef' }, { status: 502 });
        }

        const data = await res.json();

        // Georef devuelve { direcciones: [ { ubicacion: { lat, lon }, ... } ] }
        const first = data?.direcciones?.[0];
        if (!first?.ubicacion?.lat || !first?.ubicacion?.lon) {
            return NextResponse.json({ error: 'Dirección no encontrada' }, { status: 404 });
        }

        return NextResponse.json({
            lat: first.ubicacion.lat,
            lng: first.ubicacion.lon,
            normalized: first.nomenclatura || null, // opcional: nombre normalizado
        });
    } catch (err) {
        console.error('Error geocodificando:', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
