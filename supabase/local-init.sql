-- ============================================
-- STUBS PARA SIMULAR SUPABASE EN LOCAL
-- ============================================
CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULL::uuid;
$$;

CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
  SELECT '{}'::jsonb;
$$;

-- ============================================
-- RESTO DEL SCHEMA (tu supabase.sql)
-- ============================================
-- ==============================================================================
-- RED ÉPSILON - ESQUEMA DE BASE DE DATOS POSTGRESQL / SUPABASE
-- ==============================================================================

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Catálogo de Especialidades
CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Catálogo de Obras Sociales y Prepagas
CREATE TABLE IF NOT EXISTS public.insurances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'prepaga' CHECK (category IN ('prepaga', 'obra-social', 'particular')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Profesionales
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    license TEXT,
    bio TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('femenino', 'masculino', 'no-binario', 'otro')),
    age INTEGER NOT NULL CHECK (age >= 20 AND age <= 100),
    birth_date DATE,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    insurances TEXT[] NOT NULL DEFAULT '{}',
    modality TEXT NOT NULL CHECK (modality IN ('presencial', 'online', 'ambas')),
    address TEXT NOT NULL,
    neighborhood TEXT,
    city TEXT DEFAULT 'Buenos Aires',
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    instagram_url TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    session_price TEXT,
    approach TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    views_count INTEGER NOT NULL DEFAULT 0,
    contacts_count INTEGER NOT NULL DEFAULT 0,
    whatsapp_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Favoritos (PK Compuesta user_id, professional_id)
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, professional_id)
);

-- 6. Tabla de Artículos de Interés
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_url TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT,
    reading_time_minutes INTEGER NOT NULL DEFAULT 5,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Registro de Derivaciones y Contactos (Con rate-limiting / métricas)
CREATE TABLE IF NOT EXISTS public.contact_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_phone TEXT,
    message TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email')),
    ip_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ÍNDICES PARA BÚSQUEDA Y RENDIMIENTO
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_professionals_slug ON public.professionals(slug);
CREATE INDEX IF NOT EXISTS idx_professionals_is_featured ON public.professionals(is_featured);
CREATE INDEX IF NOT EXISTS idx_professionals_is_active ON public.professionals(is_active);
CREATE INDEX IF NOT EXISTS idx_professionals_lat_lng ON public.professionals(lat, lng);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_logs ENABLE ROW LEVEL SECURITY;

-- Reglas Públicas de Lectura
CREATE POLICY "Lectura pública de profesionales activos" ON public.professionals
    FOR SELECT USING (is_active = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Lectura pública de especialidades" ON public.specialties
    FOR SELECT USING (true);

CREATE POLICY "Lectura pública de obras sociales" ON public.insurances
    FOR SELECT USING (true);

CREATE POLICY "Lectura pública de artículos publicados" ON public.articles
    FOR SELECT USING (is_published = true OR auth.jwt() ->> 'role' = 'admin');

-- Reglas de Favoritos por Usuario
CREATE POLICY "Usuarios pueden ver sus propios favoritos" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios favoritos" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios favoritos" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Reglas de Escritura de Administrador
CREATE POLICY "Admin tiene control total de profesionales" ON public.professionals
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin tiene control total de artículos" ON public.articles
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin tiene control total de especialidades" ON public.specialties
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin tiene control total de obras sociales" ON public.insurances
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Cualquiera puede registrar un intento de contacto" ON public.contact_logs
    FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- CONFIGURACIÓN DE STORAGE BUCKET PARA FOTOS
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('professionals-photos', 'professionals-photos', true);
-- CREATE POLICY "Lectura publica de fotos" ON storage.objects FOR SELECT USING (bucket_id = 'professionals-photos');
-- CREATE POLICY "Subida de fotos por admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'professionals-photos' AND auth.jwt() ->> 'role' = 'admin');
