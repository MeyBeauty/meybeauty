import AnnounceBar from './components/AnnounceBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import RecentPurchaseToast from './components/RecentPurchaseToast.jsx';
import WishlistWidget from './components/WishlistWidget.jsx';
import { SkeletonPage } from './components/SkeletonLoader.jsx';
import { useEffect, useState, lazy, Suspense } from 'react';
import { ToastProvider } from './context/ToastContext.jsx';
import { HelmetProvider } from 'react-helmet-async';

// Lazy loading des pages pour performance
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const LegalPage = lazy(() => import('./pages/LegalPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage.jsx'));
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'));
const NosInstitutsPage = lazy(() => import('./pages/NosInstitutsPage.jsx'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const EventsPage = lazy(() => import('./pages/EventsPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

// Skeleton Loader - effet YouTube style shimmer
const PageLoader = () => <SkeletonPage />;

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash || '#home');

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash || '#home';
      setHash(next);

      const isAdminHash = next.startsWith('#admin');
      document.documentElement.style.zoom = isAdminHash ? '100%' : '100%';

      if (next === '#home' || next === '#about' || next === '#legal' || next === '#privacy' || next === '#contact' || next === '#blog' || next.startsWith('#blog-detail') || next.startsWith('#shop') || next === '#instituts' || next.startsWith('#service') || next === '#cart' || next === '#events' || next.startsWith('#product') || next.startsWith('#admin')) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  let page = 'home';
  if (hash.startsWith('#about')) page = 'about';
  if (hash === '#legal') page = 'legal';
  if (hash === '#privacy') page = 'privacy';
  if (hash === '#contact') page = 'contact';
  if (hash === '#blog') page = 'blog';
  if (hash.startsWith('#blog-detail')) page = 'blog-detail';
  if (hash.startsWith('#shop')) page = 'shop';
  if (hash === '#instituts') page = 'instituts';
  if (hash.startsWith('#service')) page = 'service';
  if (hash === '#cart') page = 'cart';
  if (hash === '#events') page = 'events';
  if (hash.startsWith('#product')) page = 'product';
  if (hash.startsWith('#admin')) page = 'admin';

  const serviceSlug = hash.replace('#service/', '').split('?')[0].split('#')[0] || 'visage';

  const isAdmin = page === 'admin';

  return (
    <ToastProvider>
      {isAdmin ? null : <AnnounceBar />}
      {isAdmin ? null : <Navbar />}
      {isAdmin ? null : <RecentPurchaseToast />}
      <Suspense fallback={<PageLoader />}>
        {page === 'about' ? (
          <AboutPage />
        ) : page === 'legal' ? (
          <LegalPage />
        ) : page === 'privacy' ? (
          <PrivacyPage />
        ) : page === 'contact' ? (
          <ContactPage />
        ) : page === 'blog' ? (
          <BlogPage />
        ) : page === 'blog-detail' ? (
          <BlogDetailPage />
        ) : page === 'shop' ? (
          <ShopPage />
        ) : page === 'instituts' ? (
          <NosInstitutsPage />
        ) : page === 'service' ? (
          <ServiceDetailPage slug={serviceSlug} />
        ) : page === 'cart' ? (
          <CartPage />
        ) : page === 'events' ? (
          <EventsPage />
        ) : page === 'product' ? (
          <ProductDetailPage />
        ) : page === 'admin' ? (
          <AdminPage />
        ) : (
          <HomePage />
        )}
      </Suspense>
      {isAdmin ? null : <Footer />}
      {isAdmin ? null : <WishlistWidget />}
    </ToastProvider>
  );
}
