import AnnounceBar from './components/AnnounceBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import RecentPurchaseToast from './components/RecentPurchaseToast.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogDetailPage from './pages/BlogDetailPage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import { useEffect, useState } from 'react';
import { ToastProvider } from './context/ToastContext.jsx';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash || '#home');

  useEffect(() => {
    const onHashChange = () => {
      const next = window.location.hash || '#home';
      setHash(next);

      const isAdminHash = next.startsWith('#admin');
      document.documentElement.style.zoom = isAdminHash ? '100%' : '100%';

      if (next === '#home' || next === '#about' || next === '#legal' || next === '#privacy' || next === '#contact' || next === '#blog' || next.startsWith('#blog-detail') || next.startsWith('#shop') || next === '#cart' || next.startsWith('#product') || next.startsWith('#admin')) {
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
  if (hash === '#cart') page = 'cart';
  if (hash.startsWith('#product')) page = 'product';
  if (hash.startsWith('#admin')) page = 'admin';

  const isAdmin = page === 'admin';

  return (
    <ToastProvider>
      {isAdmin ? null : <AnnounceBar />}
      {isAdmin ? null : <Navbar />}
      {isAdmin ? null : <RecentPurchaseToast />}
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
      ) : page === 'cart' ? (
        <CartPage />
      ) : page === 'product' ? (
        <ProductDetailPage />
      ) : page === 'admin' ? (
        <AdminPage />
      ) : (
        <HomePage />
      )}
      {isAdmin ? null : <Footer />}
    </ToastProvider>
  );
}
