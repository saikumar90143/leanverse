import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import BlogPost from '@/lib/models/BlogPost';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leanverse.vercel.app';
  
  const staticRoutes = [
    '',
    '/diet-planner',
    '/workout-planner',
    '/food-tracker',
    '/calculators/bmi',
    '/calculators/maintenance',
    '/calculators/macro',
    '/calculators/body-fat',
    '/calculators/water',
    '/blog',
    '/recipes',
    '/store',
    '/pricing',
    '/about',
    '/privacy',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' || route.includes('-tracker') || route.includes('-planner') ? 1.0 : 0.8,
  }));

  try {
    await dbConnect();
    const posts = await BlogPost.find({ status: 'published' }).select('slug updatedAt').lean();
    
    posts.forEach((post: any) => {
      sitemapEntries.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
  }

  return sitemapEntries;
}
