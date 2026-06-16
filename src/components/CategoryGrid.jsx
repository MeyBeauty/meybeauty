import { useEffect, useMemo, useRef, useState } from 'react';

const CATS = [
  {
    id: 'cat-1',
    className: 'cat-item cat-1',
    kicker: 'Éclat',
    title: 'Soin du visage\nSur‑mesure',
    cta: '— Réserver maintenant —',
    video: 'https://www.pexels.com/fr-fr/download/video/9335813/',
    image: 'soin visage (2).PNG',
  },
  {
    id: 'cat-2',
    className: 'cat-item cat-2',
    kicker: 'Silhouette',
    title: 'Minceur &\nRemodelage',
    cta: '— Réserver maintenant —',
    video: 'https://www.pexels.com/fr-fr/download/video/32828416/',
    image: 'soin-minceur.PNG',
  },
  {
    id: 'cat-3',
    className: 'cat-item cat-3',
    kicker: 'Regard',
    title: 'Beauté du\nRegard',
    cta: '— Réserver maintenant —',
    video: 'https://www.pexels.com/fr-fr/download/video/8502623/',
    image: 'mey-beauty (6).jpeg',
  },
  {
    id: 'cat-4',
    className: 'cat-item cat-4',
    kicker: 'Mains',
    title: 'Onglerie\nPremium',
    cta: '— Réserver maintenant —',
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
  const [shouldLoad, setShouldLoad] = useState(false);

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
          setShouldLoad(true);
          const p = node.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          node.pause();
        }
      },
      { threshold: 0.35 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [allowVideo]);

  if (!allowVideo) return null;

  return (
    <video
      className="cat-bg-video"
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}

export default function CategoryGrid() {
  return (
    <section className="cat-grid">
      {CATS.map((cat) => (
        <div key={cat.id} className={cat.className}>
          <div className="cat-bg">
            {cat.video ? (
              <CatBgVideo src={cat.video} label={cat.kicker} />
            ) : null}

            {cat.imageOnly ? (
              <img className="cat-bg-photo" src={cat.image} alt={cat.kicker} />
            ) : null}
          </div>
          <div className="cat-overlay"></div>
          <div className="cat-content">
            <div className="cat-kicker">{cat.kicker}</div>
            <h3 className="cat-title">
              <TitleWithBreaks text={cat.title} />
            </h3>
            <a href="#contact" className="btn-cta-outline">{cat.cta}</a>
          </div>
        </div>
      ))}
    </section>
  );
}
