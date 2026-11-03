import { z } from 'zod';

export const contactFormSchema = z.object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().email('Ingresá un correo electrónico válido'),
    phone: z.string().min(8, 'Ingresá un número de teléfono válido').optional().or(z.literal('')),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000),
    preferredModality: z.enum(['presencial', 'online', 'indistinto']).default('indistinto'),
    professionalId: z.string().optional(),
    // Honeypot field (must stay empty; if bots fill it, we block)
    website_trap: z.string().max(0, 'Bot detectado'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const professionalSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    title: z.string().min(3, 'El título profesional es requerido'),
    license: z.string().min(3, 'La matrícula es requerida (ej: 12345)'),
    bio: z.string().min(30, 'La descripción o bio debe tener al menos 30 caracteres'),
    photo_url: z.string().optional(),
    gender: z.enum(['femenino', 'masculino', 'no-binario', 'otro']),
    age: z.coerce.number().min(22, 'Edad mínima: 22').max(99, 'Edad máxima: 99'),
    specialties: z.array(z.string()).min(1, 'Seleccioná al menos una especialidad'),
    insurances: z.array(z.string()).min(1, 'Seleccioná al menos una opción o Particular'),
    modality: z.enum(['presencial', 'online', 'ambas']),
    address: z.string().min(5, 'Ingresá la dirección aproximada'),
    neighborhood: z.string().optional(),
    city: z.string().default('Buenos Aires'),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    instagram_url: z
        .string()
        .url('Debe ser una URL válida de Instagram (https://instagram.com/...)'),
    contact_email: z.string().email('Debe ser un email válido'),
    contact_phone: z.string().min(8, 'Ingresá un teléfono de contacto'),
    whatsapp_number: z.string().optional(),
    session_price: z.string().optional(),
    approach: z.string().optional(),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
});

export type ProfessionalFormData = z.infer<typeof professionalSchema>;

export const articleSchema = z.object({
    title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
    cover_url: z.string().url('Debe ser una URL de imagen válida'),
    excerpt: z.string().min(20, 'El resumen debe tener al menos 20 caracteres'),
    content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres'),
    author: z.string().min(3, 'El autor es requerido'),
    author_role: z.string().optional(),
    reading_time_minutes: z.coerce.number().min(1).max(60).default(5),
    tags: z.array(z.string()).default([]),
    is_published: z.boolean().default(true),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

export const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const maxImageSizeBytes = 5 * 1024 * 1024; // 5 MB
