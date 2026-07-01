import {
  BadgeCheck,
  CalendarClock,
  Clock,
  Droplets,
  Eye,
  Flower,
  Heart,
  Leaf,
  Paintbrush,
  PhoneCall,
  Play,
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
 Situé au 6 Place des Martyrs de Châteaubriand 91170 à Viry-Chatillon, Mey Beauty vous accueille dans un institut raffiné, pensé comme un véritable écrin de beauté, de bien-être et de détente.
<br />
Notre mission est de vous offrir une expérience sur mesure à travers des soins d’exception, conçus pour sublimer votre beauté, révéler l’éclat naturel de votre peau, intensifier votre regard et mettre en valeur votre silhouette
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

      <section className="about-services" id="about-services" aria-label="Services">
        <div className="about-services-header">
          <span className="section-kicker">Nos services</span>
          <h2 className="section-title">Une expertise complète, pensée pour vous</h2>
        </div>

        <div className="about-services-grid">
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Droplets size={18} /></div>
            <h3>Soin du visage</h3>
            <p>Nettoyage, peau neuve, soin du dos et rituels éclat pour une peau lumineuse.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Leaf size={18} /></div>
            <h3>Minceur & remodelage</h3>
            <p>LPG Cellu M6, drainage lymphatique, madérothérapie — cures & séances.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Flower size={18} /></div>
            <h3>Épilation</h3>
            <p>Classique ou IPL (épilation définitive) avec bilan obligatoire avant traitement.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Eye size={18} /></div>
            <h3>Beauté du regard</h3>
            <p>Rehaussement, teinture, brow lift, microblading et powder brows.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Paintbrush size={18} /></div>
            <h3>Onglerie</h3>
            <p>Manucure, semi‑permanent mains/pieds, réparation ongle, nail care.</p>
          </div>
          <div className="about-service-card">
            <div className="about-service-icon" aria-hidden="true"><Sparkles size={18} /></div>
            <h3>Blanchiment dentaire</h3>
            <p>Sans peroxyde, activation LED — express 20min ou séance complète 1h.</p>
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
