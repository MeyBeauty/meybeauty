import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const submitSearch = () => {
    const q = (searchValue || '').trim();
    window.location.hash = q ? `#shop?search=${encodeURIComponent(q)}` : '#shop';
    setSearchOpen(false);
  };

  return (
    <>
      <div
        className={`mobile-drawer-overlay${searchOpen ? ' open' : ''}`}
        onClick={() => setSearchOpen(false)}
      ></div>

      {searchOpen ? (
        <div className="nav-search-modal" role="dialog" aria-label="Recherche">
          <div className="nav-search-box">
            <input
              type="text"
              placeholder="Rechercher un produit…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitSearch();
              }}
              autoFocus
            />
            <button type="button" onClick={submitSearch} aria-label="Rechercher">
              Rechercher
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`mobile-drawer-overlay${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      <aside className={`mobile-drawer${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="mobile-drawer-top">
          <a href="#home" onClick={() => setMobileOpen(false)} aria-label="Aller à l’accueil">
            <img src="/mey-beauty.png" alt="Mey Beauty" style={{ maxHeight: 36, width: 'auto' }} />
          </a>
          <button className="mobile-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
            ✕
          </button>
        </div>
        <ul className="mobile-drawer-links">
          <li><a href="#home" onClick={() => setMobileOpen(false)}>Accueil</a></li>
          <li><a href="#about" onClick={() => setMobileOpen(false)}>À Propos</a></li>
          <li><a href="#shop" onClick={() => setMobileOpen(false)}>Boutique</a></li>
          <li><a href="#blog" onClick={() => setMobileOpen(false)}>Blog</a></li>
 
          <li><a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a></li>
        </ul>
      </aside>

      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="mainNav">
        <a className="nav-logo" href="#home" aria-label="Aller à l’accueil">
          <img src="/mey-beauty.png" alt="Mey Beauty" />
        </a>
        <ul className="nav-menu">
          <li><a href="#home">Accueil</a></li>
          <li><a href="#about">À Propos</a></li>
          <li><a href="#shop">Boutique</a></li>
          <li><a href="#blog">Blog</a></li>
          
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-actions">
          <button aria-label="Recherche" onClick={() => setSearchOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button
            className="cart-btn"
            aria-label="Panier"
            onClick={() => {
              window.location.hash = '#cart';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-count">{count}</span>
          </button>
          <button className="mobile-menu-btn" aria-label="Menu" onClick={() => setMobileOpen(true)}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="0" y1="1" x2="20" y2="1" />
              <line x1="0" y1="7" x2="20" y2="7" />
              <line x1="0" y1="13" x2="20" y2="13" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
