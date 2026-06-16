import useRevealOnScroll from '../hooks/useRevealOnScroll.js';
import { useEffect, useMemo, useState } from 'react';

const TESTIMONIALS = [
  {
    id: 1,
    text:
      '« La qualité des produits Mey Beauty Paris est absolument remarquable. Ma peau est transformée depuis que j\'utilise le sérum Vitamine C. »',
    name: 'Lucetta Birgitta',
    role: 'Artiste',
    stars: 5,
    avatar:
      'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    text:
      "« Des textures luxueuses et des parfums subtils. Le fond de teint couvrance totale tient toute la journée sans s'oxyder. Je suis conquise. »",
    name: 'Ondina Flavia',
    role: 'Danseuse',
    stars: 5,
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    text:
      "« Je recommande vivement la gamme Mey Beauty à toutes mes étudiantes. Des produits éthiques, efficaces et d'une élégance parisienne incomparable. »",
    name: 'Dagny Amélia',
    role: 'Professeur',
    stars: 5,
    avatar:
      'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=200&q=80',
  },
];

function Stars({ value }) {
  return (
    <div className="testi-stars">
      {Array.from({ length: 5 }).map((_, idx) => (
        <span key={idx} className="star">
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  useRevealOnScroll('.reveal');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const items = useMemo(() => TESTIMONIALS, []);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const sync = () => setIsMobile(mq.matches);

    sync();
    if (mq.addEventListener) {
      mq.addEventListener('change', sync);
      return () => mq.removeEventListener('change', sync);
    }

    mq.addListener(sync);
    return () => mq.removeListener(sync);
  }, []);

  return (
    <section className="testimonials-section reveal">
      <div className="testimonials-bg"></div>

      <svg className="testimonials-branches" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <path d="M380 10 Q320 60 280 120 Q240 180 260 250 Q280 310 240 370" stroke="#8A6848" strokeWidth="1.5" fill="none" />
        <path d="M360 20 Q300 80 270 150 Q250 210 270 280" stroke="#8A6848" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M320 5 Q290 50 260 110" stroke="#8A6848" strokeWidth="1" fill="none" opacity="0.4" />
        <circle cx="276" cy="122" r="4" fill="#C4906A" />
        <circle cx="261" cy="152" r="3" fill="#D4A880" />
        <circle cx="272" cy="250" r="4" fill="#C4906A" />
        <circle cx="239" cy="372" r="3" fill="#D4A880" />
        <ellipse cx="295" cy="135" rx="8" ry="4" fill="#A07848" transform="rotate(-30 295 135)" opacity="0.6" />
        <ellipse cx="250" cy="200" rx="7" ry="3" fill="#A07848" transform="rotate(20 250 200)" opacity="0.5" />
      </svg>

      <div className="testimonials-inner">
        <div className="testimonials-header">
          <span className="testimonials-kicker">Clients Premium</span>
          <h2 className="testimonials-title">Témoignages &amp; Avis</h2>
          <p className="testimonials-subtitle">
            La confiance de nos clientes est notre plus belle récompense. Découvrez leurs expériences avec Mey Beauty Paris.
          </p>
          <div className="testimonials-nav">
            <button aria-label="Précédent" onClick={goPrev}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15,18 9,12 15,6" /></svg>
            </button>
            <button aria-label="Suivant" onClick={goNext}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9,18 15,12 9,6" /></svg>
            </button>
          </div>
        </div>

        <div className="testimonials-cards">
          <div
            className="testimonials-track"
            style={isMobile ? { transform: `translateX(-${activeIndex * 100}%)` } : undefined}
          >
            {items.map((t) => (
              <div key={t.id} className="testi-card">
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">
                    <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="testi-info">
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                    <Stars value={t.stars} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials-dots" aria-label="Navigation témoignages">
          {items.map((t, idx) => (
            <span
              key={t.id}
              className={idx === activeIndex ? 'active' : ''}
              onClick={() => setActiveIndex(idx)}
              role="button"
              tabIndex={0}
              aria-label={`Aller au témoignage ${idx + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setActiveIndex(idx);
              }}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}
