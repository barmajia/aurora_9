import type { Metadata } from 'next';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  brand?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}

interface Organization {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  foundingDate?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    contactType: string;
    telephone: string;
    email?: string;
    areaServed?: string;
  }[];
}

interface BreadcrumbItem {
  name: string;
  item: string;
}

export const siteConfig = {
  name: 'Aurora',
  description: 'Next-Generation E-Commerce Platform - Discover premium products with cutting-edge technology',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://aurora.example.com',
  ogImage: 'https://aurora.example.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/aurora',
    github: 'https://github.com/aurora',
  },
  creator: 'Aurora Team',
};

export function generateMetadata({
  title,
  description,
  image,
  canonical,
  noIndex = false,
}: {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description: description || siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || siteConfig.url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical || siteConfig.url,
      title,
      description: description || siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
      creator: siteConfig.creator,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}

export function generateProductSchema(product: Product): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/products/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 0,
        }
      : undefined,
  };

  return JSON.stringify(schema);
}

export function generateOrganizationSchema(org: Organization): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    foundingDate: org.foundingDate,
    address: org.address
      ? {
          '@type': 'PostalAddress',
          ...org.address,
        }
      : undefined,
    contactPoint: org.contactPoint?.map((cp) => ({
      '@type': 'ContactPoint',
      ...cp,
    })),
  };

  return JSON.stringify(schema);
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return JSON.stringify(schema);
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(schema);
}

export const robotsConfig = {
  rules: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/_next/', '/static/'],
    },
    {
      userAgent: 'Googlebot',
      allow: '/',
      disallow: ['/checkout', '/account', '/profile'],
    },
  ],
  sitemap: `${siteConfig.url}/sitemap.xml`,
};
