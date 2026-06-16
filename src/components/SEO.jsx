import { Helmet } from 'react-helmet-async';

const defaultSEO = {
  title: 'Mey Beauty - Institut de Beauté Viry-Châtillon | Soins Visage & Corps',
  description: 'Institut de beauté Mey Beauty à Viry-Châtillon (Essonne 91). Soins visage, massages relaxants, épilation, onglerie, produits cosmétiques LPG. Réservez votre soin esthétique près de Paris.',
  keywords: 'institut beauté Viry-Châtillon, esthéticienne Essonne 91, soin visage IDF, massage relaxant Ile-de-France, épilation Viry, onglerie Essonne, cosmétiques LPG, maquillage permanent, institut beauté proche Paris, soins esthétiques 91',
  image: 'https://meybeauty.fr/soin%20visage%20(2).PNG',
  url: 'https://meybeauty.fr/',
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
      url: `https://meybeauty.fr/#product?id=${product.id}`,
    },
    category: product.category,
  };
}

// Helper to generate local business schema - Optimisé pour SEO local IDF
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'Mey Beauty',
    alternateName: 'Mey Beauty Paris',
    description: 'Institut de beauté à Viry-Châtillon spécialisé en soins visage, massages du corps, épilation, onglerie et produits cosmétiques premium LPG. Situé en Essonne (91), près de Paris.',
    url: 'https://meybeauty.fr/',
    telephone: '+33-7-49-22-68-01',
    email: 'contact@meybeauty.fr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '6 Place des Martyrs de Châteaubriand',
      addressLocality: 'Viry-Châtillon',
      addressRegion: 'Île-de-France',
      postalCode: '91170',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.6681,
      longitude: 2.3881,
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
    image: 'https://meybeauty.fr/soin%20visage%20(2).PNG',
    sameAs: [],
    areaServed: {
      '@type': 'City',
      name: 'Viry-Châtillon',
      containsPlace: [
        { '@type': 'City', name: 'Essonne' },
        { '@type': 'City', name: 'Paris' },
        { '@type': 'City', name: 'Île-de-France' },
      ],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services de beauté',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Soin visage' },
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Massage du corps' },
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Épilation' },
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Onglerie' },
        },
        {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'Maquillage permanent' },
        },
      ],
    },
  };
}

// Helper to safely convert Firestore timestamp or Date to ISO string
function toISOString(dateValue) {
  if (!dateValue) return new Date().toISOString();
  // Firestore Timestamp has toDate() method
  if (typeof dateValue.toDate === 'function') {
    return dateValue.toDate().toISOString();
  }
  // Regular Date object
  if (dateValue instanceof Date) {
    return dateValue.toISOString();
  }
  // String timestamp
  if (typeof dateValue === 'string') {
    return new Date(dateValue).toISOString();
  }
  return new Date().toISOString();
}

// Helper to generate article schema for blog posts
export function generateArticleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.image || '',
    datePublished: toISOString(post.createdAt),
    dateModified: toISOString(post.updatedAt || post.createdAt),
    author: {
      '@type': 'Organization',
      name: 'Mey Beauty Paris',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mey Beauty Paris',
      logo: {
        '@type': 'ImageObject',
        url: 'https://meybeauty.fr/soin visage (2).PNG',
      },
    },
    url: `https://meybeauty.fr/#blog-detail/${post.slug || post.id}`,
  };
}
