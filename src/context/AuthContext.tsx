'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isChrome: boolean;
  favorites: string[];
  isDarkMode: boolean;
  loginWithGoogle: (customEmail?: string) => Promise<void>;
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
  const [isChrome, setIsChrome] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Chrome detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      const isGoogleChrome =
        /Chrome/.test(ua) &&
        !/Edg/.test(ua) &&
        !/OPR/.test(ua) &&
        !/Vivaldi/.test(ua) &&
        !/YaBrowser/.test(ua);
      setIsChrome(isGoogleChrome);

      // Load dark mode
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }

      // Load favorites
      try {
        const rawFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (rawFavs) {
          setFavorites(JSON.parse(rawFavs));
        }
      } catch (e) {
        console.warn('Error loading favorites:', e);
      }

      // Load user
      try {
        const rawUser = localStorage.getItem(USER_STORAGE_KEY);
        if (rawUser) {
          setUser(JSON.parse(rawUser));
        }
      } catch (e) {
        console.warn('Error loading user:', e);
      }

      setIsLoading(false);
    }
  }, []);

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

  const loginWithGoogle = async (customEmail?: string) => {
    setIsLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
              hd: 'gmail.com', // Restrict to Gmail domain where supported
            },
          },
        });
        if (error) throw error;
        return;
      } catch (err) {
        console.warn('Supabase OAuth failed or not configured, falling back to simulated Google session:', err);
      }
    }

    // High quality simulated Google Auth session
    const emailToUse = customEmail || 'paciente.demo@gmail.com';
    const namePart = emailToUse.split('@')[0].replace('.', ' ');
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: emailToUse,
      name: formattedName,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
      role: emailToUse.toLowerCase().includes('admin') ? 'admin' : 'user',
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
  };

  const loginAsAdmin = async () => {
    setIsLoading(true);
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@redepsilon.com',
      name: 'Equipo Psicologos La Plata (Admin)',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      role: 'admin',
      created_at: new Date().toISOString(),
    };
    setUser(adminUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setIsLoading(false);
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
        isChrome,
        favorites,
        isDarkMode,
        loginWithGoogle,
        loginAsAdmin,
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
