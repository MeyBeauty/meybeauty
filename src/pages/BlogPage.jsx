import { useEffect, useMemo, useState } from 'react';
import { useBlog } from '../context/BlogContext.jsx';
import SEO from '../components/SEO.jsx';
import { buildPostUrl, generateSlug } from '../utils/slug.js';

const TAGS = ['Institut', 'Spa', 'Soin Visage', 'Bien‑être', 'Massage'];

const PAGE_SIZE = 4;

export default function BlogPage() {
  const { posts, loading, error } = useBlog();
  const items = posts || [];
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const hash = String(window.location.hash || '');
    if (!hash.startsWith('#blog')) return;
    const idx = hash.indexOf('?');
    if (idx < 0) return;
    const qs = hash.slice(idx + 1);
    const params = new URLSearchParams(qs);
    const q = params.get('search');
    if (q) setQuery(String(q));
  }, []);

  const filtered = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const hay = [p.title, p.excerpt, p.category, p.author, p.dateLabel, p.date]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered.length]);
  const pageItems = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const onSubmitSearch = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  return (
    <>
      <SEO
        title="Blog Beauté - Conseils Soins Visage & Bien-être | Mey Beauty 91"
        description="Blog beauté de Mey Beauty Viry-Châtillon (91). Conseils soins visage, massages bien-être, astuces épilation et tendances beauté en Essonne et Ile-de-France."
        keywords="blog beauté Viry-Châtillon, conseils soins visage Essonne 91, massage bien-être IDF, astuces épilation Ile-de-France, tendances beauté 91, institut beauté conseils"
      />
      <main className="blog-page">
      <section className="page-hero-banner" aria-label="Bannière">
        <h1>Blog</h1>
        <div className="breadcrumb">
          <a href="#home">Accueil</a>
          <span>/</span>
          <span>Blog</span>
        </div>
      </section>

      <section className="blog-layout" aria-label="Articles">
        <div>
          <div className="articles-grid">
            {loading ? (
              <div className="admin-empty">Chargement des articles…</div>
            ) : error ? (
              <div className="admin-empty">{String(error || 'Erreur de chargement')}</div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty">Aucun article pour le moment.</div>
            ) : null}
            {pageItems.map((p) => (
              <article key={p.id} className="article-card">
                <div className="article-img-wrap">
                  <img src={p.image} alt={p.title} className="article-img" loading="lazy" />
                </div>
                <div className="article-date">{p.dateLabel || p.date}</div>
                <h2 className="article-title">{p.title}</h2>
                <p className="article-excerpt">{p.excerpt}</p>
                <a href={buildPostUrl(p)} className="btn-read">Lire plus</a>
              </article>
            ))}
          </div>

          <div className="pagination" aria-label="Pagination">
            <button
              className={`page-btn arrow-btn${page <= 1 ? ' disabled' : ''}`}
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              ←
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const n = idx + 1;
              return (
                <button
                  key={n}
                  className={`page-btn${n === page ? ' active' : ''}`}
                  type="button"
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              );
            })}
            <button
              className={`page-btn arrow-btn${page >= totalPages ? ' disabled' : ''}`}
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              →
            </button>
          </div>
        </div>

        <aside className="sidebar" aria-label="Sidebar">
          <div className="sidebar-search">
            <input
              type="text"
              placeholder="Rechercher…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmitSearch();
              }}
            />
            <button type="button" aria-label="Rechercher" onClick={onSubmitSearch}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>

          <div>
            <div className="sidebar-title">Articles récents</div>
            <div className="recent-posts">
              {items.slice(0, 5).map((p) => (
                <a
                  key={`recent-${p.id}`}
                  className="recent-post"
                  href={buildPostUrl(p)}
                  aria-label={`Lire l’article ${p.title}`}
                >
                  <img src={p.image} alt={p.title} className="recent-thumb" loading="lazy" />
                  <div className="recent-info">
                    <div className="recent-date">{String(p.dateLabel || p.date || '').split(' ')[0].toUpperCase()}</div>
                    <div className="recent-title">{p.title}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="sidebar-gallery" aria-label="Galerie">
              <img src="/massage-corps%20(2).jpg" alt="Massage" className="gallery-img" loading="lazy" />
              <img src="/soin%20visage%20(2).PNG" alt="Spa" className="gallery-img" loading="lazy" />
              <img src="/soin%20visage%20(2).PNG" alt="Soin visage" className="gallery-img" loading="lazy" />
              <img src="/soin%20minceur%20(2).jpg" alt="Minceur" className="gallery-img" loading="lazy" />
              <img src="/beauté%20regard%20(3).PNG" alt="Regard" className="gallery-img" loading="lazy" />
              <img src="/meybeauty.jpg" alt="Institut" className="gallery-img" loading="lazy" />
            </div>
          </div>

          <div>
            <div className="sidebar-title">Tags</div>
            <div className="tags-wrap">
              {TAGS.map((t) => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>

          <div className="sidebar-banner" aria-label="Bannière">
            <img src="/soin%20spa%20(1).JPG" alt="Mey Beauty" />
            <div className="banner-overlay">
              <div className="banner-logo">Mey Beauty</div>
              <div className="banner-sub">Soin visage · Spa · Massages · Regard</div>
              <div className="banner-tag">Détente &amp; Éclat</div>
            </div>
          </div>
        </aside>
      </section>
    </main>
    </>
  );
}
