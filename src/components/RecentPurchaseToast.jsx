import { useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from '../context/CatalogContext.jsx';

const PEOPLE = ['Inès', 'Sofia', 'Maya', 'Emma', 'Lina', 'Nora', 'Sarah', 'Aya', 'Clara', 'Yasmine', 'Leïla', 'Mina', 'Jade', 'Camille', 'Aïcha', 'Noémie', 'Mélissa', 'Hana', 'Lola', 'Salomé'];
const CITIES = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice', 'Toulouse', 'Nantes', 'Montpellier', 'Lille', 'Strasbourg', 'Rennes', 'Grenoble', 'Dijon', 'Reims', 'Rouen', 'Tours', 'Aix-en-Provence', 'Metz', 'Avignon', 'Angers'];

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

export default function RecentPurchaseToast() {
  const { products } = useCatalog();
  const [showPopup, setShowPopup] = useState(true);
  const [event, setEvent] = useState(null);
  const hideTimeoutRef = useRef(null);

  const productPool = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter((p) => p && p.id && (p.images?.[0] || p.image));
  }, [products]);

  const nextEvent = () => {
    const who = pick(PEOPLE);
    const city = pick(CITIES);
    const minutesAgo = randomMinutesAgo();

    const canUseProducts = productPool.length > 0;
    const isProduct = canUseProducts ? Math.random() < 0.75 : false;

    if (isProduct) {
      const p = pick(productPool);
      setEvent({
        type: 'product',
        who,
        city,
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
      city,
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
    }, 15000);

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
