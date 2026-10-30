import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { SignJWT } from 'jose';
import { createClient } from '@supabase/supabase-js';

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

// Cliente Supabase con rol de servicio (para bypasear RLS al buscar/crear usuarios)
// Usamos la anon key porque en local las policies de users son públicas para SELECT
// Para INSERT de usuarios nuevos, PostgREST necesita un rol que pueda escribir.
// Como en local no hay service_role, usamos el JWT de admin hardcodeado temporalmente
// o directamente el secret de PostgREST para firmar un JWT efímero con role:"admin".
// Para simplificar en local: firmamos un JWT interno con role:"admin" y lo usamos para el upsert.

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

    // 2. Buscar o crear usuario en public.users
    // Para escribir en users necesitamos un JWT con role:"admin" (porque no hay service_role en local)
    // Firmamos un JWT efímero solo para esta operación interna
    const internalAdminToken = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1m')
      .sign(jwtSecret);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabase = createClient(supabaseUrl, internalAdminToken, {
      global: { headers: { Authorization: `Bearer ${internalAdminToken}` } },
    });

    // Buscar por google_sub o por email
    let { data: user, error: findError } = await supabase
      .from('users')
      .select('id, email, name, role, google_sub')
      .or(`google_sub.eq.${googleSub},email.eq.${email}`)
      .maybeSingle();

    if (findError) throw findError;

    if (!user) {
      // Crear usuario nuevo como 'user'
      const { data: newUser, error: insertError } = await supabase
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
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ google_sub: googleSub, avatar_url: picture || user.avatar_url })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      user = updatedUser;
    }

    // 3. Firmar el JWT final para el usuario (con su role real y sub = user.id)
    const token = await new SignJWT({
      role: user.role,           // "admin" para Natalia, "user" para el resto
      sub: user.id,              // UUID de public.users → auth.uid() en PostgREST
      email: user.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')    // sesión válida por 7 días
      .sign(jwtSecret);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Error en /api/auth/google:', err);
    return NextResponse.json(
      { error: err.message || 'Error interno de autenticación' },
      { status: 500 }
    );
  }
}