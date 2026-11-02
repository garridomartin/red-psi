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
