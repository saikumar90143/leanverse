import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const routes = [
    '',
    '/diet-planner',
    '/workout-planner',
    '/workout-tracker',
    '/food-tracker',
    '/ai-diet-planner',
    '/progressive-overload-tracker',
    '/calculators/bmi',
    '/calculators/maintenance',
    '/calculators/macro',
    '/calculators/body-fat',
    '/calculators/water',
    '/progress',
    '/blog',
    '/store',
    '/pricing',
    '/about',
    '/privacy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' || route.includes('-tracker') || route.includes('-planner') ? 1.0 : 0.8,
  }));
}
