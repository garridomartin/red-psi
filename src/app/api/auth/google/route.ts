import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

// Cliente de Supabase con permisos de administrador (service_role)
// Esto saltea RLS y nos permite hacer upsert en public.users
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
    try {
        const { credential } = await req.json();
        if (!credential) {
            return NextResponse.json({ error: 'Token de Google faltante' }, { status: 400 });
        }

        // 1. Verificar el ID Token de Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return NextResponse.json({ error: 'Token de Google inválido' }, { status: 401 });
        }

        const { email, sub: googleSub, name, picture } = payload;

        // 2. Buscar o crear usuario en public.users usando el cliente admin
        let { data: user, error: findError } = await supabaseAdmin
            .from('users')
            .select('id, email, name, role, google_sub, avatar_url')
            .or(`google_sub.eq.${googleSub},email.eq.${email}`)
            .maybeSingle();

        if (findError) throw findError;

        if (!user) {
            // Crear usuario nuevo como 'user'
            const { data: newUser, error: insertError } = await supabaseAdmin
                .from('users')
                .insert({
                    email,
                    name: name || email.split('@')[0],
                    avatar_url: picture || null,
                    role: 'user',
                    google_sub: googleSub,
                })
                .select()
                .single();

            if (insertError) throw insertError;
            user = newUser;
        } else if (!user.google_sub) {
            // Usuario existente (como Natalia) sin google_sub: actualizarlo
            const { data: updatedUser, error: updateError } = await supabaseAdmin
                .from('users')
                .update({ google_sub: googleSub, avatar_url: picture || user.avatar_url })
                .eq('id', user.id)
                .select()
                .single();

            if (updateError) throw updateError;
            user = updatedUser;
        }

        // 👇 SOLUCIÓN AL ERROR DE TYPESCRIPT
        // Verificamos explícitamente que user no sea null antes de usarlo.
        if (!user) {
            return NextResponse.json({ error: 'No se pudo obtener el usuario' }, { status: 500 });
        }

        // 3. Devolver los datos del usuario al frontend (SIN firmar JWT propio)
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar_url: user.avatar_url, // 👈 Agregado para que el frontend tenga la foto
            },
        });
    } catch (err: any) {
        console.error('Error en /api/auth/google:', err);
        return NextResponse.json(
            { error: err.message || 'Error interno de autenticación' },
            { status: 500 },
        );
    }
}
