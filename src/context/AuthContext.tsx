'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { supabase, isSupabaseConfigured, getAuthClient } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    token: string | null; // <-- NUEVO
    isLoading: boolean;
    isAdmin: boolean;
    favorites: string[];
    isDarkMode: boolean;
    loginWithGoogle: (credential: string) => Promise<void>;
    loginAsAdmin: () => Promise<void>;
    logout: () => Promise<void>;
    toggleFavorite: (professionalId: string) => void;
    isFavorite: (professionalId: string) => boolean;
    toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'red_epsilon_current_user_v1';
const FAVORITES_STORAGE_KEY = 'red_epsilon_favorites_v1';
const THEME_STORAGE_KEY = 'red_epsilon_theme_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const toggleDarkMode = () => {
        const nextMode = !isDarkMode;
        setIsDarkMode(nextMode);
        if (nextMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem(THEME_STORAGE_KEY, 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem(THEME_STORAGE_KEY, 'light');
        }
    };

    const loadFavorites = async (userId: string) => {
        const { data, error } = await supabase
            .from('favorites')
            .select('professional_id')
            .eq('user_id', userId);

        if (!error && data) {
            const favIds = data.map((f) => f.professional_id);
            setFavorites(favIds);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('red_epsilon_jwt');
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedToken && savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setToken(savedToken);
            setUser(parsedUser);
            loadFavorites(parsedUser.id); // <-- Carga los favoritos desde la DB
        }
        setIsLoading(false);
    }, []);

    const toggleFavorite = async (professionalId: string) => {
        console.log('🟢 [toggleFavorite] Click en favorito. Profesional ID:', professionalId);
        console.log('🟢 [toggleFavorite] Usuario actual:', user);

        if (!user) {
            console.warn('🔴 [toggleFavorite] No hay usuario logueado. Cancelando.');
            return;
        }
        const exists = favorites.includes(professionalId);
        console.log('🟢 [toggleFavorite] ¿Ya era favorito?', exists);

        const newFavorites = exists
            ? favorites.filter((id) => id !== professionalId)
            : [...favorites, professionalId];

        setFavorites(newFavorites);

        const authSupabase = getAuthClient();
        console.log('🟢 [toggleFavorite] Cliente Supabase creado. Intentando guardar en DB...');

        try {
            if (exists) {
                const { error, count } = await authSupabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('professional_id', professionalId);
                if (error) throw error;
                console.log('✅ [toggleFavorite] Favorito borrado de la DB');
                console.log('✅ [toggleFavorite] Favorito borrado. Filas afectadas:', count);
            } else {
                const { error } = await authSupabase.from('favorites').insert({
                    user_id: user.id,
                    professional_id: professionalId,
                });
                if (error) throw error;
                console.log('✅ [toggleFavorite] Favorito guardado en la DB');
            }
        } catch (error: any) {
            console.error('🔴 [toggleFavorite] Error al guardar favorito en DB:', error);
            setFavorites(favorites); // Revertir
        }
    };

    const loginWithGoogle = async (credential: string) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error de autenticación');

            setUser(data.user);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        } finally {
            setIsLoading(false);
        }
    };

    const loginAsAdmin = async () => {
        setIsLoading(true);
        const adminUser: User = {
            id: 'admin-1',
            email: 'natalia.garrido17@gmail.com',
            name: 'Equipo Psicologos La Plata (Admin)',
            avatar_url:
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
            role: 'admin',
            created_at: new Date().toISOString(),
        };
        setUser(adminUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
        setIsLoading(false);
    };

    // Exponé token y loginWithGoogle en el contexto
    // El logout debe limpiar también el token:
    const logout = async () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('red_epsilon_jwt');
        localStorage.removeItem(USER_STORAGE_KEY);
    };

    const isFavorite = (professionalId: string) => {
        return favorites.includes(professionalId);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAdmin: user?.role === 'admin',
                favorites,
                isDarkMode,
                loginWithGoogle,
                loginAsAdmin,
                logout,
                toggleFavorite,
                isFavorite,
                toggleDarkMode,
                token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
