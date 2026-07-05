import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, ArrowRight, X, Plus } from 'lucide-react';
import SEO from '../components/SEO.jsx';

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
  tagline: 'Le soin du corps, porté à son sommet.',
  address: '6 Place des Martyrs de Châteaubriand, 91170 Viry-Châtillon',
  phone: '+33 7 49 22 68 01',
  hours: 'Lun–Jeu 10h–18h, Ven 10h–21h, Sam 9h–17h',
  image: '/mey-beauty%20(1).jpeg',
  services: [
    { name: 'Épilation', price: 'À partir de 15 €', family: 'precision', image: '/epilation-a-la-cire.jpg', pitch: 'Peau lisse. Dès la première séance.', description: 'Cires douces adaptées à toutes les zones. Résultat impeccable, confort maximal.' },
    { name: 'Épilation définitive', price: 'À partir de 55 €', family: 'precision', image: '/Epilation-laser.webp', pitch: 'Fini les poils, pour de bon.', description: 'Laser et lumière pulsée pour une réduction durable. Peau nette au quotidien, sans contrainte.' },
    { name: 'LPG Cellu M6', price: 'À partir de 75 €', family: 'corps', image: '/soin-minceur.PNG', pitch: 'Votre silhouette, sculptée par la technologie.', description: 'Endermologie brevetée pour cibler la cellulite, raffermir la peau et affiner durablement.' },
    { name: 'Drainage lymphatique', price: 'À partir de 70 €', family: 'corps', image: '/DrainageLymphatiqueSilhouette.jpg', pitch: 'Légèreté retrouvée. Corps libéré.', description: 'Massage manuel profond pour éliminer les toxines, activer la circulation et soulager les jambes lourdes.' },
    { name: 'Madérothérapie', price: 'À partir de 80 €', family: 'corps', image: '/soin%20minceur%20(1).jpg', pitch: 'Le bois sculpte, le corps se transforme.', description: 'Instruments en bois naturel pour déloger la cellulite, modeler les courbes et améliorer la circulation.' },
    { name: 'Soin visage', price: 'À partir de 65 €', family: 'visage', image: '/soin%20visage%20(2).jpg', pitch: 'Votre teint, réveillé.', description: 'Rituel nettoyant, hydratant ou anti-âge personnalisé selon votre type de peau pour une peau lumineuse.' },
    { name: 'Spray tan', price: 'À partir de 40 €', family: 'visage', image: '/beaut%C3%A9%20regard%20(2).jpg', pitch: 'Bronzée. Sans le soleil.', description: 'Hâle doré, uniforme et longue tenue. Sans UV, sans risque, avec un rendu naturel garanti.' },
    { name: 'Beauté du regard', price: 'À partir de 25 €', family: 'visage', image: '/regard.jpg', pitch: "Des yeux qui parlent d'eux-mêmes.", description: 'Coloration, rehaussement et soin des cils et sourcils pour un regard ouvert et intense.' },
    { name: 'Onglerie', price: 'À partir de 30 €', family: 'visage', image: '/Manucure%20Japonaise%20%20Le%20soin%20d%C3%A9tox%20r%C3%A9volutionnaire%20pour%20des%20ongles%20sains%20et%20brillants.jpg', pitch: 'Des mains à croquer.', description: 'Manucure, vernis classique ou semi-permanent pour des ongles soignés et des mains impeccables.' },
    { name: 'Tatouage semi-permanent', price: 'À partir de 150 €', family: 'precision', image: '/Tatouage%20semi-permanent%20%20Le%20secret%20d%27une%20mise%20en%20beaut%C3%A9%20durable%20et%20naturelle.jpg', pitch: 'Réveillée belle. Tous les matins.', description: 'Sourcils, lèvres ou yeux subtilement rehaussés pour une beauté naturelle et durable sans effort.' },
  ],
};

const salon2 = {
  id: 'gabriel-peri',
  name: 'Boulevard Gabriel Péri',
  tagline: "L'art du détail. La précision au service de votre beauté.",
  address: 'Boulevard Gabriel Péri, 91170 Viry-Châtillon',
  phone: '+33 7 49 22 68 01',
  hours: 'Lun–Jeu 10h–18h, Ven 10h–21h, Sam 9h–17h',
  image: '/mey-beauty%20(5).jpeg',
  services: [
    { name: 'Onglerie', price: 'À partir de 30 €', family: 'visage', image: '/meybeauty.jpg', pitch: 'Des mains sublimées, une finition parfaite.', description: "Manucure, vernis, semi-permanent et nail art pour des mains d'exception." },
    { name: 'Extensions de cils', price: 'À partir de 90 €', family: 'visage', image: '/beaut%C3%A9%20regard%20(3).PNG', pitch: 'Un regard intense. Sans mascara.', description: 'Pose à cils ou volume russe selon votre morphologie pour un regard qui captive.' },
  ],
};

const salons = [salon1, salon2];

const testimonials = [
  { text: 'Le soin LPG a changé ma routine bien-être. Un vrai savoir-faire, pas juste un massage.', who: 'Léa, cliente Place du Marché' },
  { text: 'Extensions de cils impeccables, tenue parfaite pendant plus de 3 semaines.', who: 'Sarah, cliente Gabriel Péri' },
  { text: 'L\u2019épilation définitive tient vraiment ses promesses. Résultats visibles dès la 3e séance.', who: 'Nadia, cliente Place du Marché' },
  { text: "Accueil chaleureux, jamais l'impression d'être pressée. On prend le temps.", who: 'Fatou, cliente' },
  { text: 'La madérothérapie est bluffante, ma silhouette est plus dessinée après quelques séances.', who: 'Camille, cliente' },
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
      @keyframes ni-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @media (prefers-reduced-motion: reduce) {
        .ni-marquee-row { animation: none !important; }
      }
      @media (max-width: 860px) {
        .ni-salon-row { grid-template-columns: 1fr !important; }
        .ni-salon-row.reverse .ni-salon-media { order: 0 !important; }
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
      <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
        <img src={service.image} alt={service.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(26,20,8,0.55) 100%)' }} />
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
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(26,20,8,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 0, right: 0, height: '100%', width: 'min(460px, 100%)',
          background: C.paper, display: 'flex', flexDirection: 'column',
          animation: 'ni-drawer-in .32s cubic-bezier(.4,0,.2,1)',
          boxShadow: '-20px 0 60px rgba(26,20,8,0.2)',
        }}
      >
        <div style={{ height: 220, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
          <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,20,8,0.45) 0%, rgba(26,20,8,0.15) 50%, rgba(26,20,8,0.55) 100%)' }} />
          <button
            onClick={onClose}
            style={{ position: 'relative', zIndex: 2, alignSelf: 'flex-end', background: 'rgba(255,255,255,0.18)', border: 'none', color: 'inherit', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} strokeWidth={1.75} />
          </button>
          <div style={{ position: 'relative', zIndex: 2, padding: 24 }}>
            <div style={{ fontFamily: FONT_SC, fontSize: 12, letterSpacing: '0.1em', opacity: 0.9 }}>{ref}</div>
            <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 28, marginTop: 8 }}>{service.name}</div>
          </div>
        </div>

        <div style={{ padding: '30px 28px', flex: 1, overflowY: 'auto' }}>
          <p style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 19, color: C.gold, marginBottom: 18, lineHeight: 1.4 }}>
            "{service.pitch}"
          </p>
          <p style={{ fontFamily: FONT_CORPS, fontSize: 14, lineHeight: 1.8, color: 'var(--brun)', marginBottom: 28 }}>
            {service.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, marginBottom: 26 }}>
            <div>
              <div style={{ fontFamily: FONT_CORPS, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.label, marginBottom: 4 }}>Tarif</div>
              <div style={{ fontFamily: FONT_SC, fontSize: 20, color: 'var(--brun-dark)' }}>{service.price}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FONT_CORPS, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.label, marginBottom: 4 }}>Disponibilité</div>
              <div style={{ fontFamily: FONT_CORPS, fontSize: 13, color: 'var(--brun-dark)' }}>Lun–Sam, 9h30–19h30</div>
            </div>
          </div>

          <a href={planityUrl} target="_blank" rel="noreferrer" className="btn-rdv" style={{ width: '100%', justifyContent: 'center' }}>
            Réserver cette prestation <ArrowRight size={16} strokeWidth={2} />
          </a>
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
          <a href={planityUrl} target="_blank" rel="noreferrer" className="btn-rdv">
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
    { img: '/mey-beauty%20(3).jpeg', cap: 'Cabine', col: 3, row: 1 },
    { img: '/mey-beauty%20(4).jpeg', cap: 'Onglerie', col: 2, row: 2 },
    { img: '/mey-beauty%20(5).jpeg', cap: 'Accueil', col: 3, row: 2 },
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
   Témoignages (marquee)
──────────────────────────────────────────────────── */
function Testimonials() {
  const row = [...testimonials, ...testimonials];
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
            marginTop: r === 1 ? 20 : 0,
          }}
        >
          {row.map((t, i) => (
            <div key={i} style={{ background: 'rgba(245,242,238,0.06)', border: '1px solid rgba(245,242,238,0.12)', padding: 26, width: 340, flexShrink: 0 }}>
              <p style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>"{t.text}"</p>
              <div style={{ fontFamily: FONT_SC, fontSize: 12, opacity: 0.6 }}>{t.who}</div>
            </div>
          ))}
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
          <a href={planityUrl} target="_blank" rel="noreferrer" className="btn-rdv">
            Réserver — Place du Marché
          </a>
          <a href={planityUrl} target="_blank" rel="noreferrer" className="btn-rdv-outline">
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
    </>
  );
}