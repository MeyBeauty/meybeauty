import { useEffect, useState } from 'react';

const SLIDES = [
 
  {
    id: 1,
    kicker: 'Soins minceur',
    title: (
      <>
        Soins <em>minceur</em>
        <br />
        et bien‑être
      </>
    ),
    subtitle:
      'soins minceur et bien etre : drainage, cures et accompagnement pour votre silhouette.',
    leftImage: 'soin minceur (1).jpg',
    rightImage: 'soin minceur (2).jpg',
  },
  {
    id: 2,
    kicker: 'Soin spa',
    title: (
      <>
        Soin <em>spa</em>
        <br />
        &amp; détente
      </>
    ),
    subtitle:
      'soin spa : une parenthèse de calme, des gestes experts et une vraie relaxation.',
    leftImage: 'soin visage.PNG',
    rightImage: 'soin spa (1).JPG',
  },
  {
    id: 3,
    kicker: 'Massages corps',
    title: (
      <>
        Massages <em>corps</em>
        <br />
        bien‑être
      </>
    ),
    subtitle:
      'massages corps : relâcher les tensions, apaiser l’esprit et retrouver l’énergie.',
    leftImage: 'massage-corps.JPG',
    rightImage: 'massage-corps (2).jpg',
  },
   {
    id: 0,
    kicker: 'Mey Beauty',
    title: (
      <>
        Soin <em>visage</em>
        <br />
        sur‑mesure
      </>
    ),
    subtitle:
      'soin visage : nettoyage, éclat, hydratation — des résultats visibles et durables.',
    leftImage: 'soin visage (2).PNG',
    rightImage: 'soin visage (1).PNG',
  },
  {
    id: 4,
    kicker: 'Beauté du regard',
    title: (
      <>
        Beauté du <em>regard</em>
        <br />
        &amp; finitions
      </>
    ),
    subtitle:
      'beaute du regard : rehaussement, brow lift, teinture — un résultat élégant et précis.',
    leftImage: 'regard.jpg',
    rightImage: 'beauté regard (3).PNG',
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const slide = SLIDES[activeSlide];
  const [tick, setTick] = useState(0);

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

  useEffect(() => {
    if (document.visibilityState === 'hidden') return;
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(id);
  }, [isMobile, tick]);

  useEffect(() => {
    const onVisibility = () => setTick((v) => v + 1);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const goTo = (idx) => {
    setActiveSlide(idx);
    setTick((v) => v + 1);
  };

  return (
    <section className="hero">
      <div className="hero-col hero-left">
        <div className="hero-bg">
          <img className="hero-photo" src={slide.leftImage} alt="Manucure et nail art" />
        </div>
      </div>

      <div className="hero-col hero-center">

        <div className="hero-mobile-image">
          <img className="hero-photo" src={slide.leftImage} alt="Photo mise en avant" />
        </div>

        <div className="hero-slide active" key={slide.id}>
          <span className="hero-kicker">{slide.kicker}</span>
          <h2 className="hero-title">{slide.title}</h2>
          <p className="hero-subtitle">{slide.subtitle}</p>
        </div>

        <a href="#about" className="btn-cta">Découvrir</a>
        <div className="hero-dots-area" aria-label="Navigation hero">
          <div className="hero-dots">
            {SLIDES.map((s, idx) => (
              <span
                key={s.id}
                className={idx === activeSlide ? 'active' : ''}
                onClick={() => goTo(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Aller au slide ${idx + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') goTo(idx);
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-col hero-right">
        <div className="hero-bg">
          <img className="hero-flatlay" src={slide.rightImage} alt="Produits cosmétiques professionnels" />
        </div>
      </div>

    </section>
  );
}
