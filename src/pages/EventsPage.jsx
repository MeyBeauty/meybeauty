import {
  Calendar,
  Users,
  Sparkles,
  Wine,
  Gift,
  Heart,
  PhoneCall,
  Mail,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import SEO from '../components/SEO.jsx';

export default function EventsPage() {
  const benefits = [
    {
      icon: <Users size={20} strokeWidth={1.6} />,
      title: 'Entre amies',
      text: 'EVJF, anniversaires ou sorties bien-être : profitez d’une ambiance exclusive et de soins adaptés à chacune.',
    },
    {
      icon: <Calendar size={20} strokeWidth={1.6} />,
      title: 'Privatisation',
      text: 'Réservez l’institut pour votre groupe et bénéficiez d’un accès privé, d’un service personnalisé et d’un moment inoubliable.',
    },
    {
      icon: <Sparkles size={20} strokeWidth={1.6} />,
      title: 'Sur mesure',
      text: 'Nous élaborons des forfaits personnalisés selon vos envies, votre budget et le nombre de participants.',
    },
    {
      icon: <Wine size={20} strokeWidth={1.6} />,
      title: 'Ambiance festive',
      text: 'Petits fours, bulles et musique douce : nous créons l’atmosphère parfaite pour célébrer en beauté.',
    },
    {
      icon: <Gift size={20} strokeWidth={1.6} />,
      title: 'Cadeaux & goodies',
      text: 'Offrez des attentions personnalisées à vos invitées : tote bags, produits de soin ou bons cadeaux.',
    },
    {
      icon: <Heart size={20} strokeWidth={1.6} />,
      title: 'Soin de soi',
      text: 'Chaque participante repart détendue, chouchoutée et avec des conseils beauté personnalisés.',
    },
  ];

  const gallery = [
    { src: '/mey-beauty%20(1).jpeg', alt: 'Espace détente Mey Beauty' },
    { src: '/mey-beauty%20(5).jpeg', alt: 'Ambiance soin entre amies' },
    { src: '/mey-beauty%20(6).jpeg', alt: 'Rituel beauté privatisable' },
    { src: '/mey-beauty%20(7).jpeg', alt: 'Institut Mey Beauty' },
  ];

  return (
    <>
      <SEO
        title="Événements & Privatisation - Mey Beauty | Viry-Châtillon (91)"
        description="Privatisez l’institut Mey Beauty à Viry-Châtillon pour vos EVJF, anniversaires et moments entre amies. Forfaits sur mesure, ambiance élégante et soins personnalisés."
        keywords="privatisation institut beauté Viry-Châtillon, EVJF Mey Beauty 91, anniversaire spa entre amies, forfait bien-être Essonne, privatisation salon esthétique"
      />
      <main className="events-page">

        {/* ===== HERO — inchangé ===== */}
        <section className="events-hero" aria-label="Moments privilégiés">
          <h1>Moments privilégiés</h1>
          <div className="events-breadcrumb">
            <a href="#home">Accueil</a>
            <span>/</span>
            <span>Événements & Privatisation</span>
          </div>
        </section>

        {/* ===== INTRO — split éditorial avec arche + badge flottant ===== */}
        <section className="ev-intro" aria-label="Présentation">
          <div className="ev-intro-visual">
            <div className="ev-intro-arch">
              <img src="/mey-beauty%20(3).jpeg" alt="Moments privilégiés chez Mey Beauty" />
            </div>
            <div className="ev-intro-badge">
              <span className="ev-intro-badge-number">2</span>
              <span className="ev-intro-badge-label">Instituts à<br />Viry-Châtillon</span>
            </div>
          </div>

          <div className="ev-intro-content">
            <h2 className="ev-intro-title">
              Vos moments d'exception, privés.
            </h2>
            <p className="ev-intro-lead">
              Que ce soit pour célébrer un EVJF, fêter un anniversaire ou simplement savourer une pause bien-être, nos deux instituts de Viry-Châtillon se transforment selon vos désirs. Dans un cadre chaleureux et raffiné, nos équipes expertes orchestrent chaque détail pour vous offrir une expérience inoubliable, élégante et totalement détendue.
            </p>
            <p className="ev-intro-text">
              Offrez-vous le luxe d'un accès entièrement privé et d'un service haut de gamme personnalisé. Nous co-créons votre événement idéal en adaptant les soins et les rituels beauté à vos envies, à votre budget ainsi qu'au nombre de vos invitées pour que la magie opère pleinement.
            </p>
            <div className="ev-intro-actions">
              <a className="ev-btn-primary" href="tel:+33749226801">
                <PhoneCall size={15} strokeWidth={1.8} />
                Nous appeler
              </a>
              <a className="ev-btn-ghost" href="#contact">
                  Laisser nous un message
              </a>
            </div>
          </div>
        </section>

        {/* ===== FORMULES — liste éditoriale numérotée ===== */}
        <section className="ev-menu" aria-label="Nos formules">
          <div className="ev-menu-header">
            <span className="ev-kicker">Nos formules</span>
            <h2 className="ev-section-title">Ce que nous vous proposons</h2>
          </div>

          <div className="ev-menu-list">
            {benefits.map((b, i) => (
              <div className="ev-menu-item" key={i}>
                <span className="ev-menu-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="ev-menu-icon" aria-hidden="true">{b.icon}</span>
                <div className="ev-menu-text">
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== GALERIE — bento asymétrique ===== */}
        <section className="ev-gallery" aria-label="Galerie">
          <div className="ev-menu-header">
            <span className="ev-kicker">L’ambiance</span>
            <h2 className="ev-section-title">Un cadre pensé pour vous</h2>
          </div>

          <div className="ev-gallery-grid">
            {gallery.map((img, i) => (
              <div className={`ev-gallery-item ev-gallery-item-${i + 1}`} key={i}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="ev-gallery-overlay">
                  <span>{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== BANDEAU SIGNATURE — CTA + Contact fusionnés ===== */}
        <section className="ev-signature" aria-label="Demande de devis et contact">
          <div className="ev-signature-inner">
            <span className="ev-kicker ev-kicker-light">Moments privilégiés</span>
            <h2 className="ev-signature-title">
              Événements &amp; <em>Privatisation</em>
            </h2>
            <p className="ev-signature-text">
              Offrez-vous un moment d’exception entre amies ou en privatisant l’institut pour vos occasions spéciales.
            </p>
            <a className="ev-signature-btn" href="tel:+33749226801">
              <PhoneCall size={17} strokeWidth={1.8} />
              Nous appeler
            </a>
          </div>

          <div className="ev-contact-float">
            <div className="ev-contact-item">
              <span className="ev-contact-icon"><PhoneCall size={18} strokeWidth={1.6} /></span>
              <div>
                <div className="ev-contact-label">Téléphone</div>
                <a href="tel:+33749226801">+33 7 49 22 68 01</a>
              </div>
            </div>
            <div className="ev-contact-divider" />
            <div className="ev-contact-item">
              <span className="ev-contact-icon"><Mail size={18} strokeWidth={1.6} /></span>
              <div>
                <div className="ev-contact-label">Email</div>
                <a href="mailto:contact@meybeauty.fr">contact@meybeauty.fr</a>
              </div>
            </div>
            <div className="ev-contact-divider" />
            <div className="ev-contact-item">
              <span className="ev-contact-icon"><MapPin size={18} strokeWidth={1.6} /></span>
              <div>
                <div className="ev-contact-label">Adresse</div>
                <span>6 Place des Martyrs de Châteaubriand, 91170 Viry-Châtillon</span>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}