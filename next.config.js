/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: ['leaflet', 'react-leaflet'],
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: '**.supabase.co' },
            { protocol: 'https', hostname: 'plus.unsplash.com' },
            { protocol: 'https', hostname: 'randomuser.me' },
        ],
    },
    webpack: (config) => {
        config.externals = [...(config.externals || []), { canvas: 'canvas' }];
        return config;
    },
    // 👇 SOLUCIÓN PARA EL POPUP DE GOOGLE (se queda)
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' }],
            },
        ];
    },
};
module.exports = nextConfig;
