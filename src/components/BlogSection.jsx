import useRevealOnScroll from '../hooks/useRevealOnScroll.js';
import { useBlog } from '../context/BlogContext.jsx';

export default function BlogSection() {
  useRevealOnScroll('.reveal');
  const { posts, loading, error } = useBlog();
  const items = (posts || []).slice(0, 3);

  return (
    <section className="blog-section reveal">
      <div className="section-header">
        <span className="section-kicker">Tendances</span>
        <h2 className="section-title">Derniers Articles Beauté</h2>
      </div>

      <div className="blog-grid">
        {loading ? (
          <div className="blog-empty">Chargement des articles…</div>
        ) : error ? (
          <div className="blog-empty">{String(error || 'Erreur de chargement')}</div>
        ) : items.length === 0 ? (
          <div className="blog-empty">Aucun article pour le moment.</div>
        ) : null}
        {items.map((p) => (
          <div key={p.id} className="blog-card">
            <div className="blog-img">
              <img className="blog-photo blog-img-inner" src={p.image} alt={p.title} />
            </div>
            <div className="blog-date">{p.dateLabel || p.date}</div>
            <h3 className="blog-title">{p.title}</h3>
            <p className="blog-excerpt">{p.excerpt}</p>
            <a href={`#blog-detail?id=${encodeURIComponent(p.id)}`} className="btn-read-more">— Lire Plus —</a>
          </div>
        ))}
      </div>
    </section>
  );
}
