import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Instagram, Mail, Phone, MapPin, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className='bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 transition-colors'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10'>
                    {/* Brand & Proposition */}
                    <div className='lg:col-span-2 space-y-4'>
                        <BrandLogo size='md' />
                        <p className='text-sm text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed'>
                            Agencia de difusión y conexión psicológica en La Plata y alrededores.
                            Conectamos personas con profesionales de la salud mental matriculados.
                        </p>

                        {/* Agency Instagram highlight */}
                        <div className='pt-2'>
                            <a
                                href='https://instagram.com/psicologolaplata'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 shadow-sm transition-all'
                            >
                                <Instagram className='w-4 h-4' />
                                <span>Seguinos en Instagram @psicologolaplata</span>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className='space-y-3'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200'>
                            Explorar
                        </h4>
                        <ul className='space-y-2 text-sm text-neutral-600 dark:text-neutral-400'>
                            <li>
                                <Link
                                    href='/'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/profesionales'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Directorio de Profesionales
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/articulos'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Artículos de interés
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/favoritos'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Mis Favoritos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Specialties / Modalities */}
                    <div className='space-y-3'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200'>
                            Modalidades
                        </h4>
                        <ul className='space-y-2 text-sm text-neutral-600 dark:text-neutral-400'>
                            <li>
                                <Link
                                    href='/profesionales?modalidad=online'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Terapia Online
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/profesionales?modalidad=presencial'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Terapia Presencial
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/profesionales?especialidad=Terapia+Cognitivo+Conductual+(TCC)'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Cognitivo Conductual (TCC)
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/profesionales?especialidad=Psicoanálisis'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Psicoanálisis
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/profesionales?especialidad=Terapia+de+Pareja'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Terapia de Pareja
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Legal */}
                    <div className='space-y-3'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200'>
                            Información & Legal
                        </h4>
                        <ul className='space-y-2 text-sm text-neutral-600 dark:text-neutral-400'>
                            <li>
                                <Link
                                    href='/aviso-legal'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Aviso Legal y Deslinde
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/privacidad'
                                    className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                                >
                                    Política de Privacidad (Salud y Geo)
                                </Link>
                            </li>
                            <li className='pt-2 flex items-center gap-1.5 text-xs text-neutral-500'>
                                <ShieldCheck className='w-4 h-4 text-emerald-500' />
                                <span>Profesionales Matriculados</span>
                            </li>
                            <li className='flex items-center gap-1.5 text-xs text-neutral-500'>
                                <MapPin className='w-4 h-4 text-primary-400' />
                                <span>La Plata, Buenos Aires, Argentina</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Disclaimer */}
                <div className='mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400'>
                    <p>
                        © {new Date().getFullYear()} Psicólogos La Plata. Todos los derechos
                        reservados.
                    </p>
                    <p className='text-center sm:text-right max-w-md'>
                        Importante: En situaciones de emergencia psiquiátrica o riesgo de vida,
                        comunicate inmediatamente con el 107 (SAME) o la línea 135 (Centro de
                        Asistencia al Suicida).
                    </p>
                </div>
            </div>
        </footer>
    );
};
