'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from './BrandLogo';
import {
  Menu,
  X,
  Heart,
  User as UserIcon,
  LogOut,
  Shield,
  Sun,
  Moon,
  Instagram,
  Compass,
  BookOpen,
  Home,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, favorites, isDarkMode, loginWithGoogle, loginAsAdmin, logout, toggleDarkMode } =
    useAuth();
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  // Auto-hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 120) {
        // Scrolling down
        setIsVisible(false);
        setProfileDropdownOpen(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Profesionales', href: '/profesionales', icon: Compass },
    { label: 'Artículos de interés', href: '/articulos', icon: BookOpen },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          lastScrollY > 20
            ? 'bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-subtle border-b border-neutral-200/60 dark:border-neutral-800'
            : 'bg-neutral-50/70 dark:bg-neutral-950/70 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <BrandLogo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 ml-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-neutral-900 dark:text-neutral-50 bg-primary-400/20 dark:bg-primary-400/15'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Instagram Agency Outbound Link */}
            <a
              href="https://instagram.com/psicologolaplata"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 hover:bg-pink-100 transition-colors"
              title="Seguinos en Instagram @psicologolaplata"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@psicologolaplata</span>
            </a>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Cambiar tema de color"
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Favorites quick button if logged in */}
            {user && (
              <Link
                href="/favoritos"
                className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Ver mis favoritos"
              >
                <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Button / Profile Avatar */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-primary-400 dark:hover:border-primary-400 transition-colors bg-white dark:bg-neutral-900 shadow-sm"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-400/40"
                  />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-400 text-neutral-950 rounded-md">
                      ADMIN
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/favoritos"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Mis favoritos ({favorites.length})</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Panel Administrador</span>
                      </Link>
                    )}

                    <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Iniciar con Google</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              aria-label="Cambiar modo"
              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú de navegación"
              className="p-2 rounded-xl text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Hamburger Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-sm md:hidden animate-in fade-in">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-neutral-50 dark:bg-neutral-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
                <BrandLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary-400/20 text-neutral-900 dark:text-neutral-50'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                      {link.label}
                    </Link>
                  );
                })}

                {user && (
                  <Link
                    href="/favoritos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 fill-rose-500" />
                      <span>Mis Favoritos</span>
                    </div>
                    <span className="px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full font-bold">
                      {favorites.length}
                    </span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Panel Administrador</span>
                  </Link>
                )}
              </nav>

              {/* Instagram link */}
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <a
                  href="https://instagram.com/psicologolaplata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Seguinos en Instagram @psicologolaplata</span>
                </a>
              </div>
            </div>

            {/* Mobile Auth actions */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-400"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Iniciar sesión con Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Google Login Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-primary-400/20 flex items-center justify-center mb-3">
                <BrandLogo size="sm" showText={false} asLink={false} />
              </div>
              <h3 className="text-xl font-bold font-display text-neutral-900 dark:text-neutral-50">
                Acceso a Psicólogos La Plata
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Guardá tus psicólogos favoritos y gestioná tus consultas.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  loginWithGoogle();
                  setAuthModalOpen(false);
                }}
                className="w-full py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-100 font-semibold text-sm flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar con Google (@gmail.com)</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-400">
                    O probar perfiles demo
                  </span>
                </div>
              </div>

              {/* Quick Admin Test Button */}
              <button
                onClick={() => {
                  loginAsAdmin();
                  setAuthModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Shield className="w-4 h-4 text-primary-400 dark:text-primary-600" />
                <span>Ingresar como Administrador (admin@redepsilon.com)</span>
              </button>

              {/* Custom Gmail input */}
              <div className="pt-2">
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  O ingresá tu Gmail específico:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                  <button
                    disabled={!customEmail.endsWith('@gmail.com')}
                    onClick={() => {
                      loginWithGoogle(customEmail);
                      setAuthModalOpen(false);
                    }}
                    className="px-3 py-2 text-xs font-bold rounded-xl bg-primary-400 text-neutral-950 disabled:opacity-50 hover:bg-primary-300"
                  >
                    Entrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
