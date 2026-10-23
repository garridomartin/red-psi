import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { WhatsAppFloating } from '@/components/common/WhatsAppFloating';
import { GeoPrompt } from '@/components/common/GeoPrompt';

export const metadata: Metadata = {
    metadataBase: new URL('https://redepsilon.com.ar'),
    title: {
        default: 'Psicologos La Plata | Red y Agencia de Psicólogos en Argentina',
        template: '%s | Psicologos La Plata',
    },
    description:
        'Encontrá el psicólogo ideal para vos. Terapia presencial y online con profesionales matriculados en Argentina. Filtrá por especialidad, obra social y cercanía.',
    keywords: [
        'psicólogos buenos aires',
        'terapia online',
        'terapia cognitivo conductual',
        'psicoanálisis',
        'ansiedad',
        'salud mental argentina',
        'red epsilon',
        'psicólogos instagram',
    ],
    authors: [{ name: 'Martin Garrido' }],
    creator: 'Martin Garrido',
    openGraph: {
        type: 'website',
        locale: 'es_AR',
        url: 'https://psicologolaplata.ar',
        siteName: 'Psicologos La Plata',
        title: 'Psicologos La Plata | Directorio y Agencia de Psicólogos',
        description:
            'Descubrí, compará y contactá psicólogos matriculados. Terapia presencial y online en Buenos Aires y todo el país.',
        images: [
            {
                url: '/logo-epsilon.svg',
                width: 800,
                height: 800,
                alt: 'Logo Red Épsilon Psicología',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Psicologos La Plata | Agencia de Psicólogos',
        description: 'Encontrá tu espacio terapéutico ideal.',
    },
    icons: {
        icon: '/icon.svg',
        shortcut: '/icon.svg',
        apple: '/icon.svg',
    },
};

export const viewport: Viewport = {
    themeColor: '#4cc9f0',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='es' suppressHydrationWarning>
            <body className='min-h-screen flex flex-col transition-colors selection:bg-primary-400 selection:text-neutral-950'>
                <AuthProvider>
                    <div className='flex flex-col min-h-screen'>
                        <Navbar />
                        <div className='pt-20'>
                            <main className='flex-1'>{children}</main>
                        </div>
                        <Footer />
                        <WhatsAppFloating />
                        <GeoPrompt />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
