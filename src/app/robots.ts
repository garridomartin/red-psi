import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/favoritos'],
    },
    sitemap: 'https://redepsilon.com.ar/sitemap.xml',
  };
}
