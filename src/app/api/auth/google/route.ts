//red-psi\src\app\api\auth\google\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';
import { signSession, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/auth';

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

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

        // 1. Verificar ID token de Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return NextResponse.json({ error: 'Token de Google inválido' }, { status: 401 });
        }
        if (!payload.email_verified) {
            return NextResponse.json({ error: 'Email no verificado' }, { status: 401 });
        }

        const { email, sub: googleSub, name, picture } = payload;

        // 2. Upsert en public.users (igual que antes)
        let { data: user, error: findError } = await supabaseAdmin
            .from('users')
            .select('id, email, name, role, google_sub, avatar_url')
            .or(`google_sub.eq.${googleSub},email.eq.${email}`)
            .maybeSingle();

        if (findError) throw findError;

        if (!user) {
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
            const { data: updatedUser, error: updateError } = await supabaseAdmin
                .from('users')
                .update({ google_sub: googleSub, avatar_url: picture || user.avatar_url })
                .eq('id', user.id)
                .select()
                .single();
            if (updateError) throw updateError;
            user = updatedUser;
        }

        if (!user) {
            return NextResponse.json({ error: 'No se pudo obtener el usuario' }, { status: 500 });
        }

        // 3. Firmar JWT y setear cookie httpOnly
        const token = await signSession({ sub: user.id, role: user.role });

        const response = NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar_url: user.avatar_url,
            },
        });
        response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
        return response;
    } catch (err: any) {
        console.error('Error en /api/auth/google:', err);
        return NextResponse.json({ error: 'Error interno de autenticación' }, { status: 500 });
    }
}
