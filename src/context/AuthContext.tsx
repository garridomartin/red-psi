'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
    favorites: string[];
    isDarkMode: boolean;
    loginWithGoogle: (credential: string) => Promise<void>;
    logout: () => Promise<void>;
    toggleFavorite: (professionalId: string) => void;
    isFavorite: (professionalId: string) => boolean;
    toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'red_epsilon_current_user_v1';
const THEME_STORAGE_KEY = 'red_epsilon_theme_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const nextMode = !prev;
            if (nextMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem(THEME_STORAGE_KEY, 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem(THEME_STORAGE_KEY, 'light');
            }
            return nextMode;
        });
    };

    const loadFavorites = async (_userId: string) => {
        try {
            const res = await fetch('/api/favorites', { credentials: 'include' });
            if (!res.ok) {
                if (res.status === 401) {
                    // Sin sesión: no es un error, simplemente no hay favoritos
                    setFavorites([]);
                    return;
                }
                throw new Error('Error cargando favoritos');
            }
            const { favorites } = await res.json();
            setFavorites(favorites);
        } catch (e) {
            console.error('Error cargando favoritos:', e);
            setFavorites([]);
        }
    };

    useEffect(() => {
        // Restaurar tema oscuro
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        } else {
            // Opcional: respetar preferencia del sistema si no hay nada guardado
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                setIsDarkMode(true);
                document.documentElement.classList.add('dark');
            }
        }

        const restoreSession = async () => {
            try {
                const res = await fetch('/api/auth/me', { credentials: 'include' });
                if (res.ok) {
                    const { user } = await res.json();
                    setUser(user);
                    loadFavorites(user.id);
                }
            } catch (e) {
                console.error('Error restaurando sesión', e);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const toggleFavorite = async (professionalId: string) => {
        if (!user) return;

        const exists = favorites.includes(professionalId);
        const newFavorites = exists
            ? favorites.filter((id) => id !== professionalId)
            : [...favorites, professionalId];

        // Actualización optimista
        setFavorites(newFavorites);

        try {
            const res = await fetch('/api/favorites', {
                method: exists ? 'DELETE' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ professionalId }),
                credentials: 'include',
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Error guardando favorito');
            }
        } catch (error) {
            console.error('Error al guardar favorito:', error);
            setFavorites(favorites); // revertir
        }
    };

    const loginWithGoogle = async (credential: string) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential }),
                credentials: 'include', // ← importante: la cookie viaja
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error de autenticación');

            setUser(data.user);
            loadFavorites(data.user.id);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (e) {
            console.error('Error cerrando sesión en el backend', e);
        } finally {
            setUser(null);
            setFavorites([]);
            localStorage.removeItem(USER_STORAGE_KEY);
        }
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
                logout,
                toggleFavorite,
                isFavorite,
                toggleDarkMode,
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
