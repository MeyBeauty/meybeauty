import Hero from '../components/Hero.jsx';
import HashtagBanner from '../components/HashtagBanner.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import ProductsSection from '../components/ProductsSection.jsx';
import LookbookSection from '../components/LookbookSection.jsx';
import TestimonialsSection from '../components/TestimonialsSection.jsx';
import BlogSection from '../components/BlogSection.jsx';
import InstagramSection from '../components/InstagramSection.jsx';
import BrandsSection from '../components/BrandsSection.jsx';
import SEO, { generateLocalBusinessSchema } from '../components/SEO.jsx';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Mey Beauty Paris — Soins Esthétiques & Cosmétiques Premium"
        description="Découvrez Mey Beauty Paris, institut d'esthétique de luxe. Soins visage, massages corps, épilation laser, maquillage permanent et produits cosmétiques premium LPG."
        keywords="institut beauté paris, soin visage, massage corps, épilation laser, cosmétiques LPG, maquillage permanent, esthétique, bien-être, minceur"
        structuredData={generateLocalBusinessSchema()}
      />
      <main id="home">
      <Hero />
      <HashtagBanner />
      <CategoryGrid />
      <ProductsSection />
      <LookbookSection />
      <TestimonialsSection />
      <BlogSection />
      <InstagramSection />
      <BrandsSection />
    </main>
    </>
  );
}
