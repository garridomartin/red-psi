import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, AlertTriangle } from 'lucide-react';

export const metadata = {
    title: 'Aviso Legal y Deslinde de Responsabilidad',
};

export default function LegalNoticePage() {
    return (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8'>
            <Link
                href='/'
                className='inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 transition-colors'
            >
                <ArrowLeft className='w-4 h-4' />
                <span>Volver al inicio</span>
            </Link>

            <div className='space-y-3'>
                <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-200/60 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'>
                    <Shield className='w-3.5 h-3.5 text-primary-500' />
                    <span>Marco Regulatorio</span>
                </div>
                <h1 className='text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-neutral-50'>
                    Aviso Legal y Condiciones de Uso
                </h1>
                <p className='text-xs text-neutral-500'>Última actualización: 2024</p>
            </div>

            <div className='prose prose-neutral dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-neutral-700 dark:text-neutral-300'>
                <section className='space-y-2'>
                    <h2 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-100'>
                        1. Naturaleza del Servicio
                    </h2>
                    <p>
                        Psicologos La Plata es una plataforma web independiente de difusión
                        profesional y vinculación entre psicólogos matriculados y personas
                        interesadas en iniciar procesos de psicoterapia. Psicologos La Plata no es
                        una clínica, centro médico ni entidad prestadora directa de servicios de
                        salud mental.
                    </p>
                </section>

                <section className='space-y-2'>
                    <h2 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-100'>
                        2. Matrícula y Responsabilidad Profesional
                    </h2>
                    <p>
                        Cada profesional publicado en nuestra plataforma es un prestador
                        independiente de la salud habilitado por el Colegio de Psicólogos u
                        organismo correspondiente según su jurisdicción (Ley Nacional 23.277 del
                        Ejercicio de la Psicología en Argentina). La relación clínica, el
                        diagnóstico, tratamiento, secreto profesional y honorarios son convenidos de
                        manera directa y exclusiva entre el profesional y el paciente.
                    </p>
                </section>

                <section className='space-y-2'>
                    <h2 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-100'>
                        3. Ausencia de Servicio de Emergencias
                    </h2>
                    <div className='p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-amber-900 dark:text-amber-200'>
                        <AlertTriangle className='w-5 h-5 text-amber-600 shrink-0 mt-0.5' />
                        <p className='text-xs leading-relaxed'>
                            Este sitio web{' '}
                            <strong>
                                NO constituye un servicio de emergencias psiquiátricas ni urgencias
                                de salud mental
                            </strong>
                            . En caso de crisis aguda, ideación suicida o riesgo inminente para
                            usted o terceros, comuníquese inmediatamente al 107 (SAME), al 911 o
                            acuda a la guardia hospitalaria más cercana.
                        </p>
                    </div>
                </section>

                <section className='space-y-2'>
                    <h2 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-100'>
                        4. Enlaces Externos e Instagram
                    </h2>
                    <p>
                        Psicologos La Plata incluye enlaces directos a perfiles de Instagram de la agencia y
                        de los terapeutas. Dichos enlaces no implican asociación técnica con Meta
                        Platforms Inc. ni sujeción a sus APIs propietarias. La navegación en
                        plataformas externas se rige bajo los términos de privacidad de cada
                        servicio.
                    </p>
                </section>
            </div>
        </div>
    );
}
