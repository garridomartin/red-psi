'use client';

import { Eye, Phone, Star, Tag, Shield } from 'lucide-react';
import MetricCard from './MetricCard';
import CatalogCard from './CatalogCard';

import type { Specialty, Insurance, AdminStats } from '@/types';
import { INSURANCES_CATALOG, SPECIALTIES_CATALOG } from '@/lib/data/mockData';

interface StatsPanelProps {
    stats: AdminStats;
    specialtiesCatalog?: Specialty[];
    insurancesCatalog?: Insurance[];
}

export default function StatsPanel({
    stats,
    specialtiesCatalog = SPECIALTIES_CATALOG,
    insurancesCatalog = INSURANCES_CATALOG,
}: StatsPanelProps) {
    return (
        <div className='space-y-6'>
            {/* Key Metric Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <MetricCard
                    icon={Eye}
                    label='Visualizaciones de perfil'
                    value={stats.totalViews}
                    color='sky'
                />
                <MetricCard
                    icon={Phone}
                    label='Contactos generados (WhatsApp/Email)'
                    value={stats.totalContacts}
                    color='emerald'
                />
                <MetricCard
                    icon={Star}
                    label='Favoritos guardados por pacientes'
                    value={stats.totalFavorites}
                    color='rose'
                />
            </div>

            {/* Catalogs Overview */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <CatalogCard
                    title='Catálogo de Especialidades'
                    icon={Tag}
                    iconClassName='text-primary-500'
                    items={specialtiesCatalog}
                />
                <CatalogCard
                    title='Catálogo de Obras Sociales y Prepagas'
                    icon={Shield}
                    iconClassName='text-emerald-500'
                    items={insurancesCatalog}
                />
            </div>
        </div>
    );
}
