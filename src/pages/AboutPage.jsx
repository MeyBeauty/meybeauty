import {
  BadgeCheck,
  CalendarClock,
  Clock,
  Droplets,
  Eye,
  Flower,
  Heart,
  Leaf,
  MapPin,
  Paintbrush,
  PhoneCall,
  Play,
  Scissors,
  Sparkles,
  Star,
  Timer,
} from 'lucide-react';

import { useEffect } from 'react';
import TestimonialsSection from '../components/TestimonialsSection.jsx';
import SEO from '../components/SEO.jsx';

export default function AboutPage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#about-services') {
      const el = document.getElementById('about-services');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <SEO
        title="À Propos - Mey Beauty | Institut Beauté Viry-Châtillon (91)"
        description="Découvrez Mey Beauty, institut d'esthétique à Viry-Châtillon, Essonne (91). Équipe d'experts en soins visage, minceur, épilation, beauté du regard et onglerie. Votre beauté en Ile-de-France."
        keywords="institut esthétique Viry-Châtillon, Mey Beauty Essonne 91, équipe beauté IDF, experts soins visage Ile-de-France, salon esthétique Viry, institut bien-être 91"
      />
      <main className="about-page">
      <section className="about-hero" aria-label="À propos de Mey Beauty">
        <h1>À propos</h1>
        <div className="about-breadcrumb">
          <a href="#home">Accueil</a>
          <span>/</span>
          <span>À propos</span>
        </div>
      </section>

<section className="about-intro" aria-label="Présentation">
  <div className="about-collage" aria-hidden="true">
    <div className="about-img about-img-main">
      <img src="/mey-beauty%20(1).jpeg" alt="Mey Beauty — Institut" />
    </div>
    <div className="about-img about-img-top">
      <img src="/mey-beauty%20(5).jpeg" alt="Mey Beauty — Soins" />
    </div>
    <div className="about-img about-img-bottom">
      <img src="/mey-beauty%20(6).jpeg" alt="Mey Beauty — Détails" />
    </div>
  </div>

  <div className="about-text">
    <div className="about-label">À propos de nous</div>
    <h2>Votre institut à Viry‑Châtillon dédié à votre éclat naturel</h2>
    <p>
      Fondé avec la passion de l’excellence, Mey Beauty s’est construit autour d’une promesse simple : révéler l’éclat naturel de chaque femme grâce à une synergie parfaite entre technologies de pointe et rituels sensoriels.
      <br /><br />
      Nous croyons que la beauté ne réside pas dans l’artifice, mais dans la santé et la vitalité de votre peau, le galbe naturel de votre silhouette et la précision d’un regard sublimé.
      <br /><br />
      C’est pourquoi nous sélectionnons rigoureusement des protocoles d’avant-garde et des partenaires de renom mondial — comme les technologies de pointe LPG — pour garantir des résultats visibles dès la première séance, sans jamais faire de compromis sur votre moment de détente.
      <br /><br />
      Retrouvez-nous au 6 Place des Martyrs de Châteaubriand, 91170 Viry‑Châtillon, pour un instant de beauté et de sérénité.
    </p>

    <div className="about-badges" aria-label="Engagements">
      <div className="about-badge">
        <div className="about-badge-icon" aria-hidden="true">
          <Heart size={18} />
        </div>
        Détente & bien‑être
      </div>
      <div className="about-badge">
        <div className="about-badge-icon" aria-hidden="true">
          <BadgeCheck size={18} />
        </div>
        Soins personnalisés
      </div>
      <div className="about-badge">
        <div className="about-badge-icon" aria-hidden="true">
          <CalendarClock size={18} />
        </div>
        Réservation 24h/24
      </div>
      <div className="about-badge">
        <div className="about-badge-icon" aria-hidden="true">
          <Star size={18} />
        </div>
        Note 5/5 (200+ avis)
      </div>
      <div className="about-badge">
        <div className="about-badge-icon" aria-hidden="true">
          <Sparkles size={18} />
        </div>
        Multi‑expertises
      </div>
      <div className="about-badge">
        <div className="about-badge-icon" aria-hidden="true">
          <Clock size={18} />
        </div>
        Horaires adaptés
      </div>
    </div>

    <div className="about-cta-row">
      <a className="btn-cta" href="#contact">Réserver maintenant</a>
      <div className="about-contact">
        <div className="about-contact-icon" aria-hidden="true">
          <PhoneCall size={18} />
        </div>
        <div className="about-contact-text">
          <div className="about-contact-label">Contactez-nous</div>
          <a className="about-contact-value" href="tel:+33749226801">+33 7 49 22 68 01</a>
        </div>
      </div>
    </div>
  </div>
</section>


      <section className="about-instituts" aria-label="Nos instituts">
        <div className="about-instituts-header">
          <span className="section-kicker">Nos adresses</span>
          <h2 className="section-title">Deux instituts à Viry-Châtillon</h2>
        </div>
        <div className="about-instituts-grid">
          <div className="ni-salon-card">
            <div className="ni-salon-image">
              <img src="/mey-beauty%20(1).jpeg" alt="Mey Beauty — Place du Marché" />
              <div className="ni-salon-image-overlay" />
              <div className="ni-salon-image-content">
                <p className="ni-salon-label">Institut Mey Beauty</p>
                <h2 className="ni-salon-name">Place du Marché</h2>
              </div>
            </div>
            <div className="ni-salon-info">
              <p className="ni-salon-tagline">Le soin du corps, porté à son sommet.</p>
              <div className="ni-salon-meta">
                <div className="ni-salon-meta-item">
                  <MapPin size={16} aria-hidden="true" />
                  <span>6 Place des Martyrs de Châteaubriand, 91170 Viry‑Châtillon</span>
                </div>
                <div className="ni-salon-meta-item">
                  <Clock size={16} aria-hidden="true" />
                  <span>Lun–Jeu 10h–18h, Ven 10h–21h, Sam 9h–17h</span>
                </div>
                <div className="ni-salon-meta-item">
                  <PhoneCall size={16} aria-hidden="true" />
                  <a href="tel:+33749226801">+33 7 49 22 68 01</a>
                </div>
              </div>
              <a className="ni-salon-rdv" href="https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i" target="_blank" rel="noreferrer">
                Prendre rendez-vous
              </a>
            </div>
          </div>

          <div className="ni-salon-card">
            <div className="ni-salon-image">
              <img src="/mey-beauty%20(5).jpeg" alt="Mey Beauty — Boulevard Gabriel Péri" />
              <div className="ni-salon-image-overlay" />
              <div className="ni-salon-image-content">
                <p className="ni-salon-label">Institut Mey Beauty</p>
                <h2 className="ni-salon-name">Boulevard Gabriel Péri</h2>
              </div>
            </div>
            <div className="ni-salon-info">
              <p className="ni-salon-tagline">L'art du détail. La précision au service de votre beauté.</p>
              <div className="ni-salon-meta">
                <div className="ni-salon-meta-item">
                  <MapPin size={16} aria-hidden="true" />
                  <span>Boulevard Gabriel Péri, 91170 Viry‑Châtillon</span>
                </div>
                <div className="ni-salon-meta-item">
                  <Clock size={16} aria-hidden="true" />
                  <span>Lun–Jeu 10h–18h, Ven 10h–21h, Sam 9h–17h</span>
                </div>
                <div className="ni-salon-meta-item">
                  <PhoneCall size={16} aria-hidden="true" />
                  <a href="tel:+33749226801">+33 7 49 22 68 01</a>
                </div>
              </div>
              <a className="ni-salon-rdv" href="https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i" target="_blank" rel="noreferrer">
                Prendre rendez-vous
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="about-services" id="about-services" aria-label="Services">
        <div className="about-services-header">
          <span className="section-kicker">Nos expertises</span>
          <h2 className="section-title">Des soins sur mesure pour sublimer votre beauté</h2>
        </div>

        <div className="about-services-grid">
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Heart size={18} /></div>
            <h3>Soin intime</h3>
            <p>Des soins délicats et personnalisés pour votre confort et votre bien-être intime.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Scissors size={18} /></div>
            <h3>Épilation à la cire</h3>
            <p>Une épilation précise et adaptée à toutes les zones pour une peau lisse et nette.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Sparkles size={18} /></div>
            <h3>Épilation définitive</h3>
            <p>Technologie laser et lumière pulsée pour réduire durablement la repousse des poils.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Leaf size={18} /></div>
            <h3>Minceur</h3>
            <p>LPG, drainage lymphatique et madérothérapie pour affiner et raffermir la silhouette.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Droplets size={18} /></div>
            <h3>Soin visage personnalisé</h3>
            <p>Rituel nettoyant, hydratant ou anti-âge adapté à votre type de peau et à vos besoins.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Paintbrush size={18} /></div>
            <h3>Onglerie</h3>
            <p>Manucure, vernis classique ou semi-permanent, et nail care pour des mains sublimées.</p>
          </div>
        </div>
      </section>

      <section className="about-video" aria-label="Promotion">
        <div className="about-play-ring" aria-hidden="true">
          <svg className="about-ring-text" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path id="about-circle-path" d="M55,55 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <text fill="rgba(255,255,255,0.62)" fontFamily="Lato, sans-serif" fontSize="8.5" letterSpacing="3">
              <textPath href="#about-circle-path">MEY BEAUTY · RÉSERVATION EN LIGNE ·</textPath>
            </text>
          </svg>
          <div className="about-play-btn">
            <Play size={16} />
          </div>
        </div>

        <h2>Des soins ciblés, des résultats visibles, un moment pour vous</h2>
        <p>
          Nos prestations couvrent les essentiels d’un institut moderne : soin visage, minceur et remodelage,
          épilation, beauté du regard, onglerie et blanchiment dentaire esthétique. Réservation possible 24h/24
          avec confirmation immédiate.
        </p>
        <a className="about-outline-btn" href="#about-services">Découvrir nos services</a>

        <div className="about-stats" aria-label="Chiffres clés">
          <div className="about-stat">
            <div className="about-stat-icon" aria-hidden="true"><Star size={18} /></div>
            <div className="about-stat-number">5/5</div>
            <div className="about-stat-label">Note moyenne</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-icon" aria-hidden="true"><BadgeCheck size={18} /></div>
            <div className="about-stat-number">200+</div>
            <div className="about-stat-label">Avis clients</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-icon" aria-hidden="true"><Timer size={18} /></div>
            <div className="about-stat-number">24/7</div>
            <div className="about-stat-label">Réservation en ligne</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-icon" aria-hidden="true"><Heart size={18} /></div>
            <div className="about-stat-number">3</div>
            <div className="about-stat-label">Collaboratrices</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-icon" aria-hidden="true"><Sparkles size={18} /></div>
            <div className="about-stat-number">6</div>
            <div className="about-stat-label">Pôles</div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <section className="about-team" aria-label="Équipe">
        <div className="about-team-header">
          <span className="section-kicker">L’équipe</span>
          <h2 className="section-title">Des mains expertes, une attention sincère</h2>
        </div>

        <div className="about-team-grid">
          <div className="about-team-card">
            <div className="about-team-photo">
              <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80" alt="Mélanie" />
              <div className="about-team-caption">
                <div className="about-team-name">Mélanie</div>
                <div className="about-team-role">Soins & accompagnement</div>
              </div>
            </div>
          </div>
          <div className="about-team-card">
            <div className="about-team-photo">
              <img src="https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=80" alt="Brianna" />
              <div className="about-team-caption">
                <div className="about-team-name">Brianna</div>
                <div className="about-team-role">Beauté du regard</div>
              </div>
            </div>
          </div>
          <div className="about-team-card">
            <div className="about-team-photo">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80" alt="Yoana" />
              <div className="about-team-caption">
                <div className="about-team-name">Yoana</div>
                <div className="about-team-role">Onglerie & finitions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-footer" aria-label="Retour">
        <a href="#home" className="about-back">Retour à l’accueil</a>
      </section>
    </main>
    </>
  );
}
