import { useEffect, useId, useMemo, useRef, useState } from 'react';

const BASE_PLANITY_URL = 'https://www.planity.com/mey-beauty-91170-viry-chatillon-v8i';

function normalizeServiceSetIds(serviceSetIds) {
  if (Array.isArray(serviceSetIds)) return serviceSetIds.filter(Boolean);
  if (typeof serviceSetIds === 'string' && serviceSetIds.trim()) return [serviceSetIds.trim()];
  return [];
}

export default function PlanityWidget({ serviceSetIds, className = '' }) {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const planityKey = import.meta.env.VITE_PLANITY_KEY;

  const embedUrl = useMemo(() => {
    const ids = normalizeServiceSetIds(serviceSetIds);
    const url = new URL('/planity-embed.html', window.location.origin);
    url.searchParams.set('key', planityKey || '');
    if (ids.length > 0) {
      url.searchParams.set('serviceSetIds', ids.join(','));
    }
    return url.toString();
  }, [planityKey, serviceSetIds]);

  const fallbackUrl = useMemo(() => {
    const ids = normalizeServiceSetIds(serviceSetIds);
    if (ids.length > 0) {
      return `${BASE_PLANITY_URL}?serviceSetId=${encodeURIComponent(ids[0])}`;
    }
    return BASE_PLANITY_URL;
  }, [serviceSetIds]);

  useEffect(() => {
    setLoaded(false);
    setError(false);

    const iframe = iframeRef.current;
    if (!iframe) return;

    const timer = setTimeout(() => {
      console.log('[PlanityWidget] iframe load timeout', iframe.src);
      setError(true);
    }, 15000);

    const markLoaded = () => {
      console.log('[PlanityWidget] iframe loaded');
      clearTimeout(timer);
      setLoaded(true);
    };

    iframe.addEventListener('load', markLoaded);

    // Le widget dans l'iframe signale quand Planity a réellement rendu
    const onMessage = (event) => {
      if (event.data && event.data.type === 'planity:loaded') {
        console.log('[PlanityWidget] planity widget rendered');
        markLoaded();
      }
    };
    window.addEventListener('message', onMessage);

    // Si l'iframe est déjà chargé quand React monte l'effet
    try {
      if (iframe.contentWindow && iframe.contentDocument?.readyState === 'complete') {
        markLoaded();
      }
    } catch (e) {
      // cross-origin, on laisse l'événement load gérer
    }

    return () => {
      clearTimeout(timer);
      iframe.removeEventListener('load', markLoaded);
      window.removeEventListener('message', onMessage);
    };
  }, [embedUrl]);

  if (!planityKey) {
    return (
      <div style={messageStyle}>
        Clé Planity manquante. Vérifiez VITE_PLANITY_KEY dans .env.local
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      {!loaded && !error && (
        <div style={loaderOverlayStyle}>
          <div style={spinnerBoxStyle}>
            <div style={spinnerStyle} />
          </div>
          <div style={loaderTitleStyle}>Préparation de votre réservation</div>
          <p style={loaderTextStyle}>
            Sélectionnez votre prestation et votre créneau une fois le module Planity chargé.
          </p>
        </div>
      )}
      {error && (
        <div style={emptyMessageStyle}>
          <p style={emptyTitleStyle}>Le calendrier ne s’est pas chargé</p>
          <p style={emptyTextStyle}>
            Vous pouvez réserver directement sur Planity en cliquant ci-dessous.
          </p>
          <a href={fallbackUrl} target="_blank" rel="noreferrer" style={fallbackLinkStyle}>
            Réserver sur Planity
          </a>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className={className}
        style={iframeStyle}
        title="Réserver sur Planity"
        allow="fullscreen"
      />
    </div>
  );
}

const wrapperStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 420,
  background: '#fff',
  borderRadius: 8,
  overflow: 'hidden',
};

const iframeStyle = {
  width: '100%',
  height: '100%',
  minHeight: 420,
  border: 'none',
  display: 'block',
};

const loaderOverlayStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 16,
  paddingTop: '20%',
  background: 'rgba(255,255,255,0.95)',
};

const spinnerBoxStyle = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: 'rgba(245, 237, 228, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const spinnerStyle = {
  width: 28,
  height: 28,
  border: '3px solid rgba(138,110,90,0.2)',
  borderTopColor: '#8A6E5A',
  borderRadius: '50%',
  animation: 'planity-spin 1s linear infinite',
};

const loaderTitleStyle = {
  fontFamily: 'var(--font-titre), Georgia, serif',
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--brun-dark)',
  textAlign: 'center',
};

const loaderTextStyle = {
  fontFamily: 'var(--font-corps), system-ui, sans-serif',
  fontSize: 13,
  color: 'var(--brun-moyen, #8A6E5A)',
  textAlign: 'center',
  maxWidth: 280,
  lineHeight: 1.5,
  margin: 0,
};

const messageStyle = {
  padding: 24,
  color: '#b91c1c',
  fontFamily: 'var(--font-corps), system-ui, sans-serif',
  fontSize: 14,
  textAlign: 'center',
  background: '#fff',
  borderRadius: 8,
};

const emptyMessageStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  padding: 24,
  textAlign: 'center',
  background: '#fff',
};

const emptyTitleStyle = {
  fontFamily: 'var(--font-titre), Georgia, serif',
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--brun-dark)',
  margin: 0,
};

const emptyTextStyle = {
  fontFamily: 'var(--font-corps), system-ui, sans-serif',
  fontSize: 13,
  color: 'var(--brun-moyen, #8A6E5A)',
  maxWidth: 280,
  lineHeight: 1.5,
  margin: 0,
};

const fallbackLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 22px',
  borderRadius: 999,
  background: 'var(--brun-dark)',
  color: '#fff',
  fontFamily: 'var(--font-corps), system-ui, sans-serif',
  fontSize: 14,
  fontWeight: 500,
  textDecoration: 'none',
};

const PLANITY_ONGLERIE_KEY = '-Ol2BFGQkZio5m1QpVIK';

export function PlanityRaw() {
  const id = useId();
  const safeId = `planity-raw-${id.replace(/:/g, '')}`;

  useEffect(() => {
    const container = document.getElementById(safeId);
    if (!container) return;

    const style = document.createElement('style');
    style.textContent = `
      #planitywl { background-color: #F6F7F8; }
      @media (min-width: 768px) { #planitywl h3 { color: #000000 !important; } }
      #planitywl .planity_bookappointment-button-choose { background-color: #000000; }
      .planity_ui_appointment_background>div:nth-child(2) { padding: 10px; }
      .planity-gift-voucher-button-choose { background-color: #000000 !important; }
      #planitywl>div:nth-child(2)>div:nth-child(2)>div>div>div>div>h2 { color: #000000 !important; }
      #planitywl>div:nth-child(2)>div:nth-child(2)>div>div>div>h2 { color: #000000 !important; }
      #planitywl>div:nth-child(2)>div:nth-child(2)>div>div>div:nth-child(2)>span { color: #000000 !important; }
      #planitywl .planity_bookappointment-button-choose { background-color: #000000; }
    `;
    document.head.appendChild(style);

    const initScript = document.createElement('script');
    initScript.textContent = `
      (function () {
        var container = document.getElementById('${safeId}');
        window.planity = {
          key: '${PLANITY_ONGLERIE_KEY}',
          primaryColor: '#fff',
          appointmentContainer: container,
          options: {}
        };
      })();
    `;
    initScript.async = false;
    document.body.appendChild(initScript);

    const polyfills = document.createElement('script');
    polyfills.src = 'https://d2skjte8udjqxw.cloudfront.net/widget/production/2/polyfills.latest.js';
    polyfills.async = false;
    document.body.appendChild(polyfills);

    const app = document.createElement('script');
    app.src = 'https://d2skjte8udjqxw.cloudfront.net/widget/production/2/app.latest.js';
    app.async = false;
    document.body.appendChild(app);

    return () => {
      style.remove();
      initScript.remove();
      polyfills.remove();
      app.remove();
    };
  }, [safeId]);

  return <div id={safeId} style={{ width: '100%', minHeight: 420 }} />;
}
