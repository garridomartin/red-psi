'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Professional, UserLocation } from '@/types';
import { FavoriteStar } from './FavoriteStar';
import { ContactModal } from './ContactModal';
import { calculateDistanceKm, formatDistance } from '@/lib/geo';
import {
    MapPin,
    Instagram,
    MessageCircle,
    ExternalLink,
    Sparkles,
    ShieldCheck,
    Calendar,
    CheckCircle,
} from 'lucide-react';

interface ProfessionalCardProps {
    professional: Professional;
    userLocation?: UserLocation | null;
    onRequireLogin?: () => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
    professional,
    userLocation,
    onRequireLogin,
}) => {
    const [contactModalOpen, setContactModalOpen] = useState(false);

    // Distance calculation if userLocation is active
    const distanceKm =
        userLocation && professional.lat && professional.lng
            ? calculateDistanceKm(
                  userLocation.lat,
                  userLocation.lng,
                  professional.lat,
                  professional.lng,
              )
            : null;

    const modalityBadge = {
        presencial: {
            text: 'Presencial',
            class: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        },
        online: {
            text: 'Online',
            class: 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        },
        ambas: {
            text: 'Presencial y Online',
            class: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        },
    }[professional.modality];

    return (
        <>
            <div className='group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-card hover:shadow-hover hover:border-primary-400/50 transition-all duration-300 flex flex-col justify-between relative'>
                {/* Top Featured Ribbon */}
                {professional.is_featured && (
                    <div className='absolute top-4 left-4 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary-400 text-neutral-950 shadow-md'>
                        <Sparkles className='w-3 h-3 fill-neutral-950' />
                        <span>Destacado</span>
                    </div>
                )}

                {/* Favorite Star */}
                <div className='absolute top-4 right-4 z-20'>
                    <FavoriteStar
                        professionalId={professional.id}
                        onRequireLogin={onRequireLogin}
                    />
                </div>

                <div>
                    {/* Photo Section */}
                    <div className='relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800'>
                        <img
                            src={professional.photo_url}
                            alt={professional.name}
                            className='w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105'
                            loading='lazy'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-60' />

                        {/* Approximate distance badge overlay */}
                        {distanceKm !== null && (
                            <div className='absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-neutral-950/70 text-white backdrop-blur-md'>
                                <MapPin className='w-3.5 h-3.5 text-primary-400' />
                                <span>{formatDistance(distanceKm)}</span>
                            </div>
                        )}
                    </div>

                    {/* Card Body */}
                    <div className='p-5 sm:p-6 space-y-4'>
                        <div>
                            <div className='flex items-center justify-between gap-2'>
                                <Link
                                    href={`/profesionales/${professional.slug}`}
                                    className='group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'
                                >
                                    <h3 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-50 tracking-tight'>
                                        {professional.name}
                                    </h3>
                                </Link>
                                {/* Outgoing Instagram Link */}
                                <a
                                    href={professional.instagram_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='p-1.5 rounded-lg text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/50 transition-colors shrink-0'
                                    title={`Ver Instagram de ${professional.name}`}
                                    aria-label={`Ver Instagram de ${professional.name}`}
                                >
                                    <Instagram className='w-4 h-4' />
                                </a>
                            </div>

                            <div className='flex items-center gap-2 mt-1 text-xs text-neutral-500 dark:text-neutral-400'>
                                <span className='font-semibold text-neutral-700 dark:text-neutral-300'>
                                    {professional.license}
                                </span>
                                <span>•</span>
                                <span>{professional.age} años</span>
                            </div>
                        </div>

                        {/* Specialties Badges */}
                        <div className='flex flex-wrap gap-1.5'>
                            {professional.specialties.slice(0, 3).map((spec) => (
                                <span
                                    key={spec}
                                    className='px-2.5 py-1 text-[11px] font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50'
                                >
                                    {spec}
                                </span>
                            ))}
                            {professional.specialties.length > 3 && (
                                <span className='px-2 py-1 text-[10px] font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500'>
                                    +{professional.specialties.length - 3} más
                                </span>
                            )}
                        </div>

                        {/* Modality & Insurances Info */}
                        <div className='pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs'>
                            <div className='flex items-center justify-between'>
                                <span className='text-neutral-500 dark:text-neutral-400'>
                                    Modalidad:
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${modalityBadge.class}`}
                                >
                                    {modalityBadge.text}
                                </span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-neutral-500 dark:text-neutral-400'>
                                    Obras sociales:
                                </span>
                                <span className='font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[170px] text-right'>
                                    {professional.insurances.join(', ')}
                                </span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-neutral-500 dark:text-neutral-400'>
                                    Ubicación:
                                </span>
                                <span className='font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[170px] text-right flex items-center justify-end gap-1'>
                                    <MapPin className='w-3 h-3 text-primary-500 shrink-0' />
                                    {professional.neighborhood || professional.city || 'CABA'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='p-5 sm:p-6 pt-0 grid grid-cols-2 gap-2.5'>
                    <Link
                        href={`/profesionales/${professional.slug}`}
                        className='w-full py-2.5 px-3 text-xs font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5'
                    >
                        <span>Ver perfil</span>
                    </Link>

                    <button
                        onClick={() => setContactModalOpen(true)}
                        className='w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950 transition-all shadow-sm flex items-center justify-center gap-1.5'
                    >
                        <MessageCircle className='w-3.5 h-3.5' />
                        <span>Contactar</span>
                    </button>
                </div>
            </div>

            {/* Direct Contact Modal */}
            <ContactModal
                professional={professional}
                isOpen={contactModalOpen}
                onClose={() => setContactModalOpen(false)}
            />
        </>
    );
};
