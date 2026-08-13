import SEO from '../components/SEO.jsx';
import PlanityWidget, { PlanityRaw } from '../components/PlanityWidget.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import { useState } from 'react';
import { ArrowLeft, Calendar, X, Search, Scissors, Sparkles, ShieldCheck, MessageCircleHeart, Leaf, Flame, Wind, ClipboardList, Eye, Droplets, Paintbrush, Palette, Sliders } from 'lucide-react';

const SERVICES = {
  visage: {
    slug: 'visage',
    kicker: 'Éclat',
    title: 'Soin du visage Sur‑mesure',
    image: '/soin visage (2).PNG',
    video: '/detail videos/soin du visage.mp4',
    planityServiceSetIds: ['-OnhVQxq7vObvSeJRzMU', '-Ol3GkVAkT6jUeNjS83U'],
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
    video: '/detail videos/lpg.mp4',
    planityServiceSetIds: ['-Ol3L_k2ReRgOHI0FJw7', '-Ol3PL-4DWabvYcQlZAx', '-Ol3NxupvdMJITC5AZDH'],
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
    video: '/detail videos/Beauté du Regard.mp4',
    planityServiceSetIds: ['-Ol3UAjBrVUku0PURXqq'],
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
  maillot: {
    slug: 'maillot',
    kicker: 'Maillot',
    title: 'Soin du maillot : Vajacial',
    image: '/Vajacial Le soin intime tendance pour une peau saine et sans imperfections.webp',
    video: '/epilation du maillot.mp4',
    planityServiceSetIds: ['-OvATDed1S_NPHbY0SgB'],
    intro: 'Le Vajacial est un soin esthétique réalisé sur la zone du pubis après une épilation du maillot intégral. Il aide à apaiser la peau, prévenir les poils incarnés, réduire les imperfections et retrouver une peau plus douce et uniforme.',
    paragraphs: [
      'Nettoyage de la peau, gommage doux, extraction des poils incarnés et impuretés, masque apaisant et purifiant, puis application d’un soin adapté : chaque étape est choisie pour apaiser et embellir cette zone délicate.',
      'Idéal après l’épilation, ce soin convient aux peaux sujettes aux poils incarnés, aux rougeurs, aux petites imperfections et aux taches pigmentaires.',
      'Vous repartez avec une peau lisse, douce, confortable et visiblement plus saine au quotidien.',
    ],
    benefits: [
      'Nettoyage de la peau et gommage doux',
      'Extraction des poils incarnés et impuretés',
      'Masque apaisant et purifiant',
      'Application d’un soin adapté à la zone',
    ],
    duration: '30 à 45 min',
    price: 'À partir de 45 €',
    perks: [
      { icon: Droplets, label: 'Apaisant' },
      { icon: Sparkles, label: 'Peau lisse' },
      { icon: ShieldCheck, label: 'Sans imperfections' },
    ],
    testimonials: [
      { name: 'Sarah', note: 5, quote: 'J’ai enfin trouvé un soin qui soulage les rougeurs après mon épilation. Ma peau est beaucoup plus douce.' },
      { name: 'Jessica', note: 5, quote: 'L’extraction des poils incarnés est faite avec une grande douceur. Je repars apaisée et confiante.' },
      { name: 'Mélanie', note: 5, quote: 'Un rituel complet et respectueux. On sent que la zone intime est traitée avec professionnalisme.' },
    ],
    faqs: [
      { q: 'L’épilation du maillot est-elle obligatoire avant le soin ?', a: 'Oui, l’épilation du maillot intégral est obligatoire pour bénéficier du Vajacial et obtenir des résultats optimaux.' },
      { q: 'Le soin convient-il aux peaux sensibles ?', a: 'Oui, le protocole est adapté à votre peau et utilise des gestes doux pour apaiser la zone sans agresser.' },
    ],
  },
  mains: {
    slug: 'mains',
    kicker: 'Mains',
    title: 'Onglerie Premium',
    image: '',
    video: '/detail videos/onglerie.mp4',
    planityServiceSetIds: ['-Ol3Ea7M5wyLDv27sgmz'],
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
  epilation: {
    slug: 'epilation',
    kicker: 'Épilation',
    title: 'Épilation\nCire & définitive',
    image: '/epilation-a-la-cire.jpg',
    video: '/epilation.mp4',
    planityServiceSetIds: ['-Ol37IE9hHjduXLe5euh', '-Ol3CsevbpSXybi9euiF'],
    intro: 'Peau lisse au quotidien, durablement. Nous combinons épilation à la cire pour un résultat immédiat et épilation définitive pour réduire la repousse au fil des séances.',
    paragraphs: [
      'L’épilation à la cire reste la solution rapide et efficace pour toutes les zones : jambes, maillot, aisselles, visage et sourcils. Nos cires sont chauffées à la bonne température et choisies selon votre type de peau pour préserver son confort.',
      'L’épilation définitive par laser ou lumière pulsée cible le poil en phase de repousse pour affiner durablement la pilosité. Un protocole personnalisé est établi selon la zone, le phototype et l’objectif recherché.',
      'Que vous cherchiez un résultat immédiat ou une réduction durable, nos esthéticiennes vous guident vers la solution la plus adaptée à votre peau et à votre rythme.',
    ],
    benefits: [
      'Épilation à la cire pour toutes zones',
      'Épilation définitive sur protocole personnalisé',
      'Protocole hygiénique et sécurisé',
      'Conseil et accompagnement sur-mesure',
    ],
    duration: 'Selon la zone',
    price: 'Cire dès 12 € / définitive sur devis',
    perks: [
      { icon: Scissors, label: 'Cire & laser' },
      { icon: Sparkles, label: 'Peau lisse' },
      { icon: ShieldCheck, label: 'Hygiène' },
    ],
    testimonials: [
      { name: 'Émilie', note: 5, quote: 'J’ai commencé par la cire, puis j’ai fait un protocole définitif. Les deux sont faits avec le même soin et la même propreté.' },
      { name: 'Fatima', note: 5, quote: 'On m’a expliqué la différence entre les deux techniques sans me forcer à prendre la plus chère. J’apprécie la transparence.' },
      { name: 'Clara', note: 5, quote: 'Ma peau est douce et sans irritation, et la repousse de ma définitive est déjà bien moins dense.' },
    ],
    faqs: [
      { q: 'Comment choisir entre cire et épilation définitive ?', a: 'La cire convient à ceux qui veulent un résultat immédiat. L’épilation définitive nécessite plusieurs séances et est idéale pour réduire durablement la repousse.' },
      { q: 'L’épilation définitive est-elle réellement définitive ?', a: 'Elle réduit fortement la densité et la repousse après un protocole de 6 à 10 séances. Des retouches annuelles peuvent être nécessaires selon le profil.' },
    ],
  },
};

const OTHERS = [
  { slug: 'visage', kicker: 'Éclat', title: 'Soin du visage', image: '/soin visage (2).PNG', video: 'https://www.pexels.com/fr-fr/download/video/9335813/' },
  { slug: 'minceur', kicker: 'Silhouette', title: 'Minceur', image: '/soin-minceur.PNG', video: 'https://www.pexels.com/fr-fr/download/video/32828416/' },
  { slug: 'regard', kicker: 'Regard', title: 'Beauté du regard', image: '/mey-beauty (6).jpeg', video: 'https://www.pexels.com/fr-fr/download/video/8502623/' },
  { slug: 'epilation', kicker: 'Épilation', title: 'Épilation\nCire & définitive', image: '/epilation-a-la-cire.jpg', video: '/epilation.mp4' },
  { slug: 'maillot', kicker: 'Maillot', title: 'Soin du maillot', image: '/Vajacial Le soin intime tendance pour une peau saine et sans imperfections.webp', video: '/epilation du maillot.mp4' },
  { slug: 'mains', kicker: 'Mains', title: 'Onglerie premium', image: '/meybeauty.jpg', video: '' },
];

const TRUST_ITEMS = [
  { icon: Search, label: 'Diagnostic personnalisé' },
  { icon: Sparkles, label: 'Produits professionnels' },
  { icon: ShieldCheck, label: 'Hygiène irréprochable' },
  { icon: MessageCircleHeart, label: 'Clientes satisfaites' },
];

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

const CAT_CLASS = {
  visage: 'cat-1',
  minceur: 'cat-2',
  regard: 'cat-3',
  maillot: 'cat-5',
  mains: 'cat-4',
  epilation: 'cat-6',
};

export default function ServiceDetailPage({ slug }) {
  const service = SERVICES[slug] || SERVICES['visage'];
  const [showBooking, setShowBooking] = useState(false);

  const discover = OTHERS.filter((o) => o.slug !== service.slug).map((o) => ({
    id: o.slug,
    className: `cat-item ${CAT_CLASS[o.slug] || 'cat-1'}`,
    kicker: o.kicker,
    title: o.title,
    href: `#service/${o.slug}`,
    video: o.video,
    image: o.image,
    imageOnly: !o.video,
  }));

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
                <button
                  type="button"
                  onClick={() => setShowBooking(true)}
                  className="btn-rdv sd-chip-btn"
                  style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <Calendar size={16} strokeWidth={1.5} /> Réserver
                </button>
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

        {false && (
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
        )}

        {false && (
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
        )}

        <section className="sd-others">
          <p className="sd-eyebrow sd-center">À découvrir aussi</p>
          <h2 className="sd-h2 sd-center">Nos autres univers</h2>
          <CategoryGrid items={discover} className="cat-grid others-grid" />
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
          <button
            type="button"
            onClick={() => setShowBooking(true)}
            className="btn-rdv"
            style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <Calendar size={18} strokeWidth={1.5} /> Réserver
          </button>
          <div className="sd-final-back">
            <a href="#home">
              <ArrowLeft size={16} strokeWidth={1.5} /> Retour à l’accueil
            </a>
          </div>
        </section>
      </main>

      {showBooking && (
        <div className="sd-planity-overlay" onClick={() => setShowBooking(false)}>
          <div className="sd-planity-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sd-planity-header">
              <h3>Réserver — {service.title}</h3>
              <button type="button" onClick={() => setShowBooking(false)} aria-label="Fermer">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="sd-planity-body">
              {service.slug === 'mains' ? <PlanityRaw /> : <PlanityWidget serviceSetIds={service.planityServiceSetIds} />}
            </div>
          </div>
        </div>
      )}

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
        .sd-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 2px;
          font-family: var(--font-sc);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--brun-medium);
          color: var(--blanc);
          box-shadow: 0 4px 14px rgba(107, 83, 68, 0.18);
        }
        .sd-chip-btn:hover { background: var(--brun-dark); }

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

        .sd-planity-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(26, 20, 8, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .sd-planity-drawer {
          position: fixed;
          top: 50%;
          left: 50%;
          width: min(480px, 92%);
          max-height: 86vh;
          transform: translate(-50%, -50%);
          background: var(--blanc, #FFFFFF);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(26, 20, 8, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: sd-planity-center 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sd-planity-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          border-bottom: 1px solid var(--gris-border, #E5E5E5);
        }
        .sd-planity-header h3 {
          margin: 0;
          font-family: var(--font-titre);
          font-size: 18px;
          font-weight: 600;
          color: var(--brun-dark);
        }
        .sd-planity-header button {
          background: none;
          border: none;
          cursor: pointer;
          color: #8A6E5A;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          flex-shrink: 0;
        }
        .sd-planity-body {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          min-height: 420px;
        }
        @keyframes sd-planity-center {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes planity-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 800px) {
          .sd-planity-drawer {
            top: auto;
            left: 0;
            right: 0;
            bottom: 0;
            height: 92vh;
            max-height: 92vh;
            width: 100%;
            transform: translateY(0);
            border-radius: 16px 16px 0 0;
            animation: sd-planity-up 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes sd-planity-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
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
