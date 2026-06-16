import { Droplets, Eye, Leaf, Sparkles } from 'lucide-react';

const SERVICES = [
  {
    id: 'visage',
    icon: Droplets,
    title: 'Soin du visage',
    text: 'Rituels éclat, nettoyage profond et soins sur-mesure.',
  },
  {
    id: 'minceur',
    icon: Leaf,
    title: 'Minceur & remodelage',
    text: 'LPG, drainage et techniques ciblées pour une silhouette harmonieuse.',
  },
  {
    id: 'regard',
    icon: Eye,
    title: 'Beauté du regard',
    text: 'Rehaussement, teinture, brow lift & sourcils parfaitement dessinés.',
  },
  {
    id: 'blanchiment',
    icon: Sparkles,
    title: 'Blanchiment dentaire',
    text: 'Un sourire lumineux avec une séance confortable et efficace.',
  },
];

export default function FeaturedServices() {
  return (
    <section className="featured-services" aria-label="Prestations célèbres">
      <div className="featured-services-inner">
        <div className="featured-services-header">
          <span className="section-kicker">Prestations</span>
          <h2 className="section-title">Nos 4 prestations les plus demandées</h2>
        </div>

        <div className="featured-services-grid">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="featured-service-card">
                <div className="featured-service-icon" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a className="featured-service-cta" href="#contact">Réserver maintenant</a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
