export type Modality = 'presencial' | 'online' | 'ambas';

export type Gender = 'femenino' | 'masculino' | 'no-binario' | 'otro';

export type UserRole = 'user' | 'admin';

export type ClientAge = 'ninos' | 'adolescentes' | 'jovenes' | 'adultos' | 'adultos-mayores';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    role: UserRole;
    created_at: string;
}

export interface Specialty {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface Insurance {
    id: string;
    name: string;
    slug: string;
    category?: 'prepaga' | 'obra-social' | 'particular';
}

export interface Professional {
    id: string;
    name: string;
    slug: string;
    title?: string;
    license?: string;
    bio: string;
    photo_url: string;
    gender: Gender;
    age: number;
    birth_date?: string;
    specialties: string[];
    insurances: string[];
    modality: Modality;
    address: string;
    neighborhood?: string;
    city?: string;
    lat: number;
    lng: number;
    instagram_url: string;
    contact_email: string;
    contact_phone: string;
    whatsapp_number?: string;
    is_active: boolean;
    is_featured: boolean;
    session_price?: string;
    approach?: string; // e.g. "Cognitivo-Conductual", "Psicoanalítico"
    client_age?: ClientAge[];
    example: 1 | 2 | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface ProfessionalFilters {
    searchQuery?: string;
    gender?: 'all' | 'femenino' | 'masculino' | 'no-binario' | 'otro';
    ageRange?: 'all' | '20-35' | '36-49' | '50+';
    specialty?: string;
    insurance?: string;
    modality?: 'all' | 'presencial' | 'online' | 'ambas';
    clientAge?: ClientAge[];
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    cover_url: string;
    excerpt: string;
    content: string;
    author: string;
    author_role?: string;
    reading_time_minutes: number;
    tags: string[];
    published_at?: string;
    created_at?: string; // <-- Por las dudas
    updated_at?: string;
    is_published: boolean;
    deleted_at?: string;
}

export interface FilterState {
    searchQuery: string;
    gender: string;
    ageRange: string; // 'all' | '20-35' | '36-49' | '50+'
    specialty: string;
    insurance: string;
    modality: string; // 'all' | 'presencial' | 'online' | 'ambas'
    sortByProximity: boolean;
    clientAge: ClientAge[];
}

export interface UserLocation {
    lat: number;
    lng: number;
    accuracy?: number;
    addressName?: string;
}
