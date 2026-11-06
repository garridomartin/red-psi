import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard', '/favoritos'],
        },
        sitemap: 'https://redpsicologos.com.ar/sitemap.xml',
    };
}
