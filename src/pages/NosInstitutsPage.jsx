import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, ArrowRight, X, Plus } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import PlanityWidget, { PlanityRaw } from '../components/PlanityWidget.jsx';

const planityUrl = 'https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i';

/* ────────────────────────────────────────────────────
   Palette — strictement celle déjà utilisée dans le projet
──────────────────────────────────────────────────── */
const C = {
  ink: '#1A1410',
  inkSoft: '#6B4C35',
  muted: '#8A6E5A',
  label: '#9ca3af',
  bg: '#F5EDE4',
  paper: '#FFFFFF',
  gold: '#C4A35A',
  gold2: '#D0B49F',
  line: 'rgba(82,58,40,0.1)',
  lineSoft: 'rgba(82,58,40,0.06)',
};

const FONT_SERIF = "'Cormorant Garamond', serif";
const FONT_SC = "'Cormorant SC', serif";
const FONT_CORPS = "'Lato', sans-serif";

/* ────────────────────────────────────────────────────
   Données
──────────────────────────────────────────────────── */
const salon1 = {
  id: 'place-du-marche',
  name: 'Place du Marché',
  tagline: 'Redonner vie à votre corps.',
  address: '6 Place des Martyrs de Châteaubriand, 91170 Viry-Châtillon',
  phone: '+33 7 49 22 68 01',
  hours: 'Lun–Jeu 10h–18h, Ven 10h–21h, Sam 9h–17h',
  image: '/mey-beauty%20(1).jpeg',
  planityUrl: 'https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i',
  services: [
    { name: 'Épilation', price: 'Découvrir', family: 'precision', image: '',  video: '/videos prestations/épilation.mp4', pitch: 'Peau lisse. Dès la première séance.', description: 'Cires douces adaptées à toutes les zones. Résultat impeccable, confort maximal.', planityServiceSetIds: ['-Ol37IE9hHjduXLe5euh'] },
    { name: 'Épilation définitive', price: 'Découvrir', family: 'precision', image: '',  video: '/videos prestations/épiliation définitive.mp4',  pitch: 'Fini les poils, pour de bon.', description: 'Laser et lumière pulsée pour une réduction durable. Peau nette au quotidien, sans contrainte.', planityServiceSetIds: ['-Ol3CsevbpSXybi9euiF'] },
    { name: 'LPG Cellu M6', price: 'Découvrir', family: 'corps', image: '',  video: '/videos prestations/lpg.mp4', pitch: 'Votre silhouette, sculptée par la technologie.', description: 'Endermologie brevetée pour cibler la cellulite, raffermir la peau et affiner durablement.', planityServiceSetIds: ['-Ol3L_k2ReRgOHI0FJw7'] },
    { name: 'Drainage lymphatique', price: 'Découvrir', family: 'corps', image: '',  video: '/videos prestations/Drainage lymphatique.mp4', pitch: 'Légèreté retrouvée. Corps libéré.', description: 'Massage manuel profond pour éliminer les toxines, activer la circulation et soulager les jambes lourdes.', planityServiceSetIds: ['-Ol3PL-4DWabvYcQlZAx'] },
    { name: 'Madérothérapie', price: 'Découvrir', family: 'corps', image: '', video: '/videos prestations/Madérothérapie.mp4', pitch: 'Le bois sculpte, le corps se transforme.', description: 'Instruments en bois naturel pour déloger la cellulite, modeler les courbes et améliorer la circulation.', planityServiceSetIds: ['-Ol3NxupvdMJITC5AZDH'] },
    { name: 'Soin visage', price: 'Découvrir', family: 'visage', image: '',  video: '/videos prestations/soin du visage.mp4', pitch: 'Votre teint, réveillé.', description: 'Rituel nettoyant, hydratant ou anti-âge personnalisé selon votre type de peau pour une peau lumineuse.', planityServiceSetIds: ['-OnhVQxq7vObvSeJRzMU', '-Ol3GkVAkT6jUeNjS83U'] },
    { name: 'Spray tan', price: 'Découvrir', family: 'visage', image: '',  video: '/videos prestations/spray tan.mp4',  pitch: 'Bronzée. Sans le soleil.', description: 'Hâle doré, uniforme et longue tenue. Sans UV, sans risque, avec un rendu naturel garanti.', planityServiceSetIds: ['-Oqe80X7TxoVeWliJ9FY'] },
    { name: 'Beauté du regard', price: 'Découvrir', family: 'visage', image: '',  video: '/videos prestations/Beauté du Regard.mp4', pitch: "Des yeux qui parlent d'eux-mêmes.", description: 'Coloration, rehaussement et soin des cils et sourcils pour un regard ouvert et intense.', planityServiceSetIds: ['-Ol3UAjBrVUku0PURXqq'] },
    { name: 'Onglerie', price: 'Découvrir', family: 'visage', image: '',  video: '/videos prestations/onglerie.mp4', pitch: 'Des mains à croquer.', description: 'Manucure, vernis classique ou semi-permanent pour des ongles soignés et des mains impeccables.', planityServiceSetIds: ['-Ol3Ea7M5wyLDv27sgmz'] },
    // { name: 'Tatouage semi-permanent', price: 'Découvrir', family: 'precision', image: '/Tatouage%20semi-permanent%20%20Le%20secret%20d%27une%20mise%20en%20beaut%C3%A9%20durable%20et%20naturelle.jpg', pitch: 'Réveillée belle. Tous les matins.', description: 'Sourcils, lèvres ou yeux subtilement rehaussés pour une beauté naturelle et durable sans effort.', planityServiceSetIds: ['-Ol35YKLTwrdNnEDQ6wQ'] },
  ],
};
   
const salon2 = {
  id: 'gabriel-peri',
  name: 'Boulevard Gabriel Péri',
  tagline: "Sublimer vos mains, magnifier votre regard.",
  address: 'Boulevard Gabriel Péri, 91170 Viry-Châtillon',
  phone: '+33 7 49 22 68 01',
  hours: 'Lun–Jeu 10h–18h, Ven 10h–21h, Sam 9h–17h',
  image: '/Institut Mey Beauty Boulevard Gabriel Péri.png',
  planityUrl: 'https://www.planity.com/mey-beauty-ongles-beaute-du-regard-91170-viry-chatillon',
  services: [
    { name: 'Onglerie', price: 'Découvrir', family: 'visage', image: '/meybeauty.jpg',  video: '/videos prestations/onglerie 1.mp4', pitch: 'Des mains sublimées, une finition parfaite.', description: "Manucure, vernis, semi-permanent et nail art pour des mains d'exception.", planityServiceSetIds: ['-Ol3Ea7M5wyLDv27sgmz'] },
    { name: 'Extensions de cils', price: 'Découvrir', family: 'visage', image: '/beaut%C3%A9%20regard%20(3).PNG',  video: '/videos prestations/Extensions de cils.mp4', pitch: 'Un regard intense. Sans mascara.', description: 'Pose à cils ou volume russe selon votre morphologie pour un regard qui captive.', planityServiceSetIds: ['-Ol3UAjBrVUku0PURXqq'] },
  ],
};

const salons = [salon1, salon2];

const testimonials = [
  { text: "Je vais voir Chloé tous les mois depuis presque un an, et c'est toujours un plaisir ! Son travail est impeccable et l'ambiance au top, c'est pour ça que je n'ai pas hésité à la suivre quand elle a changé de salon.", who: 'Héloïse Dmy, Local Guide · 7 avis' },
  { text: "Une expérience absolument parfaite ! J'ai fait mes ongles en pose américaine dans ce salon de manucure et le résultat est incroyable. La prothésiste ongulaire Chloé est très professionnelle, douce et attentive aux détails. La tenue est impeccable même après plusieurs semaines. Le design des ongles est magnifique, le nail art personnalisé est fait avec beaucoup de goût. Le lieu est propre et accueillant. Je recommande à 100 % cet institut de beauté spécialisé dans les ongles et les cils. Un vrai coup de cœur pour cette nail artist passionnée qui sait sublimer les mains avec élégance.", who: 'Earine, 4 avis · 1 photo' },
  { text: "Franchement la meilleure prothésiste ongulaire de Viry-Châtillon (91) : Chloé alias beautybyc sans aucun doute !!! Elle me fait mes poses de Gel X, mon semi-permanent et mes nail arts (les plus fous) depuis un bon moment maintenant ! Elle prend toujours le temps d'écouter mes envies et elle arrive toujours à sublimer mes idées (même quand je pars loin). Un vrai moment de détente à chaque rendez-vous, dans une ambiance super agréable au salon. Si vous cherchez une pro en pose de gel et nail art dans le 91, foncez les yeux fermés !", who: 'VIOT Mathilde, 11 avis · 4 photos' },
  { text: "Super salon ! Découvert via les réseaux sociaux je suis très contente du travail réalisé par Julie j'ai fais un Powderbrow le résultat est magnifique merciii a toute l'équipe pour cette accueil.", who: 'morgane Garcin, Local Guide · 18 avis' },
  { text: "Très belle découverte ! J'ai achetée un coupon sur Groupon pour cet institut, très bien accueilli, le massage était top. De la propreté jusqu'à la petite musique, j'ai pris rdv pour une manucure, qui a été réalisé avec soin et minutie. J'ai repris aussi tôt rdv pour une pédicure et ça sera mon institut chouchou ! De vrai moment de détente Merci.", who: 'Chahinaize El Hadhiq, 3 avis · 1 photo' },
  { text: "Joli institut et agréable. Accueil chaleureux par Mélanie. J'y vais pour faire mes ongles, cela fait plusieurs fois que je les fait et ils sont bien réalisés et tiennent bien dans le temps. Je recommande.", who: 'Stéphanie S., 8 avis · 5 photos' },
  { text: "Prestation au top, je suis très satisfaite du travail de Sandy. Ma manucure était impeccable, bien soignée et elle a durée. Ça fait plaisir de voir des professionnelles impliquées dans leur travail. Sandy est très accueillante, gentille et rayonnante.", who: 'Gulustan Sarikaya, 13 avis' },
];

const differentiators = [
  { title: 'Diagnostic avant chaque soin', body: 'Aucune prestation standardisée : chaque geste est ajusté à votre peau, votre morphologie et vos objectifs du moment.' },
  { title: 'Technologies professionnelles', body: 'LPG Cellu M6, laser, lumière pulsée — des équipements de cabinet, pas de gadgets grand public.' },
  { title: 'Deux adresses, une constance', body: 'Même protocole, même exigence de soin, où que vous réserviez à Viry-Châtillon.' },
  { title: 'Rendez-vous en ligne, sans attente', body: 'Réservez en quelques secondes via Planity, confirmation immédiate, rappel automatique.' },
];

const faqs = [
  { q: 'Comment réserver un créneau ?', a: "Toutes les prestations se réservent en ligne via Planity — vous choisissez l'institut, le soin et le créneau, confirmation immédiate par SMS." },
  { q: 'Puis-je annuler ou modifier mon rendez-vous ?', a: 'Oui, directement depuis votre confirmation Planity, jusqu\u2019à 24h avant votre rendez-vous.' },
  { q: 'Quel institut choisir entre les deux adresses ?', a: 'Place du Marché propose la gamme complète (corps, visage, onglerie). Gabriel Péri est spécialisé onglerie et cils. Le même niveau d\u2019exigence partout.' },
  { q: 'Faut-il préparer sa peau avant une épilation ou un laser ?', a: 'Un exfoliant doux la veille et une peau non exposée au soleil suffisent — l\u2019équipe vous donne toutes les consignes à la réservation.' },
];

/* ────────────────────────────────────────────────────
   Styles partagés (keyframes + responsive minimal)
   — même logique que le <style> déjà utilisé dans l'ancien ServiceDrawer
──────────────────────────────────────────────────── */
function GlobalKeyframes() {
  return (
    <style>{`
      @keyframes ni-drawer-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
      @keyframes ni-drawer-center { from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
      @keyframes ni-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .ni-drawer-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 100; background: rgba(26,20,8,0.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
      .ni-drawer { position: fixed; top: 50%; left: 50%; width: min(400px, 85%); max-height: 78vh; transform: translate(-50%, -50%); background: ${C.paper}; display: flex; flex-direction: column; animation: ni-drawer-center .32s cubic-bezier(.4,0,.2,1); box-shadow: 0 20px 60px rgba(26,20,8,0.2); border-radius: 10px; overflow: hidden; }
      @media (prefers-reduced-motion: reduce) {
        .ni-marquee-row { animation: none !important; }
      }
      @media (max-width: 860px) {
        .ni-salon-row { grid-template-columns: 1fr !important; }
        .ni-salon-row.reverse .ni-salon-media { order: 0 !important; }
        .ni-drawer { top: 2vh; left: auto; right: 0; height: 88vh; max-height: 88vh; transform: translateX(0); border-radius: 0; animation: ni-drawer-in .32s cubic-bezier(.4,0,.2,1); box-shadow: -20px 0 60px rgba(26,20,8,0.2); }
      }
      @media (max-width: 960px) {
        .ni-fiches-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .ni-why-grid { grid-template-columns: 1fr !important; }
        .ni-why-item { border-left: none !important; padding-left: 0 !important; padding-right: 0 !important; }
      }
      @media (max-width: 520px) {
        .ni-fiches-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 700px) {
        .ni-sticky-cta { display: flex !important; }
        body { padding-bottom: 0; }
      }
    `}</style>
  );
}

/* ────────────────────────────────────────────────────
   Fiche beauté (signature)
──────────────────────────────────────────────────── */
function Fiche({ service, index, onClick }) {
  const ref = 'N° ' + String(index + 1).padStart(2, '0');
  return (
    <button
      onClick={onClick}
      style={{
        background: C.paper, border: `1px solid ${C.line}`, cursor: 'pointer',
        textAlign: 'left', display: 'flex', flexDirection: 'column',
        transition: 'transform .2s ease, box-shadow .2s ease', overflow: 'hidden', padding: 0,
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(26,20,8,0.14)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ height: 140, position: 'relative', overflow: 'hidden', backgroundColor: '#1a1408' }}>
        <video
          key={service.video}
          autoPlay
          muted
          loop
          playsInline
          poster={service.image || undefined}
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        >
          <source src={service.video ? encodeURI(service.video) : undefined} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(26,20,8,0.55) 100%)' }} />
        <span style={{ position: 'absolute', top: 12, left: 14, fontFamily: FONT_SC, fontSize: 11, letterSpacing: '0.06em', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.35)' }}>{ref}</span>
      </div>
      <div style={{ padding: '18px 16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 16.5, lineHeight: 1.25, color: 'var(--brun-dark)', marginBottom: 8 }}>{service.name}</div>
        <div style={{ fontFamily: FONT_CORPS, fontSize: 12.5, fontStyle: 'italic', color: C.muted, marginBottom: 16, flex: 1 }}>"{service.pitch}"</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
          <span style={{ fontFamily: FONT_SC, fontSize: 13, color: 'var(--brun-dark)' }}>{service.price}</span>
          <span style={{ fontFamily: FONT_CORPS, fontSize: 13, color: C.label }}>↗</span>
        </div>
      </div>
    </button>
  );
}

/* ────────────────────────────────────────────────────
   Panneau latéral (remplace le bottom-sheet)
──────────────────────────────────────────────────── */
function ServiceDrawer({ service, index, onClose }) {
  if (!service) return null;
  const ref = 'N° ' + String(index + 1).padStart(2, '0');
  return (
    <div
      onClick={onClose}
      className="ni-drawer-overlay"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="ni-drawer"
      >
        <div style={{ height: 170, position: 'relative', overflow: 'hidden', color: '#fff', backgroundColor: '#1a1408', zIndex: 10, flexShrink: 0 }}>
          {service.video ? (
            <video
              key={service.video}
              autoPlay
              muted
              loop
              playsInline
              poster={service.image || undefined}
              preload="auto"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            >
              <source src={encodeURI(service.video)} type="video/mp4" />
            </video>
          ) : (
            <img src={service.image || undefined} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(26,20,8,0.45) 0%, rgba(26,20,8,0.15) 50%, rgba(26,20,8,0.55) 100%)' }} />
          <button
            onClick={onClose}
            style={{ position: 'absolute', zIndex: 20, top: 14, right: 14, background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} strokeWidth={1.75} />
          </button>
          <div style={{ position: 'absolute', zIndex: 20, left: 0, right: 0, bottom: 0, padding: 20 }}>
            <div style={{ fontFamily: FONT_SC, fontSize: 12, letterSpacing: '0.1em', opacity: 0.9 }}>{ref}</div>
            <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 25, marginTop: 6 }}>{service.name}</div>
          </div>
        </div>

        <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 18, color: C.gold, marginBottom: 14, lineHeight: 1.4 }}>
            "{service.pitch}"
          </p>
          <div style={{ flex: 1, minHeight: 300, marginTop: 6, position: 'relative', overflow: 'hidden', isolation: 'isolate' }}>
            {service.name === 'Onglerie' ? <PlanityRaw /> : <PlanityWidget serviceSetIds={service.planityServiceSetIds} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Rangée éditoriale institut + grille de fiches
──────────────────────────────────────────────────── */
function SalonRow({ salon, reverse, onServiceClick }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? salon.services : salon.services.slice(0, 4);

  return (
    <div style={{ marginBottom: 64 }}>
      <div className={`ni-salon-row ${reverse ? 'reverse' : ''}`}>
        <div className="ni-salon-media" style={{ order: reverse ? 2 : 1 }}>
          <img src={salon.image} alt={salon.name} loading="lazy" />
          <div className="ni-salon-media-overlay" />
          <div className="ni-salon-media-content">
            <div className="ni-salon-media-label">Institut Mey Beauty</div>
            <div className="ni-salon-media-name">{salon.name}</div>
          </div>
        </div>

        <div className="ni-salon-info-block" style={{ order: reverse ? 1 : 2 }}>
          <p className="ni-salon-tagline">{salon.tagline}</p>
          <div className="ni-salon-meta">
            {[{ Icon: MapPin, text: salon.address }, { Icon: Phone, text: salon.phone }, { Icon: Clock, text: salon.hours }].map(({ Icon, text }) => (
              <div key={text} className="ni-salon-meta-item">
                <Icon size={16} strokeWidth={1.75} /> <span>{text}</span>
              </div>
            ))}
          </div>
          <a href={salon.planityUrl || planityUrl} target="_blank" rel="noreferrer" className="btn-rdv">
            Prendre rendez-vous <ArrowRight size={14} strokeWidth={2} />
          </a>
        </div>
      </div>

      <p className="ni-fiches-title">Fiches beauté — {salon.name}</p>
      <div className="ni-fiches-grid">
        {visible.map((s, i) => (
          <Fiche key={s.name} service={s} index={i} onClick={() => onServiceClick(s, i)} />
        ))}
      </div>
      {!showAll && salon.services.length > 4 && (
        <button onClick={() => setShowAll(true)} className="btn-rdv-outline" style={{ marginTop: 22 }}>
          Voir toutes les prestations
        </button>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Galerie ambiance
──────────────────────────────────────────────────── */
function Gallery() {
  const items = [
    { img: '/mey-beauty%20(1).jpeg', cap: 'Institut', col: 1, row: '1 / 3' },
    { img: '/mey-beauty%20(2).jpeg', cap: 'Ambiance', col: 2, row: 1 },
    { img: '/mey beauty.png', cap: 'Cabine', col: 3, row: 1 },
    { img: '/mey-beauty%20(4).jpeg', cap: 'Onglerie', col: 2, row: 2 },
    { img: '/mey beauty 1.png', cap: 'Accueil', col: 3, row: 2 },
  ];
  return (
    <section className="ni-gallery">
      <div className="ni-gallery-inner">
        <p className="section-kicker">L'expérience</p>
        <h2 className="section-title">Un cadre pensé pour la détente.</h2>
        <div className="ni-gallery-grid">
          {items.map((it, i) => (
            <div key={i} className={`ni-gallery-item ni-gallery-item-${i + 1}`}>
              <img src={it.img} alt={it.cap} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   Témoignages (marquee) — cartes taille fixe + "Voir plus"
──────────────────────────────────────────────────── */
function TestimonialCard({ t, expanded, onToggle }) {
  const long = t.text.length > 180;
  return (
    <div
      style={{
        background: 'rgba(245,242,238,0.06)',
        border: '1px solid rgba(245,242,238,0.12)',
        padding: 26,
        width: 340,
        minHeight: 300,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          fontFamily: FONT_SERIF,
          fontStyle: 'italic',
          fontSize: 16,
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        "{expanded ? t.text : t.text.slice(0, 180).trim() + (long ? '…' : '')}"
      </div>
      <div style={{ fontFamily: FONT_SC, fontSize: 12, opacity: 0.6, marginBottom: long ? 8 : 0 }}>
        {t.who}
      </div>
      {long && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            color: C.gold,
            fontFamily: FONT_SC,
            fontSize: 12,
            cursor: 'pointer',
            padding: 0,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {expanded ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
    </div>
  );
}

function Testimonials() {
  const [expandedIdx, setExpandedIdx] = useState(null); // index dans `testimonials`
  const row = [...testimonials, ...testimonials];

  const handleToggle = (i) => {
    const realIndex = i % testimonials.length;
    setExpandedIdx((prev) => (prev === realIndex ? null : realIndex));
  };

  return (
    <section style={{ background: 'var(--brun-dark)', color: C.bg, padding: '80px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px' }}>
        <p className="section-kicker" style={{ color: C.gold }}>Avis clientes</p>
        <h2 className="section-title" style={{ marginTop: 10, marginBottom: 40, color: C.bg }}>Ce qu'elles en disent.</h2>
      </div>
      {[0, 1].map(r => (
        <div
          key={r}
          className="ni-marquee-row"
          style={{
            display: 'flex', gap: 20, width: 'max-content',
            animation: `ni-marquee ${42 + r * 8}s linear infinite ${r === 1 ? 'reverse' : ''}`,
            animationPlayState: expandedIdx !== null ? 'paused' : 'running',
            marginTop: r === 1 ? 20 : 0,
          }}
        >
          {row.map((t, i) => {
            const realIndex = i % testimonials.length;
            return (
              <TestimonialCard
                key={i}
                t={t}
                expanded={expandedIdx === realIndex}
                onToggle={() => handleToggle(i)}
              />
            );
          })}
        </div>
      ))}
    </section>
  );
}

/* ────────────────────────────────────────────────────
   Pourquoi Mey Beauty (sans icônes, sans numérotation)
──────────────────────────────────────────────────── */
function WhySection() {
  return (
    <section style={{ padding: '100px 32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <p className="section-kicker">Pourquoi Mey Beauty</p>
        <h2 className="section-title" style={{ marginTop: 10 }}>Ce qui nous distingue.</h2>
        <div className="ni-why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: 50 }}>
          {differentiators.map((d, i) => (
            <div
              key={d.title}
              className="ni-why-item"
              style={{
                padding: '34px 0', borderTop: `1px solid ${C.line}`,
                paddingRight: i % 2 === 0 ? 40 : 0, paddingLeft: i % 2 === 1 ? 40 : 0,
                borderLeft: i % 2 === 1 ? `1px solid ${C.line}` : 'none',
              }}
            >
              <h3 style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 21, marginBottom: 10, color: 'var(--brun-dark)' }}>{d.title}</h3>
              <p style={{ fontFamily: FONT_CORPS, fontSize: 14, lineHeight: 1.7, color: 'var(--brun)' }}>{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   FAQ
──────────────────────────────────────────────────── */
function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderTop: `1px solid ${C.line}` }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '24px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: 15.5, fontWeight: 600, color: 'var(--brun-dark)' }}
      >
        <span>{item.q}</span>
        <Plus size={18} strokeWidth={2} style={{ color: C.gold, transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .2s', flexShrink: 0 }} />
      </button>
      <div style={{ maxHeight: isOpen ? 300 : 0, overflow: 'hidden', transition: 'max-height .3s ease' }}>
        <p style={{ fontFamily: FONT_CORPS, padding: '0 4px 24px', fontSize: 14, lineHeight: 1.75, color: 'var(--brun)', maxWidth: 640 }}>{item.a}</p>
      </div>
    </div>
  );
}

function Faq() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section style={{ padding: '0 32px 100px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <p className="section-kicker">Questions fréquentes</p>
        <h2 className="section-title" style={{ marginTop: 10, marginBottom: 30 }}>Avant de réserver.</h2>
        <div style={{ borderBottom: `1px solid ${C.line}` }}>
          {faqs.map((f, i) => (
            <FaqItem key={f.q} item={f} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   CTA final
──────────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section style={{ background: C.bg, color: 'var(--brun-dark)', padding: '110px 32px', textAlign: 'center', borderTop: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: 'clamp(32px,5vw,52px)', marginBottom: 22 }}>Votre rendez-vous vous attend.</h2>
        <p style={{ fontFamily: FONT_CORPS, opacity: 0.8, fontSize: 15, marginBottom: 36 }}>Choisissez votre institut, votre créneau — on s'occupe du reste.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={salon1.planityUrl} target="_blank" rel="noreferrer" className="btn-rdv">
            Réserver — Place du Marché
          </a>
          <a href={salon2.planityUrl} target="_blank" rel="noreferrer" className="btn-rdv-outline">
            Réserver — Gabriel Péri
          </a>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   Barre sticky mobile
──────────────────────────────────────────────────── */
function StickyMobileCta() {
  return (
    <div className="ni-sticky-cta" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90, background: 'var(--brun-dark)', padding: '12px 16px', gap: 10 }}>
      <a href="tel:+33749226801" className="btn-rdv-outline" style={{ flex: 1, borderColor: 'rgba(245,242,238,0.3)', color: C.bg }}>
        Appeler
      </a>
      <a href={planityUrl} target="_blank" rel="noreferrer" className="btn-rdv" style={{ flex: 1 }}>
        Réserver
      </a>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Page principale
──────────────────────────────────────────────────── */
export default function NosInstitutsPage() {
  const [activeService, setActiveService] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleServiceClick(service, index) {
    setActiveService(service);
    setActiveIndex(index);
  }
  function handleClose() {
    setActiveService(null);
  }

  return (
    <>
      <SEO
        title="Nos Instituts — Mey Beauty | Viry-Châtillon (91)"
        description="Découvrez les deux instituts Mey Beauty à Viry-Châtillon : épilation, LPG, soins visage, onglerie, extensions de cils. Réservez en ligne sur Planity."
        keywords="institut beauté Viry-Châtillon, Mey Beauty 91, épilation, soin visage, LPG, onglerie, extensions de cils, drainage lymphatique"
      />
      <GlobalKeyframes />

      <main className="nos-instituts-page" style={{ background: C.bg }}>

        {/* Hero — inchangé */}
        <section className="about-hero" aria-label="Nos instituts">
          <h1>Nos instituts</h1>
          <div className="about-breadcrumb">
            <a href="#home">Accueil</a>
            <span>/</span>
            <span>Nos instituts</span>
          </div>
        </section>

        <section style={{ padding: '50px 32px 20px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto 60px' }}>
            <p className="section-kicker">Nos espaces</p>
            <h2 className="section-title" style={{ marginTop: 10 }}>
              Deux adresses.<br />Un seul niveau d'exigence.
            </h2>
          </div>
          <div style={{ maxWidth: 1180, margin: '0 auto' }}>
            {salons.map((salon, i) => (
              <SalonRow key={salon.id} salon={salon} reverse={i % 2 === 1} onServiceClick={handleServiceClick} />
            ))}
          </div>
        </section>

        <Gallery />
        <Testimonials />
        <WhySection />
        <Faq />
        <FinalCta />
      </main>

      <StickyMobileCta />

      {activeService && (
        <ServiceDrawer service={activeService} index={activeIndex} onClose={handleClose} />
      )}

      <style>{`
        .ni-drawer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 100;
          background: rgba(26, 20, 8, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: ni-fade-in 0.25s ease;
        }
        .ni-drawer {
          width: min(520px, 100%);
          max-height: 82vh;
          background: var(--blanc, #FFFFFF);
          border-radius: 12px;
          box-shadow: 0 24px 80px rgba(26, 20, 8, 0.22);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: ni-drawer-center 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes ni-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ni-drawer-center {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes planity-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .ni-drawer-overlay {
            align-items: flex-end;
            justify-content: flex-end;
            padding: 0;
          }
          .ni-drawer {
            width: 100%;
            max-height: 85vh;
            height: 85vh;
            top: auto;
            bottom: 0;
            right: 0;
            left: auto;
            border-radius: 16px 16px 0 0;
            animation: ni-drawer-up 0.32s cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes ni-drawer-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        }
      `}</style>
    </>
  );
}