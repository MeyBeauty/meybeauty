import { useState } from 'react';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const PLANITY_URL = 'https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i';

const SUBJECTS = [
  { value: 'reservation', label: 'Réservation' },
  { value: 'renseignement', label: 'Demande de renseignement' },
  { value: 'autre', label: 'Autre' },
];

export default function ContactPage() {
  const [subject, setSubject] = useState('reservation');
  const [otherSubject, setOtherSubject] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Contact & Réservation - Mey Beauty Viry-Châtillon (91)"
        description="Contactez Mey Beauty institut de beauté à Viry-Châtillon, Essonne (91). Réservez vos soins visage, massages relaxants, épilation. Adresse: 6 Place des Martyrs de Châteaubriand. Tél: 07 49 22 68 01."
        keywords="contact institut beauté Viry-Châtillon, réserver soin visage Essonne 91, esthéticienne Ile-de-France, Mey Beauty adresse téléphone, rendez-vous beauté IDF, salon esthétique Viry"
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

          <p className="branch-title">Mey Beauty - Viry‑Châtillon</p>

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
          <h3>Écrivez‑nous</h3>
          <p className="form-desc">
            Remplissez ce formulaire pour toute demande. Pour une réservation,
            nous vous invitons à réserver directement via Planity.
          </p>

          {subject === 'reservation' && (
            <div className="planity-suggest">
              <p>
                Pour réserver un créneau, c'est par ici&nbsp;:
              </p>
              <a
                href={PLANITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="planity-suggest-link"
              >
                Réserver sur Planity
                <ExternalLink size={14} strokeWidth={1.6} />
              </a>
            </div>
          )}

          {submitted ? (
            <div className="form-success">
              <p>Merci pour votre message&nbsp;! Nous vous recontacterons rapidement.</p>
              <button type="button" className="btn-submit" onClick={() => setSubmitted(false)}>
                Envoyer un autre message
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-firstname">Prénom</label>
                <input id="contact-firstname" type="text" required placeholder="Votre prénom" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-lastname">Nom</label>
                <input id="contact-lastname" type="text" required placeholder="Votre nom" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" type="email" required placeholder="vous@email.com" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-phone">Téléphone</label>
                <input id="contact-phone" type="tel" placeholder="06 12 34 56 78" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-address">Adresse</label>
                <input id="contact-address" type="text" placeholder="N° et rue" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-city">Ville</label>
                <input id="contact-city" type="text" placeholder="Ville" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-zip">Code postal</label>
                <input id="contact-zip" type="text" placeholder="91170" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Sujet</label>
                <div className="select-wrap">
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {subject === 'autre' && (
              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="contact-other">Précisez le motif</label>
                  <input
                    id="contact-other"
                    type="text"
                    value={otherSubject}
                    onChange={(e) => setOtherSubject(e.target.value)}
                    placeholder="Décrivez votre demande"
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Votre message…"
                  style={{ resize: 'vertical', fontFamily: 'var(--font-corps)', fontSize: 13 }}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">- Envoyer -</button>
          </form>
          )}
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
