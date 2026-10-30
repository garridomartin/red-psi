'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

    useEffect(() => {
        const savedToken = localStorage.getItem('red_epsilon_jwt');
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

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
            setToken(data.token);
            localStorage.setItem('red_epsilon_jwt', data.token);
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

    const toggleFavorite = (professionalId: string) => {
        if (!user) {
            return;
        }
        const exists = favorites.includes(professionalId);
        let updated: string[];
        if (exists) {
            updated = favorites.filter((id) => id !== professionalId);
        } else {
            updated = [...favorites, professionalId];
        }
        setFavorites(updated);
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
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
