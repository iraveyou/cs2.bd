export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'cs2bd BD',
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    description: 'Premier Bangladesh Counter-Strike 2 Skin Marketplace with Escrow & bKash / Nagad Instant Payouts.',
    sameAs: [
      'https://facebook.com/cs2bdcs2bd',
      'https://discord.gg/cs2bdbd',
      'https://steamcommunity.com/groups/cs2bdbd'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+8801700112233',
      contactType: 'customer service',
      areaServed: 'BD',
      availableLanguage: ['en', 'bn']
    }
  };
}

export function generateProductSchema(product: {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  exterior?: string;
  floatValue?: number | null;
  image?: string;
  sellerName?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';
  const price = (product.priceCents / 100).toFixed(2);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image || `${baseUrl}/og-cs2.png`,
    description: product.description || `Buy ${product.name} (${product.exterior || 'CS2 Item'}) in Bangladesh with instant bKash or Nagad. Verified Escrow.`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Counter-Strike 2'
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/listing/${product.id}`,
      priceCurrency: 'BDT',
      price: price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: product.sellerName || 'cs2bd BD Merchant'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128'
    }
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith('http') ? it.item : `${baseUrl}${it.item}`
    }))
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  authorName?: string;
  imageUrl?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cs2bd.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.imageUrl || `${baseUrl}/og-cs2.png`,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.authorName || 'cs2bd Editorial'
    },
    publisher: {
      '@type': 'Organization',
      name: 'cs2bd BD',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`
      }
    }
  };
}
