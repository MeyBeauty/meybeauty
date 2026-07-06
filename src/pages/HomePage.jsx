import Hero from '../components/Hero.jsx';
import HashtagBanner from '../components/HashtagBanner.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import ProductsSection from '../components/ProductsSection.jsx';
// import LookbookSection from '../components/LookbookSection.jsx';
import TestimonialsSection from '../components/TestimonialsSection.jsx';
import BlogSection from '../components/BlogSection.jsx';
import InstagramSection from '../components/InstagramSection.jsx';
import BrandsSection from '../components/BrandsSection.jsx';
import SEO, { generateLocalBusinessSchema } from '../components/SEO.jsx';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Mey Beauty - Institut Beauté Viry-Châtillon (91) | Soins Visage & Massage"
        description="Institut de beauté Mey Beauty à Viry-Châtillon, Essonne (91). Soins visage professionnels, massages relaxants, épilation, onglerie et produits cosmétiques LPG. Proche de Paris, votre esthéticienne en Ile-de-France."
        keywords="institut beauté Viry-Châtillon, esthéticienne Essonne 91, soin visage IDF, massage relaxant Ile-de-France, épilation Viry, onglerie Essonne, cosmétiques LPG, maquillage permanent, institut beauté proche Paris, soins esthétiques 91, spa bien-être Viry"
        structuredData={generateLocalBusinessSchema()}
      />
      <main id="home">
      <Hero />
      <HashtagBanner />
      <CategoryGrid />
      <ProductsSection />
      {/* <LookbookSection /> */}
      <TestimonialsSection />
      <BlogSection />
      <InstagramSection />
      <BrandsSection />
    </main>
    </>
  );
}
