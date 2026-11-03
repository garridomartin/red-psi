//src\lib\auth.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'red_epsilon_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('Falta JWT_SECRET en las variables de entorno');
    return new TextEncoder().encode(secret);
}

// Extendemos JWTPayload para que jose lo acepte sin quejarse
export interface SessionPayload extends JWTPayload {
    sub: string; // user.id
    role: string; // 'admin' | 'user'
}

export async function signSession(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') return null;
        return { sub: payload.sub, role: payload.role };
    } catch {
        return null;
    }
}

export async function getSession(): Promise<SessionPayload | null> {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySession(token);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
};
