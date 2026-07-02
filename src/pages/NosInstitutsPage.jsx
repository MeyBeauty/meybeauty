import { MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const planityUrl = 'https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i';

const salon1 = {
  id: 'place-du-marche',
  name: 'Institut – Place du Marché',
  address: '6 Place des Martyrs de Châteaubriand, 91170 Viry-Châtillon',
  phone: '+33 7 49 22 68 01',
  hours: 'Lundi – Samedi : 9h30 – 19h30',
  image: '/mey-beauty%20(1).jpeg',
  services: [
    {
      name: 'Épilation',
      price: 'À partir de 15 €',
      description: 'Une épilation précise, adaptée à toutes les zones du corps et du visage, avec des cires douces pour une peau lisse et un confort optimal.',
    },
    {
      name: 'Épilation définitive',
      price: 'À partir de 55 €',
      description: 'Technologie laser et lumière pulsée pour réduire durablement la repousse des poils et afficher une peau nette au quotidien.',
    },
    {
      name: 'LPG Cellu M6',
      price: 'À partir de 75 €',
      description: 'Soin de remodelage par endermologie pour cibler la cellulite, raffermir la peau et affiner la silhouette en douceur.',
    },
    {
      name: 'Drainage lymphatique',
      price: 'À partir de 70 €',
      description: 'Massage manuel profond pour stimuler la circulation lymphatique, éliminer les toxines et soulager la sensation de jambes lourdes.',
    },
    {
      name: 'Madérothérapie',
      price: 'À partir de 80 €',
      description: 'Soin sculptant à l’aide d’instruments en bois naturel pour déloger la cellulite, modeler le corps et améliorer la circulation.',
    },
    {
      name: 'Soin visage',
      price: 'À partir de 65 €',
      description: 'Rituel nettoyant, hydratant ou anti-âge personnalisé selon votre type de peau pour un teint frais et lumineux.',
    },
    {
      name: 'Spray tan',
      price: 'À partir de 40 €',
      description: 'Bronzage naturel sans UV, uniforme et longue tenue, pour un hâle doré et éclatant sans exposition au soleil.',
    },
    {
      name: 'Beauté du regard',
      price: 'À partir de 25 €',
      description: 'Coloration, rehaussement et soin des cils et sourcils pour ouvrir et intensifier votre regard en toute subtilité.',
    },
    {
      name: 'Onglerie',
      price: 'À partir de 30 €',
      description: 'Manucure, pose de vernis classique ou semi-permanent, et soins pour des mains et des ongles soignés au quotidien.',
    },
    {
      name: 'Tatouage semi-permanent',
      price: 'À partir de 150 €',
      description: 'Sourcils, lèvres ou yeux subtilement rehaussés pour une mise en beauté durable et naturelle au réveil.',
    },
  ],
};

const salon2 = {
  id: 'boulevard-gabriel-peri',
  name: 'Institut – Boulevard Gabriel Péri',
  address: 'Boulevard Gabriel Péri, 91170 Viry-Châtillon',
  phone: '+33 7 49 22 68 01',
  hours: 'Lundi – Samedi : 9h30 – 19h30',
  image: '/mey-beauty%20(5).jpeg',
  services: [
    {
      name: 'Onglerie',
      price: 'À partir de 30 €',
      description: 'Manucure, pose de vernis, semi-permanent et nail art pour des mains sublimées avec une finition irréprochable.',
    },
    {
      name: 'Extensions de cils',
      price: 'À partir de 90 €',
      description: 'Pose de cils à cils ou volume pour un regard intense, sans mascara et adapté à votre morphologie.',
    },
  ],
};

function SalonCard({ salon }) {
  return (
    <section className="institut-card" aria-labelledby={`${salon.id}-title`}>
      <div className="institut-header">
        <div className="institut-image">
          <img src={salon.image} alt={salon.name} />
        </div>
        <div className="institut-info">
          <h2 id={`${salon.id}-title`}>{salon.name}</h2>
          <ul className="institut-meta">
            <li>
              <MapPin size={16} aria-hidden="true" />
              <span>{salon.address}</span>
            </li>
            <li>
              <Phone size={16} aria-hidden="true" />
              <span>{salon.phone}</span>
            </li>
            <li>
              <Clock size={16} aria-hidden="true" />
              <span>{salon.hours}</span>
            </li>
          </ul>
          <a
            href={planityUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-rdv"
          >
            Prendre rendez-vous
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="institut-services">
        <h3>Nos prestations</h3>
        <div className="services-grid">
          {salon.services.map((service) => (
            <div className="service-card" key={service.name}>
              <div className="service-card-head">
                <h4>{service.name}</h4>
                <span className="service-price">{service.price}</span>
              </div>
              <p className="service-description">{service.description}</p>
              <a
                href={planityUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-rdv-outline"
              >
                Prendre rendez-vous
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function NosInstitutsPage() {
  return (
    <>
      <SEO
        title="Nos Instituts - Mey Beauty | Viry-Châtillon (91)"
        description="Découvrez les deux instituts Mey Beauty à Viry-Châtillon : Place du Marché et Boulevard Gabriel Péri. Épilation, soins visage, LPG, onglerie, extensions de cils et plus."
        keywords="institut beauté Viry-Châtillon, Mey Beauty 91, épilation, soin visage, LPG, onglerie, extensions de cils, drainage lymphatique"
      />
      <main className="nos-instituts-page">
        <section className="page-hero-banner" aria-label="Nos instituts">
          <h1>Nos instituts</h1>
          <div className="breadcrumb">
            <a href="#home">Accueil</a>
            <span>/</span>
            <span>Nos instituts</span>
          </div>
        </section>

        <section className="instituts-intro" aria-label="Présentation">
          <div className="instituts-intro-content">
            <h2 className="instituts-intro-title">Nos deux adresses à Viry-Châtillon</h2>
            <p className="instituts-intro-text">
              Mey Beauty vous accueille dans deux instituts à Viry-Châtillon, chacun dédié à des expertises spécifiques pour répondre à tous vos besoins beauté et bien-être. Réservez votre soin en ligne directement sur Planity.
            </p>
          </div>
        </section>

        <div className="instituts-list">
          <SalonCard salon={salon1} />
          <SalonCard salon={salon2} />
        </div>
      </main>
    </>
  );
}
