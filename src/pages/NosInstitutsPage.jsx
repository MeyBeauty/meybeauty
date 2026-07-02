import { useState } from 'react';
import { MapPin, Clock, Phone, ArrowRight, X, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const planityUrl = 'https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i';

const salon1 = {
  id: 'place-du-marche',
  name: 'Place du Marché',
  tagline: 'Le soin du corps, porté à son sommet.',
  address: '6 Place des Martyrs de Châteaubriand, 91170 Viry-Châtillon',
  phone: '+33 7 49 22 68 01',
  hours: 'Lun – Sam : 9h30 – 19h30',
  image: '/mey-beauty%20(1).jpeg',
  accent: '#b59a6a',
  services: [
    {
      name: 'Épilation',
      price: 'À partir de 15 €',
      emoji: '✦',
      pitch: 'Peau lisse. Dès la première séance.',
      description: 'Cires douces adaptées à toutes les zones. Résultat impeccable, confort maximal.',
    },
    {
      name: 'Épilation définitive',
      price: 'À partir de 55 €',
      emoji: '✦',
      pitch: 'Fini les poils, pour de bon.',
      description: 'Laser et lumière pulsée pour une réduction durable. Peau nette au quotidien, sans contrainte.',
    },
    {
      name: 'LPG Cellu M6',
      price: 'À partir de 75 €',
      emoji: '✦',
      pitch: 'Votre silhouette, sculptée par la technologie.',
      description: 'Endermologie brevetée pour cibler la cellulite, raffermir la peau et affiner durablement.',
    },
    {
      name: 'Drainage lymphatique',
      price: 'À partir de 70 €',
      emoji: '✦',
      pitch: 'Légèreté retrouvée. Corps libéré.',
      description: 'Massage manuel profond pour éliminer les toxines, activer la circulation et soulager les jambes lourdes.',
    },
    {
      name: 'Madérothérapie',
      price: 'À partir de 80 €',
      emoji: '✦',
      pitch: 'Le bois sculpte, le corps se transforme.',
      description: 'Instruments en bois naturel pour déloger la cellulite, modeler les courbes et améliorer la circulation.',
    },
    {
      name: 'Soin visage',
      price: 'À partir de 65 €',
      emoji: '✦',
      pitch: 'Votre teint, réveillé.',
      description: 'Rituel nettoyant, hydratant ou anti-âge personnalisé selon votre type de peau pour une peau lumineuse.',
    },
    {
      name: 'Spray tan',
      price: 'À partir de 40 €',
      emoji: '✦',
      pitch: 'Bronzée. Sans le soleil.',
      description: 'Hâle doré, uniforme et longue tenue. Sans UV, sans risque, avec un rendu naturel garanti.',
    },
    {
      name: 'Beauté du regard',
      price: 'À partir de 25 €',
      emoji: '✦',
      pitch: 'Des yeux qui parlent d\'eux-mêmes.',
      description: 'Coloration, rehaussement et soin des cils et sourcils pour un regard ouvert et intense.',
    },
    {
      name: 'Onglerie',
      price: 'À partir de 30 €',
      emoji: '✦',
      pitch: 'Des mains à croquer.',
      description: 'Manucure, vernis classique ou semi-permanent pour des ongles soignés et des mains impeccables.',
    },
    {
      name: 'Tatouage semi-permanent',
      price: 'À partir de 150 €',
      emoji: '✦',
      pitch: 'Réveillée belle. Tous les matins.',
      description: 'Sourcils, lèvres ou yeux subtilement rehaussés pour une beauté naturelle et durable sans effort.',
    },
  ],
};

const salon2 = {
  id: 'gabriel-peri',
  name: 'Boulevard Gabriel Péri',
  tagline: 'L\'art du détail. La précision au service de votre beauté.',
  address: 'Boulevard Gabriel Péri, 91170 Viry-Châtillon',
  phone: '+33 7 49 22 68 01',
  hours: 'Lun – Sam : 9h30 – 19h30',
  image: '/mey-beauty%20(5).jpeg',
  accent: '#c4a882',
  services: [
    {
      name: 'Onglerie',
      price: 'À partir de 30 €',
      emoji: '✦',
      pitch: 'Des mains sublimées, une finition parfaite.',
      description: 'Manucure, vernis, semi-permanent et nail art pour des mains d\'exception.',
    },
    {
      name: 'Extensions de cils',
      price: 'À partir de 90 €',
      emoji: '✦',
      pitch: 'Un regard intense. Sans mascara.',
      description: 'Pose à cils ou volume russe selon votre morphologie pour un regard qui captive.',
    },
  ],
};

const salons = [salon1, salon2];

/* ────────────────────────────────────────────────────
   Panneau de détail d'une prestation
──────────────────────────────────────────────────── */
function ServiceDrawer({ service, salonAccent, onClose }) {
  if (!service) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(10,8,6,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 0 0 0',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560,
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '36px 32px 40px',
          boxShadow: '0 -20px 80px rgba(10,8,6,0.18)',
          animation: '_up .28s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <style>{`@keyframes _up{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.22em', color: salonAccent, fontWeight: 600, marginBottom: 6 }}>
              Prestation
            </p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: '#1a1408', lineHeight: 1.15 }}>
              {service.name}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: '#f5f2ee', border: 'none', borderRadius: 50, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6458', flexShrink: 0 }}>
            <X size={17} strokeWidth={1.75} />
          </button>
        </div>

        <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic', color: '#8a7a5a', marginBottom: 16, lineHeight: 1.4 }}>
          "{service.pitch}"
        </p>

        <p style={{ fontSize: 14, color: '#6b6458', lineHeight: 1.75, marginBottom: 28 }}>
          {service.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid rgba(10,8,6,0.08)', borderBottom: '1px solid rgba(10,8,6,0.08)', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#9ca3af', marginBottom: 4 }}>Tarif</p>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1a1408' }}>{service.price}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#9ca3af', marginBottom: 4 }}>Disponibilité</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1408' }}>Lun – Sam, 9h30–19h30</p>
          </div>
        </div>

        <a
          href={planityUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '15px 24px',
            background: '#1a1408', color: '#fff', borderRadius: 14,
            fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.02em',
            transition: 'opacity .15s',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          Réserver cette prestation
          <ArrowRight size={16} strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Carte d'un institut (colonne)
──────────────────────────────────────────────────── */
function SalonColumn({ salon, onServiceClick }) {
  const [showServices, setShowServices] = useState(false);
  return (
    <div className="ni-salon-card">

      {/* Image en-tête */}
      <div className="ni-salon-image">
        <img
          src={salon.image}
          alt={salon.name}
          loading="lazy"
        />
        <div className="ni-salon-image-overlay" />
        <div className="ni-salon-image-content">
          <p className="ni-salon-label">Institut Mey Beauty</p>
          <h2 className="ni-salon-name">{salon.name}</h2>
        </div>
      </div>

      {/* Infos pratiques */}
      <div className="ni-salon-info">
        <p className="ni-salon-tagline">{salon.tagline}</p>
        <div className="ni-salon-meta">
          {[
            { Icon: MapPin,  text: salon.address },
            { Icon: Phone,   text: salon.phone   },
            { Icon: Clock,   text: salon.hours   },
          ].map(({ Icon, text }) => (
            <div key={text} className="ni-salon-meta-item">
              <Icon size={16} strokeWidth={1.75} />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <a
          href={planityUrl}
          target="_blank"
          rel="noreferrer"
          className="ni-salon-rdv"
        >
          Prendre rendez-vous <ArrowRight size={14} strokeWidth={2} />
        </a>
      </div>

      {/* Accordéon prestations */}
      <div className="ni-salon-services">
        <button
          type="button"
          className={`ni-salon-accordion ${showServices ? 'ni-salon-accordion-open' : ''}`}
          onClick={() => setShowServices(v => !v)}
          aria-expanded={showServices}
        >
          <span>Nos prestations</span>
          <ChevronDown size={18} strokeWidth={1.75} />
        </button>

        <div className={`ni-salon-services-list ${showServices ? 'ni-salon-services-list-open' : ''}`}>
          <div>
            {salon.services.map((service) => (
              <button
                key={service.name}
                type="button"
                onClick={() => onServiceClick(service, salon)}
                className="ni-salon-service-item"
              >
                <span className="ni-salon-service-name">{service.name}</span>
                <span className="ni-salon-service-action">Découvrir</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   Page principale
──────────────────────────────────────────────────── */
export default function NosInstitutsPage() {
  const [activeService, setActiveService] = useState(null);
  const [activeSalon, setActiveSalon]     = useState(null);

  function handleServiceClick(service, salon) {
    setActiveService(service);
    setActiveSalon(salon);
  }

  function handleClose() {
    setActiveService(null);
    setActiveSalon(null);
  }

  return (
    <>
      <SEO
        title="Nos Instituts — Mey Beauty | Viry-Châtillon (91)"
        description="Découvrez les deux instituts Mey Beauty à Viry-Châtillon : épilation, LPG, soins visage, onglerie, extensions de cils. Réservez en ligne sur Planity."
        keywords="institut beauté Viry-Châtillon, Mey Beauty 91, épilation, soin visage, LPG, onglerie, extensions de cils, drainage lymphatique"
      />

      <main className="nos-instituts-page">

        <section className="about-hero" aria-label="Nos instituts">
          <h1>Nos instituts</h1>
          <div className="about-breadcrumb">
            <a href="#home">Accueil</a>
            <span>/</span>
            <span>Nos instituts</span>
          </div>
        </section>

        {/* ── Deux colonnes côte à côte ── */}
        <section className="nos-instituts-list" aria-label="Nos espaces">
          {/* Accroche */}
          <div className="nos-instituts-list-header">
            <p className="section-kicker">Nos espaces</p>
            <h2 className="section-title">Deux adresses.<br />Un seul niveau d'exigence.</h2>
            <p className="nos-instituts-list-intro">
              Chaque soin est pensé pour vous faire vivre quelque chose - pas juste vous faire sortir plus belle, mais vous faire vous sentir à votre meilleur.

            </p>
          </div>

          <div className="nos-instituts-columns">
            {salons.map(salon => (
              <SalonColumn
                key={salon.id}
                salon={salon}
                onServiceClick={handleServiceClick}
              />
            ))}
          </div>
        </section>
      </main>

      {/* ── Panneau de détail prestation ── */}
      {activeService && (
        <ServiceDrawer
          service={activeService}
          salonAccent={activeSalon?.accent || '#b59a6a'}
          onClose={handleClose}
        />
      )}
    </>
  );
}
