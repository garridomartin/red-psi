/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: ['leaflet', 'react-leaflet'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
            },
        ],
    },
    webpack: (config) => {
        config.externals = [...(config.externals || []), { canvas: 'canvas' }];
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/rest/v1/:path*',
                destination: 'http://localhost:3001/:path*',
            },
        ];
    },
    // 👇 ACÁ AGREGAMOS LA SOLUCIÓN PARA EL POPUP DE GOOGLE
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
