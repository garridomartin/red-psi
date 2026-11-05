'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { getProfessionals, getProfessionalBySlug } from '@/lib/data/dataStore';
import { Professional } from '@/types';
import { FavoriteStar } from '@/components/professionals/FavoriteStar';
import { ContactModal } from '@/components/professionals/ContactModal';
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard';
import {
    MapPin,
    Instagram,
    MessageCircle,
    Mail,
    Phone,
    ShieldCheck,
    Calendar,
    Sparkles,
    ArrowLeft,
    Share2,
    CheckCircle2,
    Clock,
    Award,
} from 'lucide-react';

export default function ProfessionalDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [professional, setProfessional] = useState<Professional | null | undefined>(undefined);
    const [related, setRelated] = useState<Professional[]>([]);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const load = async () => {
            const found = await getProfessionalBySlug(slug);
            setProfessional(found ?? null);

            if (found) {
                const all = await getProfessionals();
                const related = all.filter((p) => p.id !== found.id && p.is_active);
                setRelated(related.slice(0, 2));
            }
        };
        load();
    }, [slug]);

    if (professional === null) {
        notFound();
    }

    if (!professional) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-20 text-center text-xs text-neutral-500'>
                Cargando perfil del profesional...
            </div>
        );
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${professional.name} | Psicologos La Plata`,
                text: `Conocé el perfil y consultorio de ${professional.name}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
    };

    return (
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12'>
            {/* Back breadcrumb */}
            <div className='flex items-center justify-between'>
                <Link
                    href='/profesionales'
                    className='inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'
                >
                    <ArrowLeft className='w-4 h-4' />
                    <span>Volver al directorio de psicólogos</span>
                </Link>

                <button
                    onClick={handleShare}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50'
                >
                    <Share2 className='w-3.5 h-3.5' />
                    <span>{copiedLink ? '¡Link copiado!' : 'Compartir perfil'}</span>
                </button>
            </div>

            {/* Main Profile Card Header */}
            <div className='bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-neutral-800 shadow-card relative overflow-hidden'>
                {/* Glow backdrop */}
                <div className='absolute top-0 right-0 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl pointer-events-none' />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10'>
                    {/* Photo & Actions */}
                    <div className='space-y-4'>
                        <div className='relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-200/60 dark:border-neutral-700'>
                            <img
                                src={professional.photo_url}
                                alt={professional.name}
                                className='w-full h-full object-cover object-top'
                            />
                            <div className='absolute top-3 right-3'>
                                <FavoriteStar professionalId={professional.id} size='md' />
                            </div>
                            {professional.is_featured && (
                                <div className='absolute bottom-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary-400 text-neutral-950 shadow-md'>
                                    <Sparkles className='w-3 h-3 fill-neutral-950' />
                                    <span>Destacado</span>
                                </div>
                            )}
                        </div>

                        {/* Direct Contact Buttons */}
                        <div className='space-y-2'>
                            <button
                                onClick={() => setContactModalOpen(true)}
                                className='w-full py-3.5 px-4 rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2'
                            >
                                <MessageCircle className='w-4 h-4' />
                                <span>Contactar profesional</span>
                            </button>

                            <a
                                href={professional.instagram_url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='w-full py-3 px-4 rounded-xl border border-pink-200 dark:border-pink-900/50 bg-pink-50/70 dark:bg-pink-950/30 hover:bg-pink-100 text-pink-700 dark:text-pink-300 font-bold text-xs transition-colors flex items-center justify-center gap-2'
                            >
                                <Instagram className='w-4 h-4' />
                                <span>Ver perfil en Instagram</span>
                            </a>
                        </div>
                    </div>

                    {/* Details & Info */}
                    <div className='md:col-span-2 space-y-6'>
                        <div>
                            <div className='flex flex-wrap items-center gap-2 mb-2'>
                                <span className='px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1'>
                                    <ShieldCheck className='w-3.5 h-3.5' />
                                    <span>Matrícula Verificada: M.N. {professional.license}</span>
                                </span>
                                <span className='px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'>
                                    {professional.age} años
                                </span>
                            </div>

                            <h1 className='text-3xl sm:text-4xl font-extrabold font-display text-neutral-900 dark:text-neutral-50 tracking-tight'>
                                {professional.name}
                            </h1>
                            <p className='text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1'>
                                {professional.title || 'Licenciada/o en Psicología'}
                            </p>
                        </div>

                        {/* Specialties Badges */}
                        <div>
                            <h3 className='text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2'>
                                Áreas de especialidad
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {professional.specialties.map((spec) => (
                                    <span
                                        key={spec}
                                        className='px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60'
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className='space-y-2'>
                            <h3 className='text-xs font-bold uppercase tracking-wider text-neutral-500'>
                                Sobre su trayectoria y encuadre
                            </h3>
                            <p className='text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line'>
                                {professional.bio}
                            </p>
                        </div>

                        {/* Key Attributes Grid */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200/80 dark:border-neutral-800 text-xs'>
                            <div className='p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700 space-y-1'>
                                <span className='text-neutral-500 font-semibold block'>
                                    Modalidad de atención:
                                </span>
                                <span className='font-bold text-neutral-900 dark:text-neutral-100 capitalize text-sm'>
                                    {professional.modality === 'ambas'
                                        ? 'Presencial y Online'
                                        : professional.modality}
                                </span>
                            </div>

                            <div className='p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700 space-y-1'>
                                <span className='text-neutral-500 font-semibold block'>
                                    Obras sociales / Prepagas:
                                </span>
                                <span className='font-bold text-neutral-900 dark:text-neutral-100 text-sm'>
                                    {professional.insurances.join(', ')}
                                </span>
                            </div>

                            <div className='p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700 space-y-1'>
                                <span className='text-neutral-500 font-semibold block'>
                                    Consultorio físico:
                                </span>
                                <span className='font-bold text-neutral-900 dark:text-neutral-100 text-sm flex items-center gap-1'>
                                    <MapPin className='w-3.5 h-3.5 text-primary-500 shrink-0' />
                                    {professional.address} (
                                    {professional.neighborhood || professional.city})
                                </span>
                            </div>

                            <div className='p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700 space-y-1'>
                                <span className='text-neutral-500 font-semibold block'>
                                    Honorarios aproximados:
                                </span>
                                <span className='font-bold text-neutral-900 dark:text-neutral-100 text-sm'>
                                    {/* {professional.session_price || 'A convenir según reintegro'} */}
                                    Consultar
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Professionals */}
            {related.length > 0 && (
                <div className='space-y-6 pt-6'>
                    <h2 className='text-2xl font-bold font-display text-neutral-900 dark:text-neutral-50'>
                        Otros profesionales recomendados
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        {related.map((p) => (
                            <ProfessionalCard key={p.id} professional={p} />
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            <ContactModal
                professional={professional}
                isOpen={contactModalOpen}
                onClose={() => setContactModalOpen(false)}
            />
        </div>
    );
}
