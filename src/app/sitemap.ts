import { MetadataRoute } from 'next';
import { MOCK_PROFESSIONALS, MOCK_ARTICLES } from '@/lib/data/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://redepsilon.com.ar';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/profesionales`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articulos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const professionalRoutes: MetadataRoute.Sitemap = MOCK_PROFESSIONALS.map((p) => ({
    url: `${baseUrl}/profesionales/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const articleRoutes: MetadataRoute.Sitemap = MOCK_ARTICLES.map((a) => ({
    url: `${baseUrl}/articulos/${a.slug}`,
    lastModified: new Date(a.published_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...professionalRoutes, ...articleRoutes];
}
