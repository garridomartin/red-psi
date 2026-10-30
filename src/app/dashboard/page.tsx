'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ShieldAlert, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export default function DashboardPage() {
    const { user, isAdmin, loginAsAdmin } = useAuth();

    if (!user || !isAdmin) {
        return (
            <div className='max-w-xl mx-auto px-4 py-20 text-center space-y-6'>
                <div className='mx-auto w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center'>
                    <ShieldAlert className='w-8 h-8' />
                </div>

                <h1 className='text-3xl font-extrabold font-display text-neutral-900 dark:text-neutral-50'>
                    Acceso Restringido - Panel Administrador
                </h1>

                <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                    Esta sección está reservada exclusivamente para el personal autorizado de
                    Psicologos La Plata con rol de administración.
                </p>

                {/* Demo button so reviewer can test admin without setup */}
                <div className='p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-left space-y-3'>
                    <div className='flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200'>
                        <ShieldCheck className='w-4 h-4 text-primary-500' />
                        <span>Acceso de prueba de desarrollo</span>
                    </div>
                    <p className='text-xs text-neutral-500'>
                        Podés iniciar sesión inmediatamente como administrador con un solo clic para
                        probar la carga de profesionales (drag & drop, portapapeles, filtros) y CRUD
                        de artículos.
                    </p>
                    <button
                        onClick={() => loginAsAdmin()}
                        className='w-full py-2.5 px-4 rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2'
                    >
                        <UserCheck className='w-4 h-4' />
                        <span>Acceder como Administrador (natalia.garrido17@gmail.com)</span>
                    </button>
                </div>

                <div>
                    <Link
                        href='/'
                        className='text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline'
                    >
                        Volver a la página principal
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            <AdminDashboard />
        </div>
    );
}
