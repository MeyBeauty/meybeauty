import SEO from '../components/SEO.jsx';
import { ArrowLeft, Calendar, Search, Sparkles, ShieldCheck, MessageCircleHeart, Leaf, Flame, Wind, ClipboardList, Eye, Droplets, Paintbrush, Palette, Sliders } from 'lucide-react';

const SERVICES = {
  visage: {
    slug: 'visage',
    kicker: 'Éclat',
    title: 'Soin du visage Sur‑mesure',
    image: '/soin visage (2).PNG',
    video: 'https://www.pexels.com/fr-fr/download/video/9335813/',
    intro: 'Chaque peau est une histoire. Nous analysons votre visage avant chaque soin pour choisir les actifs, les gestes et le temps de pause qui vous correspondent.',
    paragraphs: [
      'Notre approche du soin visage combine diagnostic personnalisé, technologies douces et produits professionnels.',
      'Hydratation, anti-âge, purifiant ou éclat : chaque protocole est ajusté à votre morphologie et à vos objectifs du moment.',
      'Vous repartez avec une peau visiblement plus lumineuse, reposée et prête à refléter votre meilleur éclat au quotidien.',
    ],
    benefits: [
      'Diagnostic peau avant chaque soin',
      'Actifs concentrés adaptés à votre type de peau',
      'Gestuelles relaxantes et précises',
      'Résultats visibles dès la première séance',
    ],
    duration: '45 à 60 min',
    price: 'À partir de 55 €',
    perks: [
      { icon: Leaf, label: 'Actifs naturels' },
      { icon: Sparkles, label: 'Éclat immédiat' },
      { icon: Sliders, label: 'Sur-mesure' },
    ],
    testimonials: [
      { name: 'Sophie', note: 5, quote: 'Ma peau respire enfin. Le diagnostic avant le soin change tout, on sent que rien n’est fait au hasard.' },
      { name: 'Laëtitia', note: 5, quote: 'Un moment suspendu, des gestes précis et un résultat visible dès la sortie de l’institut.' },
      { name: 'Camille', note: 5, quote: 'J’ai enfin trouvé un soin adapté à ma peau réactive, sans tiraillement ni rougeur.' },
    ],
    faqs: [
      { q: 'Le soin convient-il aux peaux sensibles ?', a: 'Oui. Le diagnostic réalisé en début de séance permet d’adapter les actifs à votre type de peau, y compris les peaux réactives.' },
      { q: 'Dois-je préparer ma peau avant le rendez-vous ?', a: 'Venez démaquillée si possible, sinon nous nous chargeons du démaquillage en tout premier temps du soin.' },
    ],
  },
  minceur: {
    slug: 'minceur',
    kicker: 'Silhouette',
    title: 'Minceur',
    image: '/soin-minceur.PNG',
    video: 'https://www.pexels.com/fr-fr/download/video/32828416/',
    intro: 'Affiner, tonifier, retrouver du confort dans son corps : nos soins corps associent technologies professionnelles et protocoles sur-mesure.',
    paragraphs: [
      'LPG Cellu M6, drainage lymphatique, enveloppements et soins ciblés : nous combinons les techniques les plus efficaces pour accompagner votre silhouette.',
      'Chaque séance débute par un bilan morphologique personnalisé afin de cibler vos zones de prédilection et vos objectifs.',
      'Au fil des séances, retrouvez une silhouette plus lisse, une sensation de légèreté et un confort retrouvé.',
    ],
    benefits: [
      'Bilan silhouette personnalisé',
      'Technologie LPG Cellu M6',
      'Drainage et enveloppements ciblés',
      'Programme sur plusieurs séances',
    ],
    duration: '30 à 60 min',
    price: 'À partir de 45 €',
    perks: [
      { icon: Flame, label: 'LPG Cellu M6' },
      { icon: Wind, label: 'Drainage' },
      { icon: ClipboardList, label: 'Bilan silhouette' },
    ],
    testimonials: [
      { name: 'Nadia', note: 5, quote: 'Le bilan morphologique au démarrage m’a permis de comprendre ce qui allait vraiment m’aider.' },
      { name: 'Julie', note: 5, quote: 'Sensation de légèreté dès la première séance de drainage, je recommande le programme complet.' },
      { name: 'Amandine', note: 5, quote: 'Un vrai suivi dans le temps, pas juste une séance isolée. Ça fait toute la différence.' },
    ],
    faqs: [
      { q: 'Combien de séances faut-il pour voir des résultats ?', a: 'Un programme de 6 à 10 séances est généralement conseillé selon vos objectifs, évalué lors du bilan initial.' },
      { q: 'La technologie LPG Cellu M6 est-elle douloureuse ?', a: 'Non, la technique est indolore et généralement décrite comme un moment relaxant, avec un léger effet ventouse.' },
    ],
  },
  regard: {
    slug: 'regard',
    kicker: 'Regard',
    title: 'Beauté du Regard',
    image: '/mey-beauty (6).jpeg',
    video: 'https://www.pexels.com/fr-fr/download/video/8502623/',
    intro: 'Intensifier le regard, sublimer le sourcil, allonger les cils : nos prestations de beauté du regard sont conçues pour donner du caractère à votre face.',
    paragraphs: [
      'Extensions de cils, rehaussement, teinture de cils et sourcils, microblading et soins du contour de l’œil : chaque geste est précis.',
      'Chaque résultat est pensé pour durer, avec des produits formulés pour les yeux sensibles et les porteuses de lentilles.',
      'Vous repartez avec un regard structuré, naturel et expressif, sans effort au quotidien.',
    ],
    benefits: [
      'Extensions de cils sur-mesure',
      'Sourcils structurés et naturels',
      'Produits adaptés aux yeux sensibles',
      'Tenue longue durée',
    ],
    duration: '30 à 90 min',
    price: 'À partir de 35 €',
    perks: [
      { icon: Eye, label: 'Regard sublimé' },
      { icon: Leaf, label: 'Produits doux' },
      { icon: Droplets, label: 'Tenue longue' },
    ],
    testimonials: [
      { name: 'Inès', note: 5, quote: 'Un regard transformé, très naturel, et une tenue impressionnante dans le temps.' },
      { name: 'Manon', note: 5, quote: 'J’ai les yeux sensibles et je n’ai eu aucune gêne pendant la pose.' },
      { name: 'Chloé', note: 5, quote: 'Des sourcils enfin structurés sans avoir l’air refaits. Exactement ce que je voulais.' },
    ],
    faqs: [
      { q: 'Combien de temps dure la pose de cils ?', a: 'La pose initiale dure entre 60 et 90 minutes selon la technique choisie. Un remplissage se fait ensuite toutes les 3 semaines environ.' },
      { q: 'Les produits sont-ils adaptés aux yeux sensibles ?', a: 'Oui, nous utilisons des colles et teintures formulées pour limiter les réactions sur les yeux sensibles ou porteurs de lentilles.' },
    ],
  },
  mains: {
    slug: 'mains',
    kicker: 'Mains',
    title: 'Onglerie Premium',
    image: '/meybeauty.jpg',
    video: '',
    intro: 'Des mains soignées, des ongles sublimés : notre onglerie premium allie esthétique, tenue et respect de la nature de l’ongle.',
    paragraphs: [
      'Vernis semi-permanent, pose en gel, nail art, soins des mains et des pieds : chaque prestation est réalisée avec des produits professionnels.',
      'Une attention particulière est portée à l’hygiène et à la protection de votre ongle naturel pour une tenue impeccable.',
      'Vous repartez avec des mains soignées, des ongles sublimés et une pose qui tient dans la durée.',
    ],
    benefits: [
      'Pose en gel et vernis semi-permanent',
      'Nail art sur mesure',
      'Soins des mains et des pieds',
      'Respect et protection de l’ongle naturel',
    ],
    duration: '30 à 75 min',
    price: 'À partir de 30 €',
    perks: [
      { icon: Paintbrush, label: 'Vernis semi-permanent' },
      { icon: Palette, label: 'Nail art sur mesure' },
      { icon: ShieldCheck, label: 'Ongle préservé' },
    ],
    testimonials: [
      { name: 'Aïcha', note: 5, quote: 'Une pose impeccable, mes ongles n’ont jamais été aussi solides entre deux rendez-vous.' },
      { name: 'Léa', note: 5, quote: 'Le nail art sur-mesure est bluffant de précision, exactement ce que j’avais en tête.' },
      { name: 'Marion', note: 5, quote: 'Hygiène irréprochable et un vrai soin des mains, pas juste une pose de vernis.' },
    ],
    faqs: [
      { q: 'Combien de temps tient une pose en gel ?', a: 'Comptez 3 à 4 semaines avant un remplissage, selon la pousse naturelle de votre ongle.' },
      { q: 'La pose abîme-t-elle l’ongle naturel ?', a: 'Non, nos techniques de pose et de dépose préservent la structure de l’ongle lorsqu’elles sont réalisées et retirées en institut.' },
    ],
  },
};

const OTHERS = [
  { slug: 'visage', kicker: 'Éclat', title: 'Soin du visage', image: '/soin visage (2).PNG', video: 'https://www.pexels.com/fr-fr/download/video/9335813/' },
  { slug: 'minceur', kicker: 'Silhouette', title: 'Minceur', image: '/soin-minceur.PNG', video: 'https://www.pexels.com/fr-fr/download/video/32828416/' },
  { slug: 'regard', kicker: 'Regard', title: 'Beauté du regard', image: '/mey-beauty (6).jpeg', video: 'https://www.pexels.com/fr-fr/download/video/8502623/' },
  { slug: 'mains', kicker: 'Mains', title: 'Onglerie premium', image: '/meybeauty.jpg', video: '' },
];

const TRUST_ITEMS = [
  { icon: Search, label: 'Diagnostic personnalisé' },
  { icon: Sparkles, label: 'Produits professionnels' },
  { icon: ShieldCheck, label: 'Hygiène irréprochable' },
  { icon: MessageCircleHeart, label: 'Clientes satisfaites' },
];

const PLANITY_URL = 'https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i';

function StarRow({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 3 }} aria-label={`${count} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14">
          <path
            d="M7 0.8 8.7 4.7 13 5.2 9.8 8 10.7 12.2 7 10 3.3 12.2 4.2 8 1 5.2 5.3 4.7Z"
            fill={i < count ? 'var(--brun-medium)' : 'none'}
            stroke="var(--brun-medium)"
            strokeWidth="0.8"
          />
        </svg>
      ))}
    </div>
  );
}

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

function VideoOrImage({ src, video, alt, className }) {
  if (video) {
    return (
      <video
        src={video}
        autoPlay
        muted
        loop
        playsInline
        className={className}
        poster={src}
        aria-label={alt}
      />
    );
  }
  return <img src={src} alt={alt} className={className} />;
}

export default function ServiceDetailPage({ slug }) {
  const service = SERVICES[slug] || SERVICES['visage'];

  return (
    <>
      <SEO
        title={`${service.title} — Mey Beauty | Institut Viry-Châtillon (91)`}
        description={service.intro}
      />
      <main className="service-detail-page" style={{ background: 'var(--nude-light)', minHeight: '100vh' }}>
        <section className="about-hero" aria-label={service.title}>
          <h1><TitleWithBreaks text={service.title} /></h1>
          <div className="about-breadcrumb">
            <a href="#home">Accueil</a>
            <span>/</span>
            <span>{service.kicker}</span>
          </div>
        </section>

        <section className="sd-intro">
          <div className="sd-intro-grid">
            <div className="sd-intro-visual">
              <VideoOrImage src={service.image} video={service.video} alt={service.title} className="sd-intro-img" />
              <div className="sd-intro-perks">
                {service.perks?.map((p, i) => (
                  <div key={i} className="sd-perk">
                    <span className="sd-perk-icon"><p.icon size={20} strokeWidth={1.5} /></span>
                    <span className="sd-perk-label">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sd-intro-copy">
              <p className="sd-eyebrow">Le soin</p>
              <p className="sd-dropcap">{service.intro}</p>
              {service.paragraphs.map((p, i) => (
                <p key={i} className="sd-body-secondary">{p}</p>
              ))}
              <div className="sd-chip-row">
                <span className="sd-chip">Durée · {service.duration}</span>
                <span className="sd-chip sd-chip-accent">{service.price}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="sd-ritual">
          <p className="sd-eyebrow sd-center">Le déroulé</p>
          <h2 className="sd-h2 sd-center">Le rituel, temps par temps</h2>
          <div className="sd-ritual-list">
            <div className="sd-ritual-line" aria-hidden="true" />
            {service.benefits.map((b, i) => (
              <div key={i} className="sd-ritual-step">
                <div className="sd-ritual-num">{String(i + 1).padStart(2, '0')}</div>
                <p className="sd-ritual-text">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sd-trust">
          <div className="sd-trust-row">
            {TRUST_ITEMS.map((t, i) => (
              <div key={i} className="sd-trust-item">
                <span className="sd-trust-icon"><t.icon size={28} strokeWidth={1.5} /></span>
                <span className="sd-trust-label">{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="sd-reviews">
          <div className="sd-reviews-header">
            <p className="sd-eyebrow sd-center">Avis clientes</p>
            <h2 className="sd-h2 sd-center">Ce qu'elles en disent.</h2>
          </div>
          {[0, 1].map((r) => {
            const row = [...service.testimonials, ...service.testimonials];
            return (
              <div
                key={r}
                className="sd-marquee-row"
                style={{ animationDirection: r === 1 ? 'reverse' : 'normal' }}
              >
                {row.map((t, i) => (
                  <div key={i} className="sd-review-card">
                    <p className="sd-review-quote">"{t.quote}"</p>
                    <div className="sd-review-name">{t.name}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </section>

        <section className="sd-others">
          <p className="sd-eyebrow sd-center">À découvrir aussi</p>
          <h2 className="sd-h2 sd-center">Nos autres univers</h2>
          <div className="sd-others-grid">
            {OTHERS.filter((o) => o.slug !== service.slug).map((o) => (
              <a key={o.slug} href={`#service/${o.slug}`} className="sd-other-card">
                <VideoOrImage src={o.image} video={o.video} alt={o.title} className="sd-other-img" />
                <div className="sd-other-scrim" />
                <div className="sd-other-body">
                  <p className="sd-other-kicker">{o.kicker}</p>
                  <p className="sd-other-title">{o.title}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="sd-faq">
          <p className="sd-eyebrow sd-center">Questions fréquentes</p>
          <h2 className="sd-h2 sd-center">Avant de réserver</h2>
          <div className="sd-faq-list">
            {service.faqs.map((item, i) => (
              <div key={i} className="sd-faq-item">
                <p className="sd-faq-q">{item.q}</p>
                <p className="sd-faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sd-final-cta">
          <h2 className="sd-h2 sd-center">Envie d’essayer ?</h2>
          <p className="sd-final-copy">
            Choisissez votre créneau en ligne. Nous vous accueillons à Viry-Châtillon dans nos deux instituts, selon la prestation sélectionnée.
          </p>
          <a href={PLANITY_URL} target="_blank" rel="noopener noreferrer" className="btn-rdv">
            <Calendar size={18} strokeWidth={1.5} /> Réserver sur Planity
          </a>
          <div className="sd-final-back">
            <a href="#home">
              <ArrowLeft size={16} strokeWidth={1.5} /> Retour à l’accueil
            </a>
          </div>
        </section>
      </main>

      <style>{`
        .service-detail-page .about-hero h1 {
          font-family: var(--font-titre);
          font-weight: 400;
          font-size: clamp(38px, 5vw, 54px);
          margin: 0 0 10px;
        }
        .service-detail-page .about-breadcrumb a { color: #8A6E5A; text-decoration: none; }

        .sd-eyebrow {
          font-family: var(--font-sc);
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--brun-medium);
          margin-bottom: 10px;
        }
        .sd-center { text-align: center; }
        .sd-h2 {
          font-family: var(--font-titre);
          font-weight: 600;
          font-size: clamp(24px, 3vw, 34px);
          color: var(--brun-dark);
          margin: 0 0 44px;
          line-height: 1.2;
        }

        .sd-intro { padding: 80px 32px; background: var(--blanc); }
        .sd-intro-grid {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 56px;
          align-items: start;
        }
        .sd-intro-visual { border-radius: 2px; overflow: hidden; position: relative; }
        .sd-intro-img, .sd-intro-visual video {
          width: 100%;
          aspect-ratio: 4/5;
          object-fit: cover;
          display: block;
          border-radius: 2px;
        }
        .sd-intro-perks {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 12px;
        }
        .sd-perk {
          background: var(--blanc);
          border: 1px solid var(--gris-border);
          border-radius: 2px;
          padding: 12px 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .sd-perk-icon {
          color: var(--brun-medium);
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sd-perk-label {
          font-family: var(--font-sc);
          font-size: 10px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #6B5344;
          line-height: 1.25;
        }
        .sd-dropcap {
          font-family: var(--font-corps);
          font-size: 18px;
          line-height: 1.75;
          color: #6B5344;
          margin: 0 0 18px;
          text-align: justify;
        }
        .sd-dropcap::first-letter {
          font-family: var(--font-titre);
          font-size: 46px;
          font-weight: 600;
          color: var(--brun-dark);
          float: left;
          line-height: 0.8;
          padding-right: 8px;
        }
        .sd-body-secondary {
          font-family: var(--font-corps);
          font-size: 15px;
          line-height: 1.75;
          color: #8A6E5A;
          margin: 0 0 26px;
          text-align: justify;
        }
        .sd-chip-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .sd-chip {
          font-family: var(--font-sc);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 10px 16px;
          border-radius: 2px;
          color: var(--blanc);
          background: var(--brun-dark);
          box-shadow: 0 4px 14px rgba(107, 83, 68, 0.18);
        }
        .sd-chip-accent { background: var(--brun-medium); }

        .sd-ritual { padding: 80px 32px; background: var(--nude-light); }
        .sd-ritual-list {
          max-width: 640px;
          margin: 0 auto;
          position: relative;
          padding-left: 44px;
        }
        .sd-ritual-line {
          position: absolute;
          left: 15px;
          top: 6px;
          bottom: 6px;
          width: 1px;
          background: var(--gris-border);
        }
        .sd-ritual-step { position: relative; padding-bottom: 30px; }
        .sd-ritual-step:last-child { padding-bottom: 0; }
        .sd-ritual-num {
          position: absolute;
          left: -44px;
          top: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--brun-medium);
          background: var(--blanc);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sc);
          font-size: 11px;
          color: var(--brun-medium);
        }
        .sd-ritual-text {
          font-family: var(--font-corps);
          font-size: 15px;
          line-height: 1.6;
          color: #6B5344;
          padding-top: 5px;
          margin: 0;
          text-align: justify;
        }

        .sd-trust {
          padding: 32px 24px;
          background: var(--brun-dark);
        }
        .sd-trust-row {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .sd-trust-item {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 2px;
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }
        .sd-trust-icon {
          color: var(--brun-medium);
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sd-trust-label {
          font-family: var(--font-sc);
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--nude-light);
          line-height: 1.3;
        }

        .sd-reviews {
          background: var(--brun-dark);
          color: var(--nude-light);
          padding: 80px 0;
          overflow: hidden;
        }
        .sd-reviews-header {
          max-width: 1180px;
          margin: 0 auto 40px;
          padding: 0 32px;
        }
        .sd-reviews-header .sd-eyebrow { color: var(--brun-medium); }
        .sd-reviews-header .sd-h2 { color: var(--blanc); margin-bottom: 0; }
        .sd-marquee-row {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: sd-marquee 42s linear infinite;
          margin-top: 20px;
        }
        .sd-marquee-row:first-child { margin-top: 0; }
        .sd-review-card {
          background: rgba(245, 242, 238, 0.06);
          border: 1px solid rgba(245, 242, 238, 0.12);
          padding: 26px;
          width: 340px;
          flex-shrink: 0;
        }
        .sd-review-quote {
          font-family: var(--font-titre);
          font-style: italic;
          font-size: 16px;
          line-height: 1.6;
          color: var(--nude-light);
          margin: 0 0 16px;
        }
        .sd-review-name {
          font-family: var(--font-sc);
          font-size: 12px;
          opacity: 0.6;
          color: var(--nude-light);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        @keyframes sd-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .sd-others { padding: 80px 32px; background: var(--blanc); }
        .sd-others-grid {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .sd-other-card {
          position: relative;
          border-radius: 2px;
          overflow: hidden;
          aspect-ratio: 3/4;
          display: flex;
          align-items: flex-end;
          text-decoration: none;
        }
        .sd-other-card img,
        .sd-other-card video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .6s ease;
        }
        .sd-other-card:hover img,
        .sd-other-card:hover video { transform: scale(1.05); }
        .sd-other-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(20, 15, 5, 0) 45%, rgba(20, 15, 5, 0.75) 100%);
        }
        .sd-other-body {
          position: relative;
          z-index: 2;
          padding: 16px;
        }
        .sd-other-kicker {
          font-family: var(--font-sc);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #E6D4C1;
          margin: 0 0 4px;
        }
        .sd-other-title {
          font-family: var(--font-titre);
          font-size: 17px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .sd-faq { padding: 80px 32px; background: var(--nude-light); }
        .sd-faq-list { max-width: 680px; margin: 0 auto; }
        .sd-faq-item { border-bottom: 1px solid var(--gris-border); padding: 18px 2px; }
        .sd-faq-q {
          font-family: var(--font-titre);
          font-size: 16px;
          font-weight: 600;
          color: var(--brun-dark);
          margin: 0 0 8px;
        }
        .sd-faq-a {
          font-family: var(--font-corps);
          font-size: 14px;
          line-height: 1.7;
          color: #8A6E5A;
          margin: 0;
          text-align: justify;
        }

        .sd-final-cta { padding: 90px 32px; text-align: center; background: var(--blanc); }
        .sd-final-copy {
          max-width: 520px;
          margin: 0 auto 26px;
          font-family: var(--font-corps);
          font-size: 14px;
          color: #8A6E5A;
          line-height: 1.7;
          text-align: justify;
        }
        .sd-final-back { margin-top: 20px; }
        .sd-final-back a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-corps);
          font-size: 14px;
          color: #8A6E5A;
          text-decoration: none;
        }

        @media (max-width: 800px) {
          .sd-intro-grid { grid-template-columns: 1fr; gap: 36px; }
          .sd-reviews-grid { grid-template-columns: 1fr; }
          .sd-others-grid { grid-template-columns: repeat(2, 1fr); }
          .sd-trust-row { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 560px) {
          .service-detail-page .about-hero { padding: 80px 24px 44px; }
          .service-detail-page .about-hero h1 { font-size: 28px; }
          .sd-intro { padding: 56px 24px; }
          .sd-ritual { padding: 56px 24px; }
          .sd-reviews { padding: 56px 24px; }
          .sd-others { padding: 56px 24px; }
          .sd-faq { padding: 56px 24px; }
          .sd-final-cta { padding: 70px 24px; }
          .sd-others-grid { grid-template-columns: 1fr; }
          .sd-trust-row { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .sd-trust-item { padding: 14px 10px; }
          .sd-trust-icon { font-size: 22px; }
          .sd-trust-label { font-size: 10px; }
        }
      `}</style>
    </>
  );
}
