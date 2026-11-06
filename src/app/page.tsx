'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProfessionals, updateProfessionalExample } from '@/lib/data/dataStore';
import { Professional } from '@/types';
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard';
import { Compass, Sparkles, Instagram, ArrowRight, ChevronRight, MapPin } from 'lucide-react';

export default function HomePage() {
    const [featuredProfessionals, setFeaturedProfessionals] = useState<Professional[]>([]);
    const [exampleProfessionals, setExampleProfessionals] = useState<Professional[]>([]);

    useEffect(() => {
        const load = async () => {
            const list = await getProfessionals();
            setFeaturedProfessionals(list.filter((p) => p.is_featured && p.is_active));
            setExampleProfessionals(list.filter((p) => p.example));
        };

        load();
    }, []);

    const exampleOne = exampleProfessionals.find((p) => p.example === 1);
    const exampleTwo = exampleProfessionals.find((p) => p.example === 2);
    return (
        <div className='space-y-24 pb-20 overflow-hidden'>
            {/* HERO SECTION */}
            <section className='relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden'>
                {/* Soft atmospheric gradient background */}
                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-primary-200/35 via-primary-100/15 to-transparent dark:from-primary-950/30 dark:via-neutral-900/10 dark:to-transparent rounded-full blur-3xl -z-10 pointer-events-none' />

                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center max-w-3xl mx-auto space-y-6'>
                        {/* Pill announcement */}
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-400/20 dark:bg-primary-400/15 border border-primary-400/40 text-neutral-900 dark:text-neutral-100 text-xs font-semibold shadow-subtle animate-in fade-in duration-500'>
                            <Sparkles className='w-4 h-4 text-primary-500 fill-primary-400' />
                            <span>Conexión humana • Profesionales matriculados</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.15]'>
                            El espacio donde empieza{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-sky-400 dark:from-primary-400 dark:via-primary-300 dark:to-sky-200'>
                                tu bienestar emocional.
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className='text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed'>
                            Conectamos personas con psicólogos independientes que trabajan en
                            distintos puntos de La Plata. Mirás sus perfiles, filtrás por obra
                            social o ubicación y hablás directamente con el profesional que elijas.
                        </p>

                        {/* Call To Actions */}
                        <div className='flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4'>
                            <Link
                                href='/profesionales'
                                className='w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-primary-400 hover:bg-primary-300 text-neutral-950 font-bold text-sm shadow-card hover:shadow-hover hover:scale-[1.02] active:scale-[0.98] transition-all'
                            >
                                <Compass className='w-4 h-4' />
                                <span>Explorar Profesionales</span>
                                <ArrowRight className='w-4 h-4' />
                            </Link>

                            <a
                                href='https://instagram.com/psicologolaplata'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 font-bold text-sm shadow-sm transition-all'
                            >
                                <Instagram className='w-4 h-4 text-pink-500' />
                                <span className='dark:text-black'>Nuestro Instagram</span>
                            </a>
                        </div>

                        {/* Trust factors */}
                        <div className='pt-8 grid grid-cols-3 gap-4 border-t border-neutral-200/60 dark:border-neutral-800 max-w-xl mx-auto text-xs text-neutral-600 dark:text-neutral-400'>
                            <div className='flex flex-col items-center gap-1'>
                                <span className='font-bold text-neutral-900 dark:text-neutral-100 text-base'>
                                    100%
                                </span>
                                <span>Matriculados</span>
                            </div>
                            <div className='flex flex-col items-center gap-1'>
                                <span className='font-bold text-neutral-900 dark:text-neutral-100 text-base'>
                                    Directo
                                </span>
                                <span>Sin intermediarios</span>
                            </div>
                            <div className='flex flex-col items-center gap-1'>
                                <span className='font-bold text-neutral-900 dark:text-neutral-100 text-base'>
                                    Cercano
                                </span>
                                <span>Online o Presencial</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS (3 PASOS) */}
            <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center max-w-2xl mx-auto mb-14 space-y-3'>
                    <span className='text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400'>
                        Paso a paso simple
                    </span>
                    <h2 className='text-3xl font-extrabold font-display text-neutral-900 dark:text-neutral-50 tracking-tight'>
                        ¿Cómo funciona nuestra app?
                    </h2>
                    <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                        Diseñamos un camino transparente para que encuentres la ayuda adecuada a tu
                        ritmo.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 relative'>
                    {/* Step 1 */}
                    <div className='bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-card hover:shadow-hover transition-all duration-300 relative group'>
                        <div className='w-12 h-12 rounded-2xl bg-primary-400/20 text-neutral-900 dark:text-primary-300 flex items-center justify-center font-black text-xl mb-6'>
                            1
                        </div>
                        <h3 className='text-xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-3'>
                            Descubrí
                        </h3>
                        <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                            Explorá perfiles verificados filtrando por, obra social, edad o cercanía
                            geográfica con tu ubicación actual.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className='bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-card hover:shadow-hover transition-all duration-300 relative group'>
                        <div className='w-12 h-12 rounded-2xl bg-primary-400/20 text-neutral-900 dark:text-primary-300 flex items-center justify-center font-black text-xl mb-6'>
                            2
                        </div>
                        <h3 className='text-xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-3'>
                            Conocé
                        </h3>
                        <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                            Leé la trayectoria completa de cada profesional, su orientación teórica,
                            matrícula habilitante y visitá su cuenta de Instagram para conocer su
                            enfoque humano y contenido.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className='bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-card hover:shadow-hover transition-all duration-300 relative group'>
                        <div className='w-12 h-12 rounded-2xl bg-primary-400/20 text-neutral-900 dark:text-primary-300 flex items-center justify-center font-black text-xl mb-6'>
                            3
                        </div>
                        <h3 className='text-xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-3'>
                            Contactá
                        </h3>
                        <p className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                            Escribile directamente por WhatsApp. Coordiná horarios y modalidad.
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURED PROFESSIONALS CAROUSEL / GRID */}
            <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10'>
                    <div>
                        <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 mb-2'>
                            <Sparkles className='w-3.5 h-3.5 fill-amber-400' />
                            <span>Selección de la agencia</span>
                        </div>
                        <h2 className='text-3xl font-extrabold font-display text-neutral-900 dark:text-neutral-50 tracking-tight'>
                            Profesionales Destacados
                        </h2>
                        <p className='text-sm text-neutral-600 dark:text-neutral-400 mt-1'>
                            Licenciados en Psicología con amplia trayectoria y recomendación de
                            nuestra comunidad.
                        </p>
                    </div>

                    <Link
                        href='/profesionales'
                        className='inline-flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors'
                    >
                        <span>Ver todos los profesionales</span>
                        <ChevronRight className='w-4 h-4' />
                    </Link>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
                    {featuredProfessionals.slice(0, 3).map((prof) => (
                        <ProfessionalCard key={prof.id} professional={prof} />
                    ))}
                </div>
            </section>

            {/* INSTAGRAM AGENCY CALLOUT BANNER */}
            <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 dark:from-neutral-900 dark:to-neutral-950 text-white p-8 sm:p-12 border border-neutral-800 shadow-2xl relative overflow-hidden'>
                    {/* Decorative glows */}
                    <div className='absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none' />
                    <div className='absolute bottom-0 left-0 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl pointer-events-none' />

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10'>
                        <div className='space-y-5'>
                            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold'>
                                <Instagram className='w-4 h-4 text-pink-400' />
                                <span>Comunidad en Instagram</span>
                            </div>

                            <h2 className='text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight'>
                                Publicamos tarjetas de profesionales todas las semanas en{' '}
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200'>
                                    @psicologolaplata
                                </span>
                            </h2>

                            <p className='text-sm text-neutral-300 leading-relaxed max-w-xl'>
                                Nuestra cuenta de Instagram es el puente que difunde el trabajo de
                                psicólogos de La Plata, Berisso y Ensenada. Encontrá cápsulas
                                psicoeducativas, consejos para tu día a día y presentaciones en
                                video de cada terapeuta.
                            </p>

                            <div className='pt-2 flex flex-wrap gap-4'>
                                <a
                                    href='https://instagram.com/psicologolaplata'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm shadow-lg transition-all'
                                >
                                    <Instagram className='w-5 h-5' />
                                    <span>Seguir a @psicologolaplata</span>
                                </a>
                            </div>
                        </div>

                        {/* Mock Instagram Feed Cards */}
                        <div className='grid grid-cols-2 gap-3.5 sm:gap-4'>
                            <div className='rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 space-y-3'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 p-0.5'>
                                        <div className='w-full h-full bg-neutral-900 rounded-full flex items-center justify-center text-[10px] font-bold'>
                                            Ψ
                                        </div>
                                    </div>
                                    <span className='text-xs font-bold'>psicologolaplata</span>
                                </div>
                                <div className='aspect-square rounded-xl bg-neutral-800/80 overflow-hidden relative'>
                                    <img
                                        src={exampleOne?.photo_url}
                                        alt='Tarjeta Instagram'
                                        className='w-full h-full object-cover'
                                    />
                                    <div className='absolute inset-0 bg-neutral-950/40 p-2.5 flex flex-col justify-end'>
                                        <p className='text-[11px] font-bold leading-tight'>
                                            {exampleOne?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15 space-y-3 '>
                                <div className='flex items-center gap-2'>
                                    <div className='w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 p-0.5'>
                                        <div className='w-full h-full bg-neutral-900 rounded-full flex items-center justify-center text-[10px] font-bold'>
                                            Ψ
                                        </div>
                                    </div>
                                    <span className='text-xs font-bold'>psicologolaplata</span>
                                </div>
                                <div className='aspect-square rounded-xl bg-neutral-800/80 overflow-hidden relative'>
                                    <img
                                        src={exampleTwo?.photo_url}
                                        alt='Tarjeta Instagram'
                                        className='w-full h-full object-cover'
                                    />
                                    <div className='absolute inset-0 bg-neutral-950/40 p-2.5 flex flex-col justify-end'>
                                        <p className='text-[11px] font-bold leading-tight'>
                                            {exampleTwo?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            {/*    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center max-w-2xl mx-auto mb-14 space-y-3'>
                    <span className='text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400'>
                        Nuestros pilares
                    </span>
                    <h2 className='text-3xl font-extrabold font-display text-neutral-900 dark:text-neutral-50 tracking-tight'>
                        ¿Por qué elegir Psicólogos La Plata?
                    </h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='bg-white dark:bg-neutral-900 rounded-3xl p-7 border border-neutral-200/80 dark:border-neutral-800 space-y-3'>
                        <div className='w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center'>
                            <ShieldCheck className='w-5 h-5' />
                        </div>
                        <h3 className='font-bold text-base text-neutral-900 dark:text-neutral-100'>
                            Validación y Matrícula Activa
                        </h3>
                        <p className='text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                            Verificamos que cada psicólogo cuente con título universitario
                            homologado y matrícula profesional provincial o nacional vigente antes
                            de incorporarlo.
                        </p>
                    </div>

                    <div className='bg-white dark:bg-neutral-900 rounded-3xl p-7 border border-neutral-200/80 dark:border-neutral-800 space-y-3'>
                        <div className='w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center'>
                            <MapPin className='w-5 h-5' />
                        </div>
                        <h3 className='font-bold text-base text-neutral-900 dark:text-neutral-100'>
                            Geolocalización Real
                        </h3>
                        <p className='text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                            Si preferís la modalidad presencial, ordenamos los consultorios según la
                            distancia a tu domicilio para que no pierdas horas de viaje en la
                            ciudad.
                        </p>
                    </div>

                    <div className='bg-white dark:bg-neutral-900 rounded-3xl p-7 border border-neutral-200/80 dark:border-neutral-800 space-y-3'>
                        <div className='w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center'>
                            <Heart className='w-5 h-5' />
                        </div>
                        <h3 className='font-bold text-base text-neutral-900 dark:text-neutral-100'>
                            Encuadre a medida, sin intermediarios
                        </h3>
                        <p className='text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed'>
                            No retenemos pagos ni forzamos suscripciones mensuales. Hablás
                            directamente con el terapeuta y definen juntos el encuadre de trabajo.
                        </p>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
