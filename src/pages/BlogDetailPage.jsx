import { User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useBlog } from '../context/BlogContext.jsx';
import SEO, { generateArticleSchema } from '../components/SEO.jsx';
import { parseSlugFromHash, generateSlug, buildPostUrl } from '../utils/slug.js';

function parsePostIdentifierFromHash(hash) {
  return parseSlugFromHash(hash);
}

export default function BlogDetailPage() {
  const { getPostById, getPostBySlug, posts, loading } = useBlog();
  const [identifier, setIdentifier] = useState(() => parsePostIdentifierFromHash(window.location.hash || ''));
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onHash = () => setIdentifier(parsePostIdentifierFromHash(window.location.hash || ''));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('[BlogDetail] identifier:', identifier);
    console.log('[BlogDetail] posts available:', posts?.length || 0);
    console.log('[BlogDetail] loading:', loading);
  }, [identifier, posts, loading]);

  const post = useMemo(() => {
    if (!identifier) return null;
    let found = null;
    if (identifier.type === 'slug') {
      found = getPostBySlug(identifier.value);
    } else {
      found = getPostById(identifier.value);
    }
    console.log('[BlogDetail] Looking for:', identifier, 'Found:', found);
    return found;
  }, [identifier, getPostById, getPostBySlug, posts]);

  const title = post?.title || 'Article';
  const hero = post?.image || '/soin%20visage%20(2).PNG';
  const dateLabel = post?.dateLabel || post?.date || '-';

  const recent = useMemo(() => {
    const list = Array.isArray(posts) ? posts.slice() : [];
    list.sort((a, b) => {
      const ta = new Date(a?.updatedAt || a?.date || 0).getTime();
      const tb = new Date(b?.updatedAt || b?.date || 0).getTime();
      return tb - ta;
    });
    return list.filter((p) => p && p.id && p.id !== post?.id).slice(0, 5);
  }, [posts, post?.id]);

  const onSubmitSearch = () => {
    const q = String(query || '').trim();
    window.location.hash = q ? `#blog?search=${encodeURIComponent(q)}` : '#blog';
  };

  const structuredData = post ? generateArticleSchema(post) : null;

  return (
    <>
      <SEO
        title={title}
        description={post?.excerpt || 'Article du blog Mey Beauty Paris'}
        keywords={`${post?.category || 'blog'}, beauté, soins, Mey Beauty`}
        image={hero}
        type="article"
        structuredData={structuredData}
      />
      <main className="blog-detail-page">
      <section className="page-hero-banner" aria-label="Bannière">
        <h1>{post?.title || 'Article'}</h1>
        <div className="breadcrumb">
          <a href="#home">Accueil</a>
          <span>/</span>
          <a href="#blog">Blog</a>
          <span>/</span>
          <span>{post?.title || 'Article'}</span>
        </div>
      </section>

      <section className="blog-detail-layout" aria-label="Détail de l’article">
        <article className="blog-detail-article">
          {!loading && post && (
          <img
            src={hero}
            alt={title}
            className="blog-article-hero"
            loading="lazy"
          />
          )}

          {!loading && post && (
          <div className="blog-article-meta">
            <div className="blog-article-meta-left">
              {String(dateLabel).toUpperCase()}
              <span className="sep">/</span>
              1 COMMENTAIRE
            </div>
            <div className="blog-article-author">
              <div className="author-avatar" aria-hidden="true">
                <User />
              </div>
              <div>
                <span className="author-written-by">Rédigé par</span>
                <span className="author-name">Mey Beauty</span>
              </div>
            </div>
          </div>
          )}

          {!loading && post && (
          <h1 className="blog-article-h1">
            {title}
          </h1>
          )}

          {loading ? (
            <div className="legal-block">
              <p>Chargement de l&apos;article...</p>
            </div>
          ) : post ? (
            <div
              className="blog-article-rich"
              dangerouslySetInnerHTML={{ __html: post.contentHtml || `<p>${post.excerpt || ''}</p>` }}
            />
          ) : (
            <div className="legal-block">
              <h2>Article introuvable</h2>
              <p>
                Cet article n’existe pas ou a été retiré.
                <br />
                <a href="#blog">Retour au blog</a>
              </p>
            </div>
          )}

          {!loading && post && (
          <div className="comments-section">

          </div>
          )}
        </article>

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
              {recent.map((p) => (
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
              <img src="/soin%20visage%20(2).PNG" alt="Soin visage" className="gallery-img" loading="lazy" />
              <img src="/soin%20visage%20(2).PNG" alt="Spa" className="gallery-img" loading="lazy" />
              <img src="/massage-corps%20(2).jpg" alt="Massage" className="gallery-img" loading="lazy" />
              <img src="/soin%20minceur%20(2).jpg" alt="Minceur" className="gallery-img" loading="lazy" />
              <img src="/beauté%20regard%20(3).PNG" alt="Regard" className="gallery-img" loading="lazy" />
              <img src="/meybeauty.jpg" alt="Institut" className="gallery-img" loading="lazy" />
            </div>
          </div>

          <div>
            <div className="sidebar-title">Tags</div>
            <div className="tags-wrap">
              <span className="tag-pill">SOIN VISAGE (9)</span>
              <span className="tag-pill">SPA (4)</span>
              <span className="tag-pill">BIEN‑ÊTRE (6)</span>
              <span className="tag-pill">MASSAGE (3)</span>
            </div>
          </div>

          <div className="sidebar-banner" aria-label="Bannière">
            <img src="/soin%20spa%20(1).JPG" alt="Mey Beauty" loading="lazy" />
            <div className="banner-overlay">
              <div className="banner-logo">Mey Beauty</div>
              <div className="banner-sub">Spa · Massages · Visage</div>
              <div className="banner-tag">Détente &amp; Éclat</div>
            </div>
          </div>
        </aside>
      </section>
    </main>
    </>
  );
}
