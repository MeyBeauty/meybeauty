import { useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from '../context/CatalogContext.jsx';

const PEOPLE = ['Inès', 'Sofia', 'Maya', 'Emma', 'Lina', 'Nora', 'Sarah', 'Aya', 'Clara', 'Yasmine', 'Leïla', 'Mina', 'Jade', 'Camille', 'Aïcha', 'Noémie', 'Mélissa', 'Hana', 'Lola', 'Salomé'];
const LOCAL_CITIES = [
  'Viry-Châtillon', 'Draveil', 'Juvisy-sur-Orge', 'Savigny-sur-Orge', 'Athis-Mons',
  'Ris-Orangis', 'Évry', 'Grigny', 'Vigneux-sur-Seine', 'Montgeron', 'Yerres', 'Brunoy',
  'Épinay-sur-Orge', 'Morsang-sur-Orge', 'Orly', 'Paray-Vieille-Poste', 'Villebon-sur-Yvette',
  'Palaiseau', 'Massy', 'Chilly-Mazarin', 'Longjumeau', 'Morangis', 'Wissous',
  'Sainte-Geneviève-des-Bois', 'Saint-Michel-sur-Orge', 'Brétigny-sur-Orge', 'Saintry-sur-Seine',
  'Ballancourt-sur-Essonne', 'Linas', 'Montlhéry', 'Marcoussis', 'Nozay'
];
const CITIES = LOCAL_CITIES;
const SERVICE_CITIES = LOCAL_CITIES;

const SERVICES = [
  { title: 'Soin du visage', image: '/soin%20visage%20(1).PNG' },
  { title: 'Soins minceur et bien‑être', image: '/soin minceur (1).jpg' },
  { title: 'Soin spa', image: '/soin%20visage%20(2).PNG' },
  { title: 'Massages corps', image: '/massage-corps (2).jpg' },
  { title: 'Beauté du regard', image: '/beauté regard (2).jpg' },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomMinutesAgo() {
  return 1 + Math.floor(Math.random() * 15);
}

function getProductImage(p) {
  const img = p?.images?.[0] || p?.image || '';
  return String(img || '').trim() || '/produits/produit (1).webp';
}

const FEATURED_PRODUCT_IDS = new Set([
  'lpg-panty-minceur',
  'lpg-corsaire-sculptant',
  'lpg-concentre-brule-graisses',
  'lpg-reducteur-appetit',
  'lpg-collagene',
  'lpg-stop-peau-orange',
  'lpg-concentre-drainant',
  'lpg-the-bio-minceur',
  'lpg-capteur-sos',
  'lpg-booster-vitalite',
]);

export default function RecentPurchaseToast() {
  const { products } = useCatalog();
  const [showPopup, setShowPopup] = useState(true);
  const [event, setEvent] = useState(null);
  const hideTimeoutRef = useRef(null);

  const productPool = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter((p) => p && FEATURED_PRODUCT_IDS.has(p.id) && (p.images?.[0] || p.image));
  }, [products]);

  const nextEvent = () => {
    const who = pick(PEOPLE);
    const minutesAgo = randomMinutesAgo();

    const canUseProducts = productPool.length > 0;
    const isProduct = canUseProducts ? Math.random() < 0.75 : false;

    if (isProduct) {
      const p = pick(productPool);
      setEvent({
        type: 'product',
        who,
        city: pick(CITIES),
        minutesAgo,
        title: p?.name || 'Produit',
        image: getProductImage(p),
      });
      return;
    }

    const s = pick(SERVICES);
    setEvent({
      type: 'service',
      who,
      city: pick(SERVICE_CITIES),
      minutesAgo,
      title: s?.title || 'Prestation',
      image: s?.image || '/mey-beauty (1).jpeg',
    });
  };

  useEffect(() => {
    nextEvent();
    const intervalId = setInterval(() => {
      nextEvent();
      setShowPopup(true);
    }, 20 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [productPool.length]);

  useEffect(() => {
    if (!showPopup) return;

    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 6500);

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [showPopup, event]);

  if (!showPopup) return null;
  if (!event) return null;

  return (
    <div className="purchase-popup" aria-live="polite">
      <div className="popup-img">
        <img src={event.image} alt={event.title} />
      </div>
      <div className="popup-text">
        <div className="popup-label">{event.type === 'service' ? "Quelqu'un vient de réserver" : "Quelqu'un vient d'acheter"}</div>
        <div className="popup-product">{event.title}</div>
        <div className="popup-time">
          Il y a {event.minutesAgo} minutes · {event.city}, France
        </div>
      </div>
      <button className="popup-close" onClick={() => setShowPopup(false)} aria-label="Fermer">
        ✕
      </button>
    </div>
  );
}
