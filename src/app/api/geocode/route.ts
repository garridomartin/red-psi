// src/app/api/geocode/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Provincia mockeada (pedido: siempre Buenos Aires)
const MOCK_PROVINCIA = 'Buenos Aires';

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();
        if (!address || typeof address !== 'string' || address.trim().length < 5) {
            return NextResponse.json({ error: 'Dirección inválida' }, { status: 400 });
        }

        // Parseo simple: "Calle 12 esquina Calle 55, La Plata"
        // -> direccion: "Calle 12 esquina Calle 55"
        // -> localidad_censal: "La Plata"
        // -> provincia: "Buenos Aires" (mockeada)
        const parts = address
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const direccion = parts[0] ?? address.trim();
        const localidadCensal = parts[1] ?? null;
        const provincia = MOCK_PROVINCIA;

        const params = new URLSearchParams({
            direccion,
            provincia,
            max: '10',
        });
        if (localidadCensal) {
            params.set('localidad_censal', localidadCensal);
        }

        const url = `https://apis.datos.gob.ar/georef/api/v2.0/direcciones?${params.toString()}`;

        // Guardamos el query para devolverlo y poder debuggear desde /prueba
        const query = {
            direccion,
            localidad_censal: localidadCensal,
            provincia,
        };

        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Error consultando Georef', query, url },
                { status: 502 },
            );
        }

        const data = await res.json();
        const direcciones: any[] = data?.direcciones ?? [];

        // Filtrar solo los que tienen coordenadas
        const withCoords = direcciones
            .filter((d) => d?.ubicacion?.lat != null && d?.ubicacion?.lon != null)
            .map((d) => ({
                lat: d.ubicacion.lat,
                lng: d.ubicacion.lon,
                label: d.nomenclatura,
                localidad: d.localidad?.nombre || null,
                localidadCensal: d.localidad_censal?.nombre || null,
                departamento: d.departamento?.nombre || null,
                provincia: d.provincia?.nombre || null,
            }));

        if (withCoords.length === 0) {
            return NextResponse.json(
                {
                    error: 'Dirección encontrada pero sin coordenadas disponibles',
                    query,
                    totalGeoref: direcciones.length,
                },
                { status: 404 },
            );
        }

        return NextResponse.json({
            candidates: withCoords,
            // Compatibilidad: el primero como "default" por si el front no usa el dropdown
            lat: withCoords[0].lat,
            lng: withCoords[0].lng,
            normalized: withCoords[0].label,
            // Info de debug: qué se le mandó a Georef
            query,
        });
    } catch (err) {
        console.error('Error geocodificando:', err);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
