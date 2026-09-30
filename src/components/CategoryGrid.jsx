import { useEffect, useMemo, useRef, useState } from 'react';

const CATS = [
  {
    id: 'cat-1',
    className: 'cat-item cat-1',
    kicker: 'Éclat',
    title: 'Soin du visage\nSur‑mesure',
    cta: '— Découvrir ce service —',
    href: '#service/visage',
    video: 'https://www.pexels.com/fr-fr/download/video/9335813/',
    image: '',
  },
  {
    id: 'cat-2',
    className: 'cat-item cat-2',
    kicker: 'Silhouette',
    title: 'Minceur',
    cta: '— Découvrir ce service —',
    href: '#service/minceur',
    video: 'https://www.pexels.com/fr-fr/download/video/32828416/',
    image: '',
  },
  {
    id: 'cat-6',
    className: 'cat-item cat-6 cat-split-item',
    isSplit: true,
    video: '/epilation.mp4',
    left: {
      kicker: 'Épilation',
      title: 'Épilation\nà la cire',
      cta: '— Découvrir ce service —',
      href: '#service/epilation-cire',
    },
    right: {
      kicker: 'Épilation',
      title: 'Épilation\ndéfinitive',
      cta: '— Découvrir ce service —',
      href: '#service/epilation-definitive',
    },
  },
  {
    id: 'cat-3',
    className: 'cat-item cat-3',
    kicker: 'Regard',
    title: 'Beauté du\nRegard',
    cta: '— Découvrir ce service —',
    href: '#service/regard',
    video: 'https://www.pexels.com/fr-fr/download/video/8502623/',
    image: '',
  },
  {
    id: 'cat-5',
    className: 'cat-item cat-5',
    kicker: 'Maillot',
    title: 'Soin du\nmaillot',
    cta: '— Découvrir ce service —',
    href: '#service/maillot',
    video: '/epilation du maillot.mp4',
  },
  {
    id: 'cat-4',
    className: 'cat-item cat-4',
    kicker: 'Mains',
    title: 'Onglerie\nPremium',
    cta: '— Découvrir ce service —',
    href: '#service/mains',
    video: '',
    imageOnly: true,
    image: 'meybeauty.jpg',
  },
];

function TitleWithBreaks({ text }) {
  return (
    <>
      {text.split('\n').map((part, idx) => (
        <span key={idx}>
          {part}
          {idx < text.split('\n').length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

function CatBgVideo({ src, label }) {
  const videoRef = useRef(null);

  const allowVideo = useMemo(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const saveData =
      typeof navigator !== 'undefined' &&
      navigator.connection &&
      navigator.connection.saveData;

    return !reduceMotion && !saveData;
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (!allowVideo) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          const p = node.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          node.pause();
        }
      },
      { threshold: 0.15 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [allowVideo]);

  if (!allowVideo) return null;

  return (
    <video
      className="cat-bg-video"
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={label}
    />
  );
}

export default function CategoryGrid({ items = CATS, className = 'cat-grid' }) {
  return (
    <section className={className}>
      {items.map((cat) => (
        <div key={cat.id} className={cat.className}>
          <div className="cat-bg">
            {cat.video ? (
              <CatBgVideo src={cat.video} label={cat.kicker || cat.left?.kicker} />
            ) : null}

            {cat.imageOnly ? (
              <img className="cat-bg-photo" src={cat.image} alt={cat.kicker} />
            ) : null}
          </div>

          <div className="cat-overlay"></div>

          {cat.isSplit ? (
            <div className="cat-split-wrapper">
              <div className="cat-split-side cat-split-left">
                <div className="cat-split-content">
                  <div className="cat-kicker">{cat.left.kicker}</div>
                  <h3 className="cat-title">
                    <TitleWithBreaks text={cat.left.title} />
                  </h3>
                  <a href={cat.left.href} className="btn-cta-outline">{cat.left.cta || '— Découvrir ce service —'}</a>
                </div>
              </div>

              <svg className="cat-split-svg-divider" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <line x1="58" y1="0" x2="42" y2="100" stroke="#FFFFFF" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              </svg>

              <div className="cat-split-side cat-split-right">
                <div className="cat-split-content">
                  <div className="cat-kicker">{cat.right.kicker}</div>
                  <h3 className="cat-title">
                    <TitleWithBreaks text={cat.right.title} />
                  </h3>
                  <a href={cat.right.href} className="btn-cta-outline">{cat.right.cta || '— Découvrir ce service —'}</a>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="cat-overlay"></div>
              <div className="cat-content">
                <div className="cat-kicker">{cat.kicker}</div>
                <h3 className="cat-title">
                  <TitleWithBreaks text={cat.title} />
                </h3>
                <a href={cat.href} className="btn-cta-outline">{cat.cta || '— Découvrir ce service —'}</a>
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
}
