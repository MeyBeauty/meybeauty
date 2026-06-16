import { Helmet } from 'react-helmet-async';

const defaultSEO = {
  title: 'Mey Beauty Paris — Soins Esthétiques & Cosmétiques Premium',
  description: 'Découvrez Mey Beauty Paris, institut d\'esthétique de luxe. Soins visage, massages corps, épilation laser, maquillage permanent et produits cosmétiques premium LPG.',
  keywords: 'institut beauté paris, soin visage, massage corps, épilation laser, cosmétiques LPG, maquillage permanent, esthétique, bien-être, minceur',
  image: 'https://mey-beauty.com/soin visage (2).PNG',
  url: 'https://mey-beauty.com/',
  type: 'website',
};

export default function SEO({ 
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.url,
  type = defaultSEO.type,
  noindex = false,
  structuredData = null,
}) {
  const fullTitle = title === defaultSEO.title ? title : `${title} | Mey Beauty Paris`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Helper to generate product structured data
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || '',
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Mey Beauty',
    },
    offers: {
      '@type': 'Offer',
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: product.currency || 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://mey-beauty.com/#product?id=${product.id}`,
    },
    category: product.category,
  };
}

// Helper to generate local business schema
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'Mey Beauty Paris',
    description: 'Institut d\'esthétique de luxe à Paris. Soins visage, massages corps, épilation laser, maquillage permanent.',
    url: 'https://mey-beauty.com/',
    telephone: '+33-1-XX-XX-XX-XX',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Adresse à compléter',
      addressLocality: 'Paris',
      postalCode: '75000',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.8566,
      longitude: 2.3522,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '18:00',
      },
    ],
    priceRange: '€€',
    image: 'https://mey-beauty.com/soin visage (2).PNG',
  };
}

// Helper to generate article schema for blog posts
export function generateArticleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.image || '',
    datePublished: post.createdAt?.toISOString() || new Date().toISOString(),
    dateModified: post.updatedAt?.toISOString() || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Mey Beauty Paris',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mey Beauty Paris',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mey-beauty.com/soin visage (2).PNG',
      },
    },
    url: `https://mey-beauty.com/#blog/${post.slug || post.id}`,
  };
}
