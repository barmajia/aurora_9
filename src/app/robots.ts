import { robotsConfig, siteConfig } from '@/lib/seo';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: robotsConfig.rules.map((rule) => ({
      userAgent: rule.userAgent,
      allow: rule.allow,
      disallow: rule.disallow,
    })),
    sitemap: robotsConfig.sitemap,
  };
}
