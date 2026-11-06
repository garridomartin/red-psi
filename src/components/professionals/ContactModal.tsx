'use client';

import React, { useState } from 'react';
import { X, Send, MessageCircle, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Professional } from '@/types';
import { contactFormSchema, ContactFormData } from '@/lib/validations';
import { incrementContactCount } from '@/lib/data/dataStore';

interface ContactModalProps {
    professional: Professional;
    isOpen: boolean;
    onClose: () => void;
    defaultChannel?: 'whatsapp' | 'email';
}

export const ContactModal: React.FC<ContactModalProps> = ({
    professional,
    isOpen,
    onClose,
    defaultChannel = 'whatsapp',
}) => {
    const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>(defaultChannel);
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: '',
        email: '',
        phone: '',
        message: `Hola ${professional.name}, vi tu perfil en la web de Psicólogos La Plata y quisiera consultar disponibilidad para iniciar terapia.`,
        preferredModality: 'indistinto',
        professionalId: professional.id,
        website_trap: '', // Honeypot
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleWhatsAppDirect = () => {
        // Increment contact stats
        incrementContactCount(professional.id);

        const basePhone =
            professional.whatsapp_number || professional.contact_phone.replace(/\D/g, '');
        const defaultText = `Hola ${professional.name}, vi tu perfil en Psicólogos La Plata y quisiera consultar sobre turnos para iniciar terapia.`;
        const encodedText = encodeURIComponent(defaultText);
        const waUrl = `https://wa.me/${basePhone}?text=${encodedText}`;

        window.open(waUrl, '_blank', 'noopener,noreferrer');
        onClose();
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Client-side rate-limiting check
        const lastSubmission = localStorage.getItem('last_contact_submission_timestamp');
        const now = Date.now();
        if (lastSubmission && now - parseInt(lastSubmission, 10) < 15000) {
            setErrors({ form: 'Por favor esperá unos segundos antes de enviar otra consulta.' });
            return;
        }

        // Honeypot check
        if (formData.website_trap && formData.website_trap.length > 0) {
            // Quietly drop bot submissions
            onClose();
            return;
        }

        // Zod validation
        const result = contactFormSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0].toString()] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate network / server action delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            localStorage.setItem('last_contact_submission_timestamp', now.toString());
            incrementContactCount(professional.id);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 2000);
        } catch {
            setErrors({
                form: 'Ocurrió un error al enviar el mensaje. Probá por WhatsApp directamente.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in'>
            <div className='bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto'>
                <button
                    onClick={onClose}
                    className='absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                >
                    <X className='w-5 h-5' />
                </button>

                {/* Header */}
                <div className='flex items-center gap-4 mb-6'>
                    <img
                        src={professional.photo_url}
                        alt={professional.name}
                        className='w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-400/40'
                    />
                    <div>
                        <h3 className='text-lg font-bold font-display text-neutral-900 dark:text-neutral-50'>
                            Contactar a {professional.name}
                        </h3>
                        <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                            {professional.license} • {professional.modality.toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Tab switcher */}
                <div className='flex rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-6'>
                    <button
                        onClick={() => setActiveTab('whatsapp')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'whatsapp'
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                        }`}
                    >
                        <MessageCircle className='w-4 h-4' />
                        <span>WhatsApp directo</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('email')}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                            activeTab === 'email'
                                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                        }`}
                    >
                        <Mail className='w-4 h-4' />
                        <span>Formulario Email</span>
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'whatsapp' ? (
                    <div className='space-y-4 text-center py-2'>
                        <div className='mx-auto w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500 mb-2'>
                            <MessageCircle className='w-8 h-8' />
                        </div>
                        <h4 className='text-base font-bold text-neutral-900 dark:text-neutral-100'>
                            Conversá directamente por WhatsApp
                        </h4>
                        <p className='text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed'>
                            Te comunicás directamente con el consultorio del profesional sin
                            intermediarios ni costos extra por derivación.
                        </p>
                        <div className='p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-left border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-600 dark:text-neutral-300 italic'>
                            &quot;Hola {professional.name}, vi tu perfil en Psicologos La Plata y
                            quisiera consultar sobre turnos para iniciar terapia...&quot;
                        </div>

                        <button
                            onClick={handleWhatsAppDirect}
                            className='w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4'
                        >
                            <MessageCircle className='w-5 h-5' />
                            <span>Abrir chat de WhatsApp</span>
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleEmailSubmit} className='space-y-4'>
                        {/* Honeypot field for anti-spam bots */}
                        <input
                            type='text'
                            name='website_trap'
                            value={formData.website_trap}
                            onChange={(e) =>
                                setFormData({ ...formData, website_trap: e.target.value })
                            }
                            className='hidden'
                            tabIndex={-1}
                            autoComplete='off'
                        />

                        {errors.form && (
                            <div className='p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 flex items-center gap-2'>
                                <AlertCircle className='w-4 h-4 shrink-0' />
                                <span>{errors.form}</span>
                            </div>
                        )}

                        {isSuccess ? (
                            <div className='py-8 text-center space-y-3'>
                                <CheckCircle2 className='w-12 h-12 text-emerald-500 mx-auto animate-bounce' />
                                <h4 className='text-base font-bold text-neutral-900 dark:text-neutral-100'>
                                    ¡Mensaje enviado con éxito!
                                </h4>
                                <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                                    {professional.name} responderá a tu email a la brevedad.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                        Nombre y Apellido *
                                    </label>
                                    <input
                                        type='text'
                                        required
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fullName: e.target.value })
                                        }
                                        placeholder='Ej: Lucía Benítez'
                                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400'
                                    />
                                    {errors.fullName && (
                                        <p className='text-[11px] text-red-500 mt-1'>
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>

                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    <div>
                                        <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                            Email de contacto *
                                        </label>
                                        <input
                                            type='email'
                                            required
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            placeholder='tu@email.com'
                                            className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400'
                                        />
                                        {errors.email && (
                                            <p className='text-[11px] text-red-500 mt-1'>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                            Teléfono / WhatsApp
                                        </label>
                                        <input
                                            type='tel'
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({ ...formData, phone: e.target.value })
                                            }
                                            placeholder='+54 9 11 ...'
                                            className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400'
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                        Modalidad preferida
                                    </label>
                                    <select
                                        value={formData.preferredModality}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                preferredModality: e.target.value as any,
                                            })
                                        }
                                        className='w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400'
                                    >
                                        <option value='indistinto'>
                                            Indistinto (Online o Presencial)
                                        </option>
                                        <option value='presencial'>
                                            Presencial en consultorio
                                        </option>
                                        <option value='online'>Online por videollamada</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1'>
                                        Tu mensaje o consulta *
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({ ...formData, message: e.target.value })
                                        }
                                        className='w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none'
                                    />
                                    {errors.message && (
                                        <p className='text-[11px] text-red-500 mt-1'>
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='w-full py-3 px-4 rounded-xl bg-primary-400 hover:bg-primary-300 text-neutral-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2'
                                >
                                    <Send className='w-4 h-4' />
                                    <span>
                                        {isSubmitting
                                            ? 'Enviando...'
                                            : 'Enviar consulta al profesional'}
                                    </span>
                                </button>
                            </>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};
