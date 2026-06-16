import { Mail, MapPin, Phone } from 'lucide-react';
import SEO from '../components/SEO.jsx';

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact & Réservation — Mey Beauty Paris"
        description="Contactez Mey Beauty à Viry-Châtillon. Réservez vos soins visage, massages, épilation. Tél: +33 7 49 22 68 01. 6 Place des Martyrs de Châteaubriand."
        keywords="contact institut beauté, réserver soin visage, Viry-Châtillon, Mey Beauty téléphone"
      />
      <main className="contact-page">
      <section className="page-hero-banner" aria-label="Bannière">
        <h1>Contact</h1>
        <div className="breadcrumb">
          <a href="#home">Accueil</a>
          <span>/</span>
          <span>Contact</span>
        </div>
      </section>

      <section className="contact-section" aria-label="Formulaire de contact">
        <div className="contact-left">
          <p className="contact-label">Nous contacter</p>
          <h2>Notre institut</h2>

          <p className="branch-title">Mey Beauty — Viry‑Châtillon</p>

          <div className="contact-infos">
            <div className="contact-info-item">
              <div className="info-icon" aria-hidden="true">
                <Mail size={16} />
              </div>
              <div className="info-content">
                <div className="info-title">Écrivez‑nous</div>
                <div className="info-text">contact@meybeauty.fr</div>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="info-icon" aria-hidden="true">
                <MapPin size={16} />
              </div>
              <div className="info-content">
                <div className="info-title">Adresse</div>
                <div className="info-text">
                  6 Place des Martyrs de Châteaubriand<br />
                  91170 Viry‑Châtillon
                </div>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="info-icon" aria-hidden="true">
                <Phone size={16} />
              </div>
              <div className="info-content">
                <div className="info-title">Téléphone</div>
                <div className="info-text">+33 7 49 22 68 01</div>
              </div>
            </div>
          </div>

          <img
            src="/mey-beauty (1).jpeg"
            alt="Espace spa et bien‑être"
            className="spa-photo"
            loading="lazy"
          />
        </div>

        <div className="form-panel">
          <h3>Réserver un rendez‑vous</h3>
          <p className="form-desc">
            Dites‑nous ce que vous souhaitez (soin visage, soins minceur et bien‑être, soin spa,
            massages corps, beauté du regard, onglerie) — nous vous recontactons rapidement.
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-date">Date souhaitée</label>
                <input id="contact-date" type="date" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-service">Type de soin</label>
                <div className="select-wrap">
                  <select id="contact-service" defaultValue="">
                    <option value="" disabled>Sélectionner</option>
                    <option>Soin visage</option>
                    <option>Soins minceur et bien‑être</option>
                    <option>Soin spa</option>
                    <option>Massages corps</option>
                    <option>Beauté du regard</option>
                    <option>Onglerie</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="contact-people">Nombre de personnes</label>
                <div className="select-wrap">
                  <select id="contact-people" defaultValue="1">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="services-title">Choisir des services</div>
            <div className="services-grid" aria-label="Choix des services">
              <label className="checkbox-item">
                <input type="checkbox" />
                <span className="checkbox-box" aria-hidden="true"></span>
                Soin visage
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />
                <span className="checkbox-box" aria-hidden="true"></span>
                Soins minceur et bien‑être
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />
                <span className="checkbox-box" aria-hidden="true"></span>
                Soin spa
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />
                <span className="checkbox-box" aria-hidden="true"></span>
                Massages corps
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />
                <span className="checkbox-box" aria-hidden="true"></span>
                Beauté du regard
              </label>
              <label className="checkbox-item">
                <input type="checkbox" />
                <span className="checkbox-box" aria-hidden="true"></span>
                Onglerie
              </label>
            </div>

            <button type="submit" className="btn-submit">— Envoyer la demande —</button>
          </form>
        </div>
      </section>

      <section className="map-section" aria-label="Carte">
        <iframe
          title="Carte Mey Beauty"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=6%20Place%20des%20Martyrs%20de%20Ch%C3%A2teaubriand%2091170%20Viry-Ch%C3%A2tillon&output=embed"
        />
      </section>
    </main>
    </>
  );
}
