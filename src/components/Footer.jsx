export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div style={{ marginBottom: 16 }}>
            <a href="#home" aria-label="Aller à l’accueil">
              <img src="/mey-beauty.png" alt="Mey Beauty" style={{ width: 150, height: 'auto' }} />
            </a>
          </div>
          <p className="footer-tagline">
            Des cosmétiques d'exception conçus à Paris pour sublimer chaque carnation avec élégance et raffinement.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="#home">Accueil</a></li>
            <li><a href="#about">À Propos</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Coordonnées</h4>
          <ul>
            <li><a href="#contact">+33 7 49 22 68 01</a></li>
            <li><a href="#contact">contact@meybeauty.fr</a></li>
            <li>
              <a href="#contact">
                6 Place des Martyrs de Châteaubriand
                <br />91170 Viry‑Châtillon
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Horaires</h4>
          <ul>
            <li>Lundi · 10h – 18h</li>
            <li>Mardi · 10h – 18h</li>
            <li>Mercredi · 10h – 18h</li>
            <li>Jeudi · 10h – 18h</li>
            <li>Vendredi · 10h – 21h</li>
            <li>Samedi · 09h – 17h</li>
            <li>Dimanche · Fermé</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Légal</h4>
          <ul>
            <li><a href="#legal">Mentions Légales</a></li>
            <li><a href="#privacy">Politique de Confidentialité</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">© 2024 Mey Beauty Paris. Tous droits réservés.</div>
        <div className="footer-legal">
          <a href="#legal">Mentions Légales</a>
          <a href="#privacy">Politique de Confidentialité</a>
        </div>
      </div>
    </footer>
  );
}
