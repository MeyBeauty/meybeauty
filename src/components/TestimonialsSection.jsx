import useRevealOnScroll from '../hooks/useRevealOnScroll.js';
import { useEffect, useMemo, useState } from 'react';

const TESTIMONIALS = [
  {
    id: 1,
    text: "Je vais voir Chloé tous les mois depuis presque un an, et c'est toujours un plaisir ! Son travail est impeccable et l'ambiance au top, c'est pour ça que je n'ai pas hésité à la suivre quand elle a changé de salon.",
    name: 'Héloïse Dmy',
    role: 'Local Guide · 7 avis',
    service: 'Manucure',
    date: "il y a 7 mois",
    stars: 5,
    initials: 'HD',
  },
  {
    id: 2,
    text: "Une expérience absolument parfaite ! J'ai fait mes ongles en pose américaine dans ce salon de manucure et le résultat est incroyable. La prothésiste ongulaire Chloé est très professionnelle, douce et attentive aux détails. La tenue est impeccable même après plusieurs semaines. Le design des ongles est magnifique, le nail art personnalisé est fait avec beaucoup de goût. Le lieu est propre et accueillant. Je recommande à 100 % cet institut de beauté spécialisé dans les ongles et les cils. Un vrai coup de cœur pour cette nail artist passionnée qui sait sublimer les mains avec élégance.",
    name: 'Earine',
    role: '4 avis · 1 photo',
    service: 'Manucure',
    date: "il y a 7 mois",
    stars: 5,
    initials: 'E',
  },
  {
    id: 3,
    text: "Franchement la meilleure prothésiste ongulaire de Viry-Châtillon (91) : Chloé alias beautybyc sans aucun doute !!! Elle me fait mes poses de Gel X, mon semi-permanent et mes nail arts (les plus fous) depuis un bon moment maintenant ! Elle prend toujours le temps d'écouter mes envies et elle arrive toujours à sublimer mes idées (même quand je pars loin). Un vrai moment de détente à chaque rendez-vous, dans une ambiance super agréable au salon. Si vous cherchez une pro en pose de gel et nail art dans le 91, foncez les yeux fermés !",
    name: 'VIOT Mathilde',
    role: '11 avis · 4 photos',
    service: '',
    date: "il y a 7 mois",
    stars: 5,
    initials: 'VM',
  },
  {
    id: 4,
    text: "Super salon ! Découvert via les réseaux sociaux je suis très contente du travail réalisé par Julie j'ai fais un Powderbrow le résultat est magnifique merciii a toute l'équipe pour cette accueil.",
    name: 'morgane Garcin',
    role: 'Local Guide · 18 avis',
    service: '',
    date: "il y a 4 mois",
    stars: 5,
    initials: 'MG',
  },
  {
    id: 5,
    text: "Très belle découverte ! J'ai achetée un coupon sur Groupon pour cet institut, très bien accueilli, le massage était top. De la propreté jusqu'à la petite musique, j'ai pris rdv pour une manucure, qui a été réalisé avec soin et minutie. J'ai repris aussi tôt rdv pour une pédicure et ça sera mon institut chouchou ! De vrai moment de détente Merci.",
    name: 'Chahinaize El Hadhiq',
    role: '3 avis · 1 photo',
    service: '',
    date: "il y a 2 ans",
    stars: 5,
    initials: 'CE',
  },
  {
    id: 6,
    text: "Joli institut et agréable. Accueil chaleureux par Mélanie. J'y vais pour faire mes ongles, cela fait plusieurs fois que je les fait et ils sont bien réalisés et tiennent bien dans le temps. Je recommande.",
    name: 'Stéphanie S.',
    role: '8 avis · 5 photos',
    service: '',
    date: "il y a 3 ans",
    stars: 5,
    initials: 'SS',
  },
  {
    id: 7,
    text: "Prestation au top, je suis très satisfaite du travail de Sandy. Ma manucure était impeccable, bien soignée et elle a durée. Ça fait plaisir de voir des professionnelles impliquées dans leur travail. Sandy est très accueillante, gentille et rayonnante.",
    name: 'Gulustan Sarikaya',
    role: '13 avis',
    service: '',
    date: "il y a un an",
    stars: 5,
    initials: 'GS',
  },
];

const MAX_LENGTH = 140;
const VISIBLE = 3;

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

function Avatar({ initials }) {
  return (
    <div className="testi-avatar testi-avatar-initials" aria-hidden="true">
      {initials}
    </div>
  );
}

function ReviewText({ text }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > MAX_LENGTH;
  const displayed = expanded || !long ? text : text.slice(0, MAX_LENGTH).trim() + '…';
  return (
    <>
      <p className="testi-text">{displayed}</p>
      {long && (
        <button
          type="button"
          className="testi-read-more"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Réduire' : 'Lire la suite'}
        </button>
      )}
    </>
  );
}

export default function TestimonialsSection() {
  useRevealOnScroll('.reveal');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const items = useMemo(() => TESTIMONIALS, []);
  const maxIndex = Math.max(0, items.length - VISIBLE);

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
            style={{ transform: `translateX(-${Math.min(activeIndex, maxIndex) * (100 / VISIBLE)}%)` }}
          >
            {items.map((t) => (
              <div key={t.id} className="testi-card">
                <div className="testi-body">
                  <ReviewText text={t.text} />
                </div>
                <div className="testi-footer">
                  <div className="testi-author">
                    <Avatar initials={t.initials} />
                    <div className="testi-name">{t.name}</div>
                  </div>
                  <Stars value={t.stars} />
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
