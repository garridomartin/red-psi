import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad y Tratamiento de Datos (Salud y Geo)',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al inicio</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
          <Lock className="w-3.5 h-3.5" />
          <span>Protección de Datos Personales (Ley 25.326)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-neutral-50">
          Política de Privacidad y Tratamiento de Datos
        </h1>
        <p className="text-xs text-neutral-500">Última actualización: 2024</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-neutral-700 dark:text-neutral-300">
        <section className="space-y-2">
          <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-neutral-100">
            1. Protección de Datos de Salud Mental
          </h2>
          <p>
            En cumplimiento de la <strong>Ley de Protección de Datos Personales N° 25.326</strong> de la República Argentina y estándares internacionales de confidencialidad médica, Psicologos La Plata considera los motivos de consulta y la búsqueda de atención psicológica como <strong>datos sensibles</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>No comercializamos, cedemos ni compartimos sus datos de navegación con terceros para fines publicitarios.</li>
            <li>El contenido de las consultas enviadas mediante formularios de contacto se transmite de forma cifrada directamente al profesional seleccionado.</li>
            <li>El historial clínico y las notas de sesión pertenecen estrictamente al ámbito del secreto profesional médico del terapeuta.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-neutral-100">
            2. Consentimiento Explícito de Geolocalización
          </h2>
          <p>
            Nuestra aplicación cuenta con una función opcional de ordenamiento por cercanía geográfica. Respecto a su ubicación:
          </p>
          <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100">
              <CheckCircle2 className="w-4 h-4 text-primary-500" />
              <span>Procesamiento local en su dispositivo</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Las coordenadas GPS obtenidas mediante el navegador se utilizan exclusivamente para calcular la distancia euclidiana/haversine respecto a los consultorios físicos en su navegador. <strong>No almacenamos su ubicación en servidores centrales ni generamos perfiles de rastreo geográfico.</strong>
            </p>
          </div>
          <p>
            Usted puede revocar o activar el permiso de geolocalización en cualquier momento desde los ajustes de su navegador web.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-neutral-100">
            3. Autenticación con Google (Gmail)
          </h2>
          <p>
            Al iniciar sesión con Google OAuth, únicamente solicitamos acceso a su nombre, dirección de correo electrónico y foto de perfil para gestionar su lista de profesionales favoritos. No tenemos acceso a sus correos electrónicos, documentos de Drive ni contactos de Google.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-neutral-100">
            4. Derechos de Acceso, Rectificación y Supresión
          </h2>
          <p>
            Todo usuario puede ejercer sus derechos de acceso, actualización, rectificación o supresión de sus datos personales enviando un correo electrónico a <code>privacidad@redpsicologos.com.ar</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
