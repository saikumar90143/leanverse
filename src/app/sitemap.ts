import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const routes = [
    '',
    '/diet-planner',
    '/workout-planner',
    '/calculators/bmi',
    '/calculators/maintenance',
    '/calculators/macro',
    '/calculators/body-fat',
    '/calculators/water',
    '/progress',
    '/recipes',
    '/blog',
    '/blog/ultimate-indian-diet-plan-fat-loss',
    '/blog/gym-workouts-perfect-push-pull-legs-split',
    '/blog/home-workouts-fat-loss-minimal-equipment',
    '/store',
    '/pricing',
    '/about',
    '/privacy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
